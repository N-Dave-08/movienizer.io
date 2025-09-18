import { TMDB_API_KEY, TMDB_BASE_URL } from "./config";

export async function tmdbFetch<T>(endpoint: string): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new Error("TMDB API key is not configured");
  }

  const response = await fetch(`${TMDB_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${TMDB_API_KEY}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 * 5 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(
      `TMDB API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}
