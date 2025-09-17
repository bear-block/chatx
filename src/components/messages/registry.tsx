import React, { createContext, useContext, useMemo, useRef } from 'react';
import type { Message } from '../../types';

export type MessageRenderer = (message: Message) => React.ReactElement | null;

export interface MessageRegistryMap {
  [type: string]: MessageRenderer;
}

interface MessageRegistryContextValue {
  registryRef: React.MutableRefObject<MessageRegistryMap>;
  register: (type: string, renderer: MessageRenderer) => void;
  unregister: (type: string) => void;
  get: (type?: string) => MessageRenderer | undefined;
}

const MessageRegistryContext =
  createContext<MessageRegistryContextValue | null>(null);

export const MessageRegistryProvider: React.FC<{
  initial?: MessageRegistryMap;
  children: React.ReactNode;
}> = ({ initial, children }) => {
  const registryRef = useRef<MessageRegistryMap>({ ...(initial || {}) });

  const value = useMemo<MessageRegistryContextValue>(() => {
    return {
      registryRef,
      register: (type: string, renderer: MessageRenderer) => {
        registryRef.current[type] = renderer;
      },
      unregister: (type: string) => {
        delete registryRef.current[type];
      },
      get: (type?: string) => (type ? registryRef.current[type] : undefined),
    };
  }, []);

  return (
    <MessageRegistryContext.Provider value={value}>
      {children}
    </MessageRegistryContext.Provider>
  );
};

export const useMessageRegistry = () => {
  const ctx = useContext(MessageRegistryContext);
  if (!ctx) {
    throw new Error(
      'useMessageRegistry must be used within MessageRegistryProvider'
    );
  }
  return ctx;
};
