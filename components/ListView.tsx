"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import NewItemForm from "./NewItemForm";
import Item from "./Item";

export default function ListView({ listId }: { listId: Id<"lists"> }) {
  const listData = useQuery(api.list.listData, { listId });
  return (
    <div>
      <h1>{listData?.name}</h1>
      <ul>
        {listData?.items.map((item) => (
          <Item key={item._id} listId={listId} item={item} />
        ))}
      </ul>
      <NewItemForm listId={listId} />
    </div>
  );
}
