import ListView from "@/components/ListView";
import { Id } from "@/convex/_generated/dataModel";

export default function Page({ params }: { params: { id: Id<"lists"> } }) {
  return <ListView listId={params.id} />;
}
