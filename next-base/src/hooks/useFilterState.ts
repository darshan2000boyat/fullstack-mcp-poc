import { FilterState, UpdateStateFunction } from "@/typings/common";
import { useState } from "react";
export const useFilterState = (initialState: FilterState = {}) => {
  const [state, setState] = useState<FilterState>({
    ...initialState,
  });

  const updateState: UpdateStateFunction = (updates) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  };

  return { state, updateState };
};
