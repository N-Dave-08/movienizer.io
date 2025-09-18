import { tmdbFetch } from "./client";
import type { Movie, TMDBResponse, TVShow } from "./types";

export async function getTrendingMovies(
  timeWindow: "day" | "week" = "week",
): Promise<TMDBResponse<Movie>> {
  return tmdbFetch(`/trending/movie/${timeWindow}`);
}

export async function getTrendingTVShows(
  timeWindow: "day" | "week" = "week",
): Promise<TMDBResponse<TVShow>> {
  return tmdbFetch(`/trending/tv/${timeWindow}`);
}

export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<TMDBResponse<Movie>> {
  const encodedQuery = encodeURIComponent(query);
  return tmdbFetch(`/search/movie?query=${encodedQuery}&page=${page}`);
}

export async function searchTVShows(
  query: string,
  page: number = 1,
): Promise<TMDBResponse<TVShow>> {
  const encodedQuery = encodeURIComponent(query);
  return tmdbFetch(`/search/tv?query=${encodedQuery}&page=${page}`);
}

export async function getMovieDetails(movieId: number): Promise<Movie> {
  return tmdbFetch(`/movie/${movieId}`);
}

export async function getTVShowDetails(tvId: number): Promise<TVShow> {
  return tmdbFetch(`/tv/${tvId}`);
}
