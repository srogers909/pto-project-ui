import { create, StateCreator } from 'zustand';
import { indexedDBService } from '../../services/indexedDB';

/**
 * Helper function to remove functions from an object
 * This is necessary because IndexedDB cannot store functions
 */
const removeFunctions = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  const result: any = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      // Skip functions
      if (typeof value !== 'function') {
        // Recursively process nested objects
        result[key] = removeFunctions(value);
      }
    }
  }

  return result;
};

/**
 * A simplified persistence middleware for Zustand using IndexedDB
 */
export const persist = <T extends object>(
  config: StateCreator<T>,
  options: { name: string }
) => {
  const { name } = options;

  return (set: any, get: any, api: any) => {
    const configResult = config(
      (state: any) => {
        set(state);
        
        // Save to IndexedDB - remove functions before saving
        const currentState = get();
        const persistableState = removeFunctions(currentState);
        
        indexedDBService.setMapState(name, {
          ...persistableState,
          lastUpdated: Date.now()
        });
      },
      get,
      api
    );

    // Rehydrate from IndexedDB
    (async () => {
      try {
        const storageValue = await indexedDBService.getMapState(name);
        
        if (storageValue) {
          set(storageValue as T);
          console.log('State rehydrated from IndexedDB:', storageValue);
        }
      } catch (e) {
        console.error(`Error rehydrating from IndexedDB: ${e}`);
      }
    })();

    return configResult;
  };
};
