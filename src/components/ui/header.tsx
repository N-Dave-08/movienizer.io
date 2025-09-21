"use client";

import { Bookmark, LogOut, Search, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";
import { useWatchlistStore } from "@/lib/stores/watchlist-store";

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuthStore();
  const { items, loadWatchlist, initialized } = useWatchlistStore();

  // Load watchlist when user is available
  useEffect(() => {
    if (user && !initialized) {
      loadWatchlist();
    }
  }, [user, initialized, loadWatchlist]);

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
    <header className="flex items-center justify-center -mb-18 sticky top-4 z-50">
      <nav className="py-3 px-6 w-7xl rounded-box shadow-lg bg-base-100/70 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <button type="button" className="btn btn-ghost btn-lg font-bold">
            <Link href="/"> Moviefy</Link>
          </button>

          <div className="flex items-center gap-2">
            {user && (
              <>
                <Link
                  href="/discover"
                  className="btn btn-ghost btn-circle"
                  title="Discover Movies & Series"
                >
                  <Search className="h-5 w-5" />
                </Link>
                <Link
                  href="/watchlist"
                  className="btn btn-ghost btn-circle relative"
                  title="My Watchlist"
                >
                  <Bookmark className="h-5 w-5" />
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
                <button type="button" className="btn btn-ghost btn-circle">
                  <User className="h-5 w-5" />
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
                  <Link href="/register">Register</Link>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
