import React, { createContext, useContext, useMemo, useRef } from 'react';
import type { Message } from '../../types';

// Generic message renderer type
export type MessageRenderer<T extends Message = Message> = (
  message: T
) => React.ReactElement | null;

// Type-safe registry map
export interface TypeSafeMessageRegistryMap {
  [K in Message.type]?: MessageRenderer<Extract<Message, { type: K }>>;
}

// Extended registry for custom message types
export interface ExtendedMessageRegistryMap extends TypeSafeMessageRegistryMap {
  [key: string]: MessageRenderer<any>;
}

interface TypeSafeMessageRegistryContextValue {
  registryRef: React.MutableRefObject<ExtendedMessageRegistryMap>;
  register: <T extends Message['type']>(
    type: T,
    renderer: MessageRenderer<Extract<Message, { type: T }>>
  ) => void;
  registerCustom: <T = any>(type: string, renderer: MessageRenderer<T>) => void;
  unregister: (type: string) => void;
  get: <T extends Message['type']>(
    type: T
  ) => MessageRenderer<Extract<Message, { type: T }>> | undefined;
  getCustom: (type: string) => MessageRenderer<any> | undefined;
  has: (type: string) => boolean;
  getAllTypes: () => string[];
}

const TypeSafeMessageRegistryContext =
  createContext<TypeSafeMessageRegistryContextValue | null>(null);

export interface TypeSafeMessageRegistryProviderProps {
  initial?: Partial<TypeSafeMessageRegistryMap>;
  children: React.ReactNode;
}

export const TypeSafeMessageRegistryProvider: React.FC<
  TypeSafeMessageRegistryProviderProps
> = ({ initial = {}, children }) => {
  const registryRef = useRef<ExtendedMessageRegistryMap>({ ...initial });

  const value = useMemo<TypeSafeMessageRegistryContextValue>(() => {
    return {
      registryRef,
      register: <T extends Message['type']>(
        type: T,
        renderer: MessageRenderer<Extract<Message, { type: T }>>
      ) => {
        registryRef.current[type] = renderer as MessageRenderer<any>;
      },
      registerCustom: <T = any,>(
        type: string,
        renderer: MessageRenderer<T>
      ) => {
        registryRef.current[type] = renderer as MessageRenderer<any>;
      },
      unregister: (type: string) => {
        delete registryRef.current[type];
      },
      get: <T extends Message['type']>(type: T) => {
        return registryRef.current[type] as
          | MessageRenderer<Extract<Message, { type: T }>>
          | undefined;
      },
      getCustom: (type: string) => {
        return registryRef.current[type];
      },
      has: (type: string) => {
        return type in registryRef.current;
      },
      getAllTypes: () => {
        return Object.keys(registryRef.current);
      },
    };
  }, []);

  return (
    <TypeSafeMessageRegistryContext.Provider value={value}>
      {children}
    </TypeSafeMessageRegistryContext.Provider>
  );
};

export const useTypeSafeMessageRegistry = () => {
  const ctx = useContext(TypeSafeMessageRegistryContext);
  if (!ctx) {
    throw new Error(
      'useTypeSafeMessageRegistry must be used within TypeSafeMessageRegistryProvider'
    );
  }
  return ctx;
};

// Hook for registering message renderers with type safety
export const useMessageRenderer = <T extends Message['type']>(
  type: T,
  renderer: MessageRenderer<Extract<Message, { type: T }>>
) => {
  const { register } = useTypeSafeMessageRegistry();

  React.useEffect(() => {
    register(type, renderer);
  }, [type, renderer, register]);
};

// Hook for registering custom message renderers
export const useCustomMessageRenderer = <T = any,>(
  type: string,
  renderer: MessageRenderer<T>
) => {
  const { registerCustom } = useTypeSafeMessageRegistry();

  React.useEffect(() => {
    registerCustom(type, renderer);
  }, [type, renderer, registerCustom]);
};

// Higher-order component for automatic message type registration
export const withMessageType = <T extends Message['type']>(
  type: T,
  Component: React.ComponentType<{ message: Extract<Message, { type: T }> }>
) => {
  const WrappedComponent: React.FC<{
    message: Extract<Message, { type: T }>;
  }> = (props) => {
    useMessageRenderer(type, (message) => <Component message={message} />);
    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withMessageType(${type})`;
  return WrappedComponent;
};

// Utility for creating message type definitions
export const createMessageType = <T extends string>(
  type: T,
  renderer: MessageRenderer<Message & { type: T }>
) => ({
  type,
  renderer,
  register: (registry: TypeSafeMessageRegistryContextValue) => {
    registry.registerCustom(type, renderer);
  },
});

// Type guard utilities
export const isMessageType = <T extends Message['type']>(
  message: Message,
  type: T
): message is Extract<Message, { type: T }> => {
  return message.type === type;
};

export const isCustomMessageType = (
  message: Message,
  type: string
): boolean => {
  return message.type === type;
};
