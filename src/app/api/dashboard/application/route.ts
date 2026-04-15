import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress;
  if (!email) return Response.json({ error: "No email found" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("card_applications")
    .select("*")
    .eq("email", email)
    .order("submitted_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ applications: data ?? [] });
}
