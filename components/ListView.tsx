"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import NewItemForm from "./NewItemForm";
import Item from "./Item";
import { Button } from "./ui/button";

export default function ListView({ listId }: { listId: Id<"lists"> }) {
  const listData = useQuery(api.list.listData, { listId });
  const checkAllItems = useMutation(api.list.checkAllItems);
  const uncheckAllItems = useMutation(api.list.uncheckAllItems);
  let listName = listData?.name;
  console.log(listData?.items);
  return (
    <>
      <title>{listName}</title>
      <h1 className="text-3xl font-semibold m-4">{listName}</h1>
      <ul className="container">
        <div className="flex flex-row space-x-2 my-2">
          <Button onClick={() => checkAllItems({ listId })}>Check All</Button>
          <Button onClick={() => uncheckAllItems({ listId })}>
            Uncheck All
          </Button>
        </div>
        {listData?.items.map((item) => (
          <Item key={item._id + item.completed} listId={listId} item={item} />
        ))}
        <NewItemForm listId={listId} />
      </ul>
    </>
  );
}
