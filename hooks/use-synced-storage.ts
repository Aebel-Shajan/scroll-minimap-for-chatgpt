import { useEffect, useState } from "react";
import { storage } from '#imports';


export function useSyncedStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue);

  // Load initial value
  useEffect(() => {
    storage.getItem(`local:${key}`).then(
      (storedValue) => {
        if (storedValue !== undefined && storedValue !== null) {
          setValue(storedValue as T)
        }
      }
    )
  }, [key]);

  // Update storage when value changes
  useEffect(() => {
    storage.setItem(`local:${key}`, value)
  }, [key, value]);

  return [value, setValue] as const;
}
