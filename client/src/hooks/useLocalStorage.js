import { useEffect, useState } from "react";
export default function useLocalStorage(key, initial) {
  const [state, setState] = useState(() => JSON.parse(localStorage.getItem(key) || JSON.stringify(initial)));
  useEffect(() => localStorage.setItem(key, JSON.stringify(state)), [key, state]);
  return [state, setState];
}
