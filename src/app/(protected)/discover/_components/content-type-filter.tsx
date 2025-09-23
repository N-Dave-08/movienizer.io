type ContentType = "movies" | "tv" | "all";

interface ContentTypeFilterProps {
  contentType: ContentType;
  onContentTypeChange: (type: ContentType) => void;
}

export function ContentTypeFilter({
  contentType,
  onContentTypeChange,
}: ContentTypeFilterProps) {
  return (
    <div className="flex items-center gap-4 bg-base-200 p-4 rounded-lg">
      <span className="font-medium">Filter Results:</span>
      <div className="join space-x-2">
        <button
          type="button"
          className={`btn join-item btn-sm ${
            contentType === "all" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => onContentTypeChange("all")}
        >
          All
        </button>
        <button
          type="button"
          className={`btn join-item btn-sm ${
            contentType === "movies" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => onContentTypeChange("movies")}
        >
          Movies
        </button>
        <button
          type="button"
          className={`btn join-item btn-sm ${
            contentType === "tv" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => onContentTypeChange("tv")}
        >
          Series
        </button>
      </div>
    </div>
  );
}
