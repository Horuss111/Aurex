import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ refId: string }> }
) {
  const { refId } = await params;

  const { data, error } = await supabaseAdmin
    .from("card_applications")
    .select("status, submitted_at")
    .eq("reference_id", refId)
    .single();

  if (error || !data) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ status: data.status, submitted_at: data.submitted_at });
}
