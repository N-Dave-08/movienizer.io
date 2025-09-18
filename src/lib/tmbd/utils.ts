import { TMDB_IMAGE_BASE_URL } from "./config";

export function getImageUrl(
  path: string | null,
  size: "w200" | "w300" | "w400" | "w500" | "w780" | "original" = "w500",
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(
  path: string | null,
  size: "w300" | "w780" | "w1280" | "original" = "w1280",
): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
