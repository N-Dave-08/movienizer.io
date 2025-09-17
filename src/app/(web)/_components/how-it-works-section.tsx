export default function HowItWorksSection() {
  return (
    <div className="flex-1">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-xl text-base-content/70">
          Simple steps to organize your entertainment
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-content font-bold text-xl flex-shrink-0">
            1
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Add Content</h3>
            <p className="text-base-content/70">
              Add your favorite movies, series, and anime to your library
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-secondary-content font-bold text-xl flex-shrink-0">
            2
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Add Sources</h3>
            <p className="text-base-content/70">
              Connect streaming links from your preferred platforms
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-content font-bold text-xl flex-shrink-0">
            3
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
            <p className="text-base-content/70">
              Update your watching progress as you go
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center text-success-content font-bold text-xl flex-shrink-0">
            4
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Continue Watching</h3>
            <p className="text-base-content/70">
              Pick up exactly where you left off on any platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
