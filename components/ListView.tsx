"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import NewItemForm from "./NewItemForm";
import Item from "./Item";
import { Button } from "./ui/button";
import Sublists from "./Sublists";

export default function ListView({ listId }: { listId: Id<"lists"> }) {
  const listData = useQuery(api.list.listData, { listId });
  const checkAllItems = useMutation(api.list.checkAllItems);
  const uncheckAllItems = useMutation(api.list.uncheckAllItems);
  let listName = listData?.name;
  return (
    <>
      <title>{listName}</title>
      <h1 className="text-3xl font-semibold m-4">{listName}</h1>
      <div className="flex flex-row">
        <ul className="container">
          <div className="flex flex-row gap-2 my-2">
            <Button onClick={() => checkAllItems({ listId })}>Check All</Button>
            <Button onClick={() => uncheckAllItems({ listId })}>
              Uncheck All
            </Button>
          </div>
          {listData?.items.map((item) => (
            <Item key={item.listItemId + item.completed} item={item} />
          ))}
          <NewItemForm listId={listId} />
        </ul>
        <div className="basis-1/3">
          <h2 className="text-2xl font-semibold">Sublists</h2>
          <Sublists listId={listId} />
        </div>
      </div>
    </>
  );
}
