import { PlusIcon } from "lucide-react";

export default function CTASection() {
  return (
    <div className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-content p-8 rounded-2xl">
      <div className="max-w-lg">
        <h2 className="text-4xl font-bold mb-6">
          Ready to Organize Your Entertainment?
        </h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of users who never lose track of their favorite shows
          and movies
        </p>
        <button type="button" className="btn btn-neutral btn-lg">
          <PlusIcon className="w-5 h-5" />
          Start Your Library
        </button>
      </div>
    </div>
  );
}
