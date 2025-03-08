import { useEffect } from "react";

export function usePromise<T>(promise: Promise<T>, setValue: (v: T) => void) {
  useEffect(() => {
    promise.then(setValue);
  }, [promise, setValue]);
}
