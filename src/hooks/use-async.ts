 import { useState, useCallback } from 'react';
 
 interface AsyncState<T> {
   data: T | null;
   isLoading: boolean;
   error: Error | null;
 }
 
 interface UseAsyncOptions<T> {
   onSuccess?: (data: T) => void;
   onError?: (error: Error) => void;
 }
 
 export function useAsync<T>(
   asyncFunction: (...args: unknown[]) => Promise<T>,
   options: UseAsyncOptions<T> = {}
 ) {
   const [state, setState] = useState<AsyncState<T>>({
     data: null,
     isLoading: false,
     error: null,
   });
 
   const execute = useCallback(
     async (...args: unknown[]) => {
       setState((prev) => ({ ...prev, isLoading: true, error: null }));
       try {
         const data = await asyncFunction(...args);
         setState({ data, isLoading: false, error: null });
         options.onSuccess?.(data);
         return data;
       } catch (error) {
         const err = error instanceof Error ? error : new Error(String(error));
         setState({ data: null, isLoading: false, error: err });
         options.onError?.(err);
         throw err;
       }
     },
     [asyncFunction, options.onSuccess, options.onError]
   );
 
   const reset = useCallback(() => {
     setState({ data: null, isLoading: false, error: null });
   }, []);
 
   return {
     ...state,
     execute,
     reset,
   };
 }
 
 // Simplified loading state hook for simpler use cases
 export function useLoadingState(initialState = false) {
   const [isLoading, setIsLoading] = useState(initialState);
   
   const startLoading = useCallback(() => setIsLoading(true), []);
   const stopLoading = useCallback(() => setIsLoading(false), []);
   
   const withLoading = useCallback(
     async <T>(asyncFn: () => Promise<T>): Promise<T> => {
       setIsLoading(true);
       try {
         return await asyncFn();
       } finally {
         setIsLoading(false);
       }
     },
     []
   );
 
   return { isLoading, startLoading, stopLoading, withLoading };
 }