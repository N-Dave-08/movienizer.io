import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();

    // This automatically clears cookies when using @supabase/ssr
    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);

    // Even if signOut fails, return success to avoid UI issues
    return NextResponse.json({ success: true });
  }
}
