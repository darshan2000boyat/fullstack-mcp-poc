import { debounce } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  initialValue?: string;
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = "Search...",
  className,
  initialValue,
  onSearch,
}) => {
  const [query, setQuery] = useState<string>("");
  const debouncedSearch = useRef(
    debounce((query: string) => onSearch(query), 500),
  ).current;

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <input
      type="text"
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
      className={`w-full rounded-lg border border-gray-300 px-4 py-2 ${className}`}
    />
  );
};

export default SearchInput;
