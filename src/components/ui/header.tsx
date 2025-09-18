"use client";

import { LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function Header() {
  const router = useRouter();
  const { user, loading, signOut } = useAuthStore();

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
    const displayName = user.user_metadata?.display_name;

    if (username) return `@${username}`;
    if (displayName) return displayName;
    return user.email || "";
  };

  return (
    <header className="flex items-center justify-center -mb-18 sticky top-4 z-50">
      <nav className="py-3 px-6 w-7xl rounded-box shadow-lg bg-base-100/70 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <button type="button" className="btn btn-ghost btn-lg font-bold">
            <Link href="/"> MovieNizer</Link>
          </button>

          <div className="flex items-center gap-2">
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
                  <Link href="/login">Sign In</Link>
                </button>
                <button type="button" className="btn btn-primary">
                  <Link href="/signup">Get Started</Link>
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
