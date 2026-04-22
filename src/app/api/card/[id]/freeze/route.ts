import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { frozen } = await request.json();

  if (typeof frozen !== "boolean") {
    return Response.json({ error: "frozen must be a boolean" }, { status: 400 });
  }

  // Verify the application belongs to the authenticated user
  const { data: app, error: fetchError } = await supabaseAdmin
    .from("card_applications")
    .select("id, user_id, email")
    .eq("id", id)
    .single();

  if (fetchError || !app) {
    return Response.json({ error: "Application not found" }, { status: 404 });
  }

  if (app.user_id !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("card_applications")
    .update({ is_frozen: frozen })
    .eq("id", id);

  if (updateError) {
    console.error("Freeze update error:", updateError.message);
    return Response.json({ error: "Failed to update card status" }, { status: 500 });
  }

  return Response.json({ success: true, frozen });
}
