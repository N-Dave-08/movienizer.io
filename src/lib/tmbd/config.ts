export const TMDB_BASE_URL = "https://api.themoviedb.org/3";
export const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

// TMDB API Key should be set in your environment variables
export const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

if (!TMDB_API_KEY) {
  console.warn(
    "TMDB API key not found. Please set NEXT_PUBLIC_TMDB_API_KEY in your environment variables.",
  );
}
