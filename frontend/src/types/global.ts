export interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  debouncedQuery: string;
  isSearching: boolean;
  clearSearch: () => void;
}
