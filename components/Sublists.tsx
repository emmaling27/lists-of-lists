import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";

export default function Sublists({ listId }: { listId: Id<"lists"> }) {
  const sublists = useQuery(api.list.otherSublists, { listId });
  return (
    <div className="flex flex-col gap-2">
      {sublists?.map((sublist) => (
        <div key={sublist._id}>{sublist.name}</div>
      ))}
    </div>
  );
}
