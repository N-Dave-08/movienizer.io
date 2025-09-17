"use client";

import { AlertCircle, Mail } from "lucide-react";
import { useRef, useState } from "react";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

// Zod validation schema for magic link signup
const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be less than 20 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type SignupFormData = z.infer<typeof signupSchema>;

interface FormState {
  error: string | null;
  fieldErrors: Partial<Record<keyof SignupFormData, string>>;
  emailSent: boolean;
}

export default function SignupForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
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
    const username = formData.get("username");

    if (typeof email !== "string" || typeof username !== "string") {
      setState({
        error: "Invalid form data",
        fieldErrors: {},
        emailSent: false,
      });
      setIsLoading(false);
      return;
    }

    // Validate form data with Zod
    const validationResult = signupSchema.safeParse({
      email,
      username,
    });

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};

      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (
          fieldName &&
          typeof fieldName === "string" &&
          fieldName in signupSchema.shape
        ) {
          const field = fieldName as keyof SignupFormData;
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
          // Store username in user metadata
          data: {
            username: username,
            display_name: username,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Show success message and store user info
      setUserEmail(email);
      setUsername(username);
      setState({
        error: null,
        fieldErrors: {},
        emailSent: true,
      });

      // Reset the form after successful submission
      formRef.current?.reset();
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
          <p className="text-base-content/70 mb-2">
            We've sent a magic link to <strong>{userEmail}</strong>
          </p>
          <p className="text-base-content/70 mb-4">
            Your username <strong>@{username}</strong> will be set up when you
            click the link.
          </p>
          <p className="text-sm text-base-content/60">
            Click the link in the email to complete your account setup. You can
            close this tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
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

        <label className="label" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className={`input w-full ${state.fieldErrors.username ? "input-error" : ""}`}
          placeholder="Choose a unique username"
          required
        />
        {state.fieldErrors.username && (
          <div className="label">
            <span className="label-text-alt text-error">
              {state.fieldErrors.username}
            </span>
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
          required
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
              Create Account with Magic Link
            </>
          )}
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-base-content/60">
            We'll send you a secure link to create your account without a
            password.
          </p>
        </div>
      </fieldset>
    </form>
  );
}
