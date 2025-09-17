import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get display name from user metadata or fallback to email
  const getDisplayName = () => {
    const username = user.user_metadata?.username;
    const displayName = user.user_metadata?.display_name;

    if (username) return `@${username}`;
    if (displayName) return displayName;
    return user.email || "";
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-22">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome to your Dashboard
          </h1>
          <p className="text-base-content/70">
            Hello {getDisplayName()}! Start organizing your movie collection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Movies</h2>
              <p>Track your movie collection</p>
              <div className="card-actions justify-end">
                <button type="button" className="btn btn-primary btn-sm">
                  View Movies
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">TV Series</h2>
              <p>Organize your series and episodes</p>
              <div className="card-actions justify-end">
                <button type="button" className="btn btn-primary btn-sm">
                  View Series
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Watchlist</h2>
              <p>Keep track of what to watch next</p>
              <div className="card-actions justify-end">
                <button type="button" className="btn btn-primary btn-sm">
                  View Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
