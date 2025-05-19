import { useState, useEffect, useCallback } from 'react';
import { indexedDBService } from '../services/indexedDB';

/**
 * Custom hook for using IndexedDB state
 * @param storeName The store name ('mapState' or 'userSettings')
 * @param key The key to store/retrieve the value
 * @param initialValue The initial value if no value exists in IndexedDB
 * @returns [value, updateValue, { loading, error }]
 */
export function useIndexedDBState<T>(
  storeName: 'mapState' | 'userSettings',
  key: string,
  initialValue: T
) {
  const [value, setValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial value from IndexedDB
  useEffect(() => {
    const loadValue = async () => {
      try {
        setLoading(true);
        let storedValue;
        
        if (storeName === 'mapState') {
          storedValue = await indexedDBService.getMapState(key);
        } else {
          storedValue = await indexedDBService.getUserSetting(key);
        }
        
        if (storedValue !== undefined) {
          // Use type assertion to ensure type compatibility
          setValue(storedValue as T);
        }
        setLoading(false);
      } catch (e) {
        console.error(`Error loading from IndexedDB: ${e}`);
        setError(e instanceof Error ? e : new Error(String(e)));
        setLoading(false);
      }
    };

    loadValue();
  }, [key, storeName]);

  // Update value in IndexedDB
  const updateValue = useCallback(
    async (newValue: T) => {
      try {
        setValue(newValue);
        
        if (storeName === 'mapState') {
          await indexedDBService.setMapState(key, newValue);
        } else {
          await indexedDBService.setUserSetting(key, newValue);
        }
      } catch (e) {
        console.error(`Error saving to IndexedDB: ${e}`);
        setError(e instanceof Error ? e : new Error(String(e)));
      }
    },
    [key, storeName]
  );

  return [value, updateValue, { loading, error }] as const;
}
