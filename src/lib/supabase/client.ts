import { createBrowserClient } from "@supabase/ssr";

// Default client with localStorage (remember me enabled by default)
export function createClient(rememberMe = true) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: rememberMe ? localStorage : sessionStorage,
      persistSession: true,
    },
  });
}
