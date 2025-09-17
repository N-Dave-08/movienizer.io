import {
  BookmarkIcon,
  EditIcon,
  LinkIcon,
  MonitorIcon,
  PlayIcon,
  PlusIcon,
  SmartphoneIcon,
  TrashIcon,
  TvIcon,
} from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
            Everything you need to manage your entertainment library and never
            lose track of what you're watching
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Content Management Feature */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary/20 rounded-full">
                  <BookmarkIcon className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="card-title justify-center text-2xl mb-4">
                Content Management
              </h3>
              <p className="text-base-content/70 mb-6">
                Build your personal watchlist with movies, series, and anime.
                Store titles, types, and cover images.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PlusIcon className="w-5 h-5 text-success" />
                  <span>Add movies, series & anime</span>
                </div>
                <div className="flex items-center gap-3">
                  <EditIcon className="w-5 h-5 text-warning" />
                  <span>Edit entry details</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrashIcon className="w-5 h-5 text-error" />
                  <span>Remove unwanted entries</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Tracking Feature */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-secondary/20 rounded-full">
                  <PlayIcon className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <h3 className="card-title justify-center text-2xl mb-4">
                Progress Tracking
              </h3>
              <p className="text-base-content/70 mb-6">
                Never lose your place again. Track episodes and timestamps
                across all your content.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-info rounded-full flex items-center justify-center">
                    <span className="text-xs text-info-content font-bold">
                      E
                    </span>
                  </div>
                  <span>Track current episode</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <span className="text-xs text-accent-content font-bold">
                      T
                    </span>
                  </div>
                  <span>Save movie timestamps</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                    <span className="text-xs text-success-content font-bold">
                      S
                    </span>
                  </div>
                  <span>Sync with Supabase</span>
                </div>
              </div>
            </div>
          </div>

          {/* Multi-Platform Support Feature */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-accent/20 rounded-full">
                  <LinkIcon className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="card-title justify-center text-2xl mb-4">
                Multi-Platform Sources
              </h3>
              <p className="text-base-content/70 mb-6">
                Connect multiple streaming sources and choose where to continue
                watching from any platform.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MonitorIcon className="w-5 h-5 text-primary" />
                  <span>9anime, AnimePahe & more</span>
                </div>
                <div className="flex items-center gap-3">
                  <TvIcon className="w-5 h-5 text-secondary" />
                  <span>Episode pattern matching</span>
                </div>
                <div className="flex items-center gap-3">
                  <SmartphoneIcon className="w-5 h-5 text-accent" />
                  <span>Choose your platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
