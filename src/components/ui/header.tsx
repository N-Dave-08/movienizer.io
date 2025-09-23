"use client";

import { Bookmark, LogOut, Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuthStore();
  const { items } = useWatchlistStore();

  const handleSignOut = async () => {
    await signOut(() => {
      router.push("/login");
    });
  };

  // Get display name from user metadata or fallback to email
  const getDisplayName = () => {
    if (!user) return "";

    // Check for username in user metadata
    const username = user.user_metadata?.username;
    // const displayName = user.user_metadata?.display_name;

    if (username) return `@${username}`;

    return user.email || "";
  };

  return (
    <header className="flex items-center justify-center -mb-18 sticky top-0 md:top-4 z-50">
      <nav className="md:py-3 md:px-6 w-7xl md:rounded-box shadow-lg bg-base-100/70 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <button
            type="button"
            className="btn btn-ghost md:btn-lg btn-md md:font-bold font-semibold"
          >
            <Link href="/"> Moviefy</Link>
          </button>

          <div className="flex items-center gap-2">
            {user && (
              <>
                <Link
                  href="/discover"
                  className="btn btn-ghost btn-circle btn-sm md:btn-md"
                  title="Discover Movies & Series"
                >
                  <Search className="h-4 w-4 md:h-5 md:w-5" />
                </Link>
                <Link
                  href="/watchlist"
                  className="btn btn-ghost btn-circle btn-sm md:btn-md relative"
                  title="My Watchlist"
                >
                  <Bookmark className="h-4 w-4 md:h-5 md:w-5" />
                  {items.length > 0 && (
                    <div className="badge badge-sm badge-primary absolute -top-1 -right-1">
                      {items.length > 99 ? "99+" : items.length}
                    </div>
                  )}
                </Link>
              </>
            )}

            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : user ? (
              <div className="dropdown dropdown-end">
                <button
                  type="button"
                  className="btn btn-ghost btn-circle btn-sm md:btn-md"
                >
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                </button>
                <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li>
                    <div className="text-sm flex flex-col items-start">
                      <div className="text-base-content/70 truncate">
                        {getDisplayName()}
                      </div>
                      {user.user_metadata?.username && (
                        <div className="text-xs text-base-content/50 truncate">
                          {user.email}
                        </div>
                      )}
                    </div>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="text-error"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button type="button" className="btn btn-ghost">
                  <Link href="/login">Login</Link>
                </button>
                <button type="button" className="btn btn-primary">
                  <Link href="/signup">Register</Link>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
