import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function useDebouncedState<T>(
  initialState: T,
  delay: number,
): [T, T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState(initialState);
  const [debouncedState, setDebouncedState] = useState(initialState);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedState(state), delay);
    return () => clearTimeout(timer);
  }, [state]);

  return [state, debouncedState, setState];
}
