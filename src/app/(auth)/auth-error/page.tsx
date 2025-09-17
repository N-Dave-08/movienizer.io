import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-error mb-2">
          Authentication Error
        </h1>
        <p className="text-base-content/70">
          There was a problem with your magic link
        </p>
      </div>

      <div className="fieldset bg-base-200 rounded-box w-96 p-6 shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-error/20 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-error" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Invalid or Expired Link
          </h2>
          <p className="text-base-content/70 mb-4">
            The magic link you clicked is either invalid or has expired.
          </p>
          <p className="text-sm text-base-content/60 mb-6">
            Magic links expire after a certain time for security reasons. Please
            request a new one.
          </p>

          <Link href="/login" className="btn btn-neutral w-full">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
}
