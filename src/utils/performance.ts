import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useChatConfig } from '../config/ChatConfigProvider';

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private enabled: boolean = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  startTiming(label: string): void {
    if (!this.enabled) return;
    this.metrics.set(label, performance.now());
  }

  endTiming(label: string): number | null {
    if (!this.enabled) return null;

    const startTime = this.metrics.get(label);
    if (startTime === undefined) return null;

    const duration = performance.now() - startTime;
    this.metrics.delete(label);

    if (__DEV__) {
      console.log(`Performance: ${label} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measure<T>(label: string, fn: () => T): T {
    this.startTiming(label);
    const result = fn();
    this.endTiming(label);
    return result;
  }

  async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTiming(label);
    const result = await fn();
    this.endTiming(label);
    return result;
  }
}

// Memoization utilities
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const ref = useRef(callback);
  ref.current = callback;

  return useCallback(...args: any[]) => ref.current(...args), []) as T;
};

export const useStableValue = <T>(value: T): T => {
  const ref = useRef(value);
  ref.current = value;
  return ref.current;
};

// Message memoization
export const useMessageMemo = <T>(message: T, deps: any[]): T => {
  const { enableMessageMemoization } = useChatConfig();

  return useMemo(() => {
    if (!enableMessageMemoization) return message;
    return message;
  }, deps);
};

// Image lazy loading
export const useImageLazyLoading = (url: string, enabled: boolean = true) => {
  const { enableImageLazyLoading } = useChatConfig();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled || !enableImageLazyLoading) {
      setLoaded(true);
      return;
    }

    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setError(true);
    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url, enabled, enableImageLazyLoading]);

  return { loaded, error };
};

// Virtualization utilities
export const useVirtualization = (
  items: any[],
  itemHeight: number,
  containerHeight: number,
  enabled: boolean = true
) => {
  const { enableVirtualization } = useChatConfig();
  const [scrollOffset, setScrollOffset] = useState(0);

  if (!enabled || !enableVirtualization) {
    return {
      visibleItems: items,
      startIndex: 0,
      endIndex: items.length - 1,
      totalHeight: items.length * itemHeight,
      setScrollOffset,
    };
  }

  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2; // Buffer
  const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - 1);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount);

  const visibleItems = items.slice(startIndex, endIndex + 1);
  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    startIndex,
    endIndex,
    totalHeight,
    setScrollOffset,
  };
};

// Debounce utility
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle utility
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: any[]) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  ) as T;
};

// Memory management
export class MemoryManager {
  private static instance: MemoryManager;
  private cache: Map<string, any> = new Map();
  private maxSize: number = 100;

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  setMaxSize(size: number) {
    this.maxSize = size;
  }

  set(key: string, value: any): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Performance hooks
export const usePerformanceMonitor = (_label: string) => {
  const { enablePerformanceMonitoring } = useChatConfig();
  const monitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    if (enablePerformanceMonitoring) {
      monitor.enable();
    } else {
      monitor.disable();
    }
  }, [enablePerformanceMonitoring, monitor]);

  const startTiming = useCallback(() => {
    monitor.startTiming(label);
  }, [monitor, label]);

  const endTiming = useCallback(() => {
    return monitor.endTiming(label);
  }, [monitor, label]);

  return { startTiming, endTiming };
};

// Bundle size optimization
export const lazyImport = <T>(importFn: () => Promise<T>) => {
  let component: T | null = null;
  let promise: Promise<T> | null = null;

  return () => {
    if (component) return Promise.resolve(component);
    if (promise) return promise;

    promise = importFn().then(module) => {
      component = module;
      return module;
    });

    return promise;
  };
};
