import { Grid3X3, List } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterGroup {
  key: string;
  label: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

interface FiltersProps {
  filterGroups: FilterGroup[];
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  showViewToggle?: boolean;
}

export function Filters({
  filterGroups,
  viewMode,
  onViewModeChange,
  showViewToggle = true,
}: FiltersProps) {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      {/* Mobile Dropdowns */}
      <div className="flex flex-col gap-3 md:hidden">
        <div className="flex items-center justify-between">
          <span className="font-medium">Filters</span>
          {showViewToggle && onViewModeChange && (
            <div className="join space-x-2">
              <button
                type="button"
                className={`btn join-item btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline"}`}
                onClick={() => onViewModeChange("grid")}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                className={`btn join-item btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline"}`}
                onClick={() => onViewModeChange("list")}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div
          className={`grid gap-3 ${filterGroups.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}
        >
          {filterGroups.map((group) => (
            <div key={group.key} className="form-control">
              <label htmlFor={`${group.key}-filter`} className="label">
                <span className="label-text text-sm">{group.label}</span>
              </label>
              <select
                id={`${group.key}-filter`}
                className="select select-sm select-bordered"
                value={group.value}
                onChange={(e) => group.onChange(e.target.value)}
              >
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {filterGroups.map((group) => (
            <div
              key={group.key}
              className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
            >
              <span className="font-medium">{group.label}:</span>
              <div className="join space-x-2">
                {group.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`btn join-item btn-sm ${group.value === option.value ? "btn-primary" : "btn-outline"}`}
                    onClick={() => group.onChange(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* View Toggle */}
        {showViewToggle && onViewModeChange && (
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <span className="font-medium">View:</span>
            <div className="join space-x-2">
              <button
                type="button"
                className={`btn join-item btn-sm ${viewMode === "grid" ? "btn-primary" : "btn-outline"}`}
                onClick={() => onViewModeChange("grid")}
                title="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                className={`btn join-item btn-sm ${viewMode === "list" ? "btn-primary" : "btn-outline"}`}
                onClick={() => onViewModeChange("list")}
                title="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
