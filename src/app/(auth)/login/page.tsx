import LoginForm from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
        <p className="text-base-content/70">
          Enter your email to receive a magic link
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
