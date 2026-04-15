import type { Metadata } from "next";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { ContactContent } from "./_content";

export const metadata: Metadata = {
  title: "Contact Aurex — Get in Touch",
  description:
    "Have a question or feedback? Reach out to the Aurex team and we'll get back to you quickly.",
};

export default function ContactPage() {
  return (
    <>
      <DottedSurface className="size-full fixed inset-0 -z-20 bg-[var(--bg)]" />
      <ContactContent />
    </>
  );
}
