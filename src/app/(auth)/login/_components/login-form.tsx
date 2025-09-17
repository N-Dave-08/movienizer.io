"use client";

import { AlertCircle, Mail } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

// Zod validation schema for magic link login
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface FormState {
  error: string | null;
  fieldErrors: Partial<Record<keyof LoginFormData, string>>;
  emailSent: boolean;
}

export default function LoginForm() {
  const [state, setState] = useState<FormState>({
    error: null,
    fieldErrors: {},
    emailSent: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // Default to true as per best practice

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setState({ error: null, fieldErrors: {}, emailSent: false });

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    if (typeof email !== "string") {
      setState({
        error: "Invalid email format",
        fieldErrors: {},
        emailSent: false,
      });
      setIsLoading(false);
      return;
    }

    // Validate form data with Zod
    const validationResult = loginSchema.safeParse({
      email,
    });

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};

      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (
          fieldName &&
          typeof fieldName === "string" &&
          fieldName in loginSchema.shape
        ) {
          const field = fieldName as keyof LoginFormData;
          if (!fieldErrors[field]) {
            fieldErrors[field] = issue.message;
          }
        }
      });

      setState({
        error: null,
        fieldErrors,
        emailSent: false,
      });
      setIsLoading(false);
      return;
    }

    try {
      // Create Supabase client with the user's remember me preference
      const supabase = createClient(rememberMe);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // The URL the user will be redirected to after clicking the magic link
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Show success message
      setState({
        error: null,
        fieldErrors: {},
        emailSent: true,
      });
    } catch (error) {
      setState({
        error: error instanceof Error ? error.message : "An error occurred",
        fieldErrors: {},
        emailSent: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show success state after email is sent
  if (state.emailSent) {
    return (
      <div className="fieldset bg-base-200 rounded-box w-96 p-6 shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-success/20 p-3 rounded-full">
              <Mail className="h-8 w-8 text-success" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Check your email</h2>
          <p className="text-base-content/70 mb-4">
            We've sent you a magic link to sign in to your account.
          </p>
          <p className="text-sm text-base-content/60">
            Click the link in the email to continue. You can close this tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset
        className="fieldset bg-base-200 rounded-box w-96 p-6 shadow-lg"
        disabled={isLoading}
      >
        {state.error && (
          <div className="alert alert-error mb-4">
            <AlertCircle className="h-4 w-4" />
            <span>{state.error}</span>
          </div>
        )}

        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`input w-full ${state.fieldErrors.email ? "input-error" : ""}`}
          placeholder="Enter your email address"
        />
        {state.fieldErrors.email && (
          <div className="label">
            <span className="label-text-alt text-error">
              {state.fieldErrors.email}
            </span>
          </div>
        )}

        {/* Remember Me Checkbox */}
        <div className="form-control mt-4">
          <label className="label cursor-pointer justify-start gap-3 pb-1">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="label-text">Remember me</span>
          </label>
          <p className="text-sm text-base-content/60 ml-7">
            {rememberMe
              ? "Stay signed in across browser sessions"
              : "Sign out when browser is closed"}
          </p>
        </div>

        <button
          type="submit"
          className="btn btn-neutral mt-4 w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Sending magic link...
            </>
          ) : (
            <>
              <Mail className="h-4 w-4" />
              Send Magic Link
            </>
          )}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-base-content/60">
            We'll send you a secure link to sign in without a password.
          </p>
        </div>
      </fieldset>
    </form>
  );
}
