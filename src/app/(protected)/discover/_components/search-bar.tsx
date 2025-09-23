import { Search, X } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
}: SearchBarProps) {
  return (
    <div className="w-full">
      <label className="input w-full">
        <Search className="h-[1em] opacity-50" />
        <input
          type="text"
          placeholder="Search for movies and series..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={onClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50 hover:text-base-content"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </label>
    </div>
  );
}
