"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import NewItemForm from "./NewItemForm";

export default function ListView({ listId }: { listId: Id<"lists"> }) {
  const listData = useQuery(api.list.listData, { listId });
  return (
    <div>
      <h1>{listData?.name}</h1>
      <ul>
        {listData?.items.map((item) => (
          <li key={item._id}>{item.name}</li>
        ))}
      </ul>
      <NewItemForm listId={listId} />
    </div>
  );
}
