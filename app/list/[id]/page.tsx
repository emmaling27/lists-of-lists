"use client";
import ListView from "@/components/ListView";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Id } from "@/convex/_generated/dataModel";

export default function Page({ params }: { params: { id: Id<"lists"> } }) {
  return (
    <TooltipProvider>
      <ListView listId={params.id} />
    </TooltipProvider>
  );
}
