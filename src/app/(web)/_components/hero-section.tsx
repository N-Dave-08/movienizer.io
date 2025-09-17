import { ChevronRight } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="hero bg-gradient-to-br from-neutral/10 to-secondary/10 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MovieNizer
          </h1>
          <p className="text-xl py-6 text-base-content/80 max-w-2xl mx-auto">
            Your ultimate entertainment companion. Organize your movies, series,
            and anime. Track your progress across multiple platforms and never
            lose your place again.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button type="button" className="btn btn-primary btn-lg">
              Get Started
              <ChevronRight className="w-5 h-5" />
            </button>
            <button type="button" className="btn btn-outline btn-lg">
              See How it Works
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
