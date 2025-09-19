import { tmdbFetch } from "./client";
import type {
  Movie,
  TMDBResponse,
  TVEpisodeDetails,
  TVSeasonDetails,
  TVShow,
  TVShowDetails,
} from "./types";

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

// New TV show episode tracking API functions
export async function getTVShowWithSeasons(
  tvId: number,
): Promise<TVShowDetails> {
  return tmdbFetch(`/tv/${tvId}`);
}

export async function getTVSeason(
  tvId: number,
  seasonNumber: number,
): Promise<TVSeasonDetails> {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
}

export async function getTVEpisode(
  tvId: number,
  seasonNumber: number,
  episodeNumber: number,
): Promise<TVEpisodeDetails> {
  return tmdbFetch(
    `/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`,
  );
}
