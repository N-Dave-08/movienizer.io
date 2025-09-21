import SignupForm from "./_components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Join Moviefy</h1>
        <p className="text-base-content/70">
          Create your account with just your email - no password required
        </p>
      </div>
      <SignupForm />
    </div>
  );
}
