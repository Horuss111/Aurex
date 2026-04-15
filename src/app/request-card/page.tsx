import type { Metadata } from "next";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { RequestCardContent } from "./_content";

export const metadata: Metadata = {
  title: "Request an Aurex Card — Apply in Minutes",
  description:
    "Apply for your Aurex premium payment card. Instant decision, zero annual fee, accepted in 150+ countries.",
};

export default function RequestCardPage() {
  return (
    <>
      <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
      <RequestCardContent />
    </>
  );
}
