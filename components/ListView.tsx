"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import Item from "./Item";
import { Button } from "./ui/button";
import Sublists from "./Sublists";
import { NewItemFormForList } from "./NewItemForm";

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
            <Button
              variant="secondary"
              onClick={() => checkAllItems({ listId })}
            >
              Check All
            </Button>
            <Button
              variant="secondary"
              onClick={() => uncheckAllItems({ listId })}
            >
              Uncheck All
            </Button>
          </div>
          {listData?.items.map((item) => (
            <Item key={item.listItemId + item.completed} item={item} />
          ))}
          <NewItemFormForList listId={listId} />
        </ul>
        <div className="basis-1/3">
          <Sublists listId={listId} />
        </div>
      </div>
    </>
  );
}
