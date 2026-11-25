import { useCallback } from "react";
import _debounce from "lodash/debounce";

function useDebounce(func: any, miliseconds: number = 500) {
  return useCallback(_debounce(func, miliseconds), []);
}

export default useDebounce;
