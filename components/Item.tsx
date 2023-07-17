import { Id } from "@/convex/_generated/dataModel";
import { ItemData } from "../lib/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";

export default function Item({
  listId,
  item,
}: {
  listId: Id<"lists">;
  item: ItemData;
}) {
  const checkItem = useMutation(api.list.checkItem);
  const [checked, setChecked] = useState(item.completed == 1);
  return (
    <li key={item._id} className="items-top flex space-x-2">
      <Checkbox
        id={item.name}
        className="margin-1"
        checked={checked}
        onClick={() => {
          setChecked(!checked);
          checkItem({
            listId,
            itemId: item._id,
            completed: item.completed == 1 ? 0 : 1,
          });
        }}
      />
      <div className="grid gap-1">
        <label htmlFor={item.name}>{item.name}</label>
      </div>
    </li>
  );
}
