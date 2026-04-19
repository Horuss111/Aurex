import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;

  // Query by userId (reliable) with email fallback for older rows
  let query = supabaseAdmin
    .from("card_applications")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (email) {
    query = query.or(`user_id.eq.${userId},email.eq.${email}`);
  } else {
    query = query.eq("user_id", userId);
  }

  const { data, error } = await query;

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ applications: data ?? [] });
}
