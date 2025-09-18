"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth-store";

export default function HeroSection() {
  const { user, loading } = useAuthStore();

  // Get display name from user metadata or fallback to email
  const getDisplayName = () => {
    if (!user) return "";

    const username = user.user_metadata?.username;
    const displayName = user.user_metadata?.display_name;

    if (username) return `@${username}`;
    if (displayName) return displayName;
    return user.email || "";
  };

  return (
    <div className="hero bg-gradient-to-br from-neutral/10 to-secondary/10 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MovieNizer
          </h1>

          {loading ? (
            <div className="py-6">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : user ? (
            // Authenticated state
            <>
              <p className="text-xl py-6 text-base-content/80 max-w-2xl mx-auto">
                Welcome back, {getDisplayName()}! Ready to continue organizing
                your entertainment collection?
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/watchlist" className="btn btn-primary btn-lg">
                  Go to Watchlist
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <button type="button" className="btn btn-outline btn-lg">
                  See How it Works
                </button>
              </div>
            </>
          ) : (
            // Unauthenticated state
            <>
              <p className="text-xl py-6 text-base-content/80 max-w-2xl mx-auto">
                Your ultimate entertainment companion. Organize your movies,
                series, and anime. Track your progress across multiple platforms
                and never lose your place again.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link href="/signup" className="btn btn-primary btn-lg">
                  Get Started
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <button type="button" className="btn btn-outline btn-lg">
                  See How it Works
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
