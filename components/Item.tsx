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
    <li key={item._id}>
      <Checkbox
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
      {item.name}
    </li>
  );
}
