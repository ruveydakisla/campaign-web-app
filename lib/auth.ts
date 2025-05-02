import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function requireUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          timestamp: new Date().toISOString(),
          error: "Bu işlemi gerçekleştirmek için giriş yapmalısınız.",
        },
        { status: 401 }
      ),
    };
  }

  return { user, response: null };
}
