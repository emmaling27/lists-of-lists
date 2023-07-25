import { ItemData } from "../lib/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { Button } from "./ui/button";
import { MinusIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function Item({ item }: { item: ItemData }) {
  const checkItem = useMutation(api.list.checkItem);
  const removeItemFromList = useMutation(api.list.removeItemFromList);
  const [checked, setChecked] = useState(item.completed == 1);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <li
      key={item.listItemId}
      className="items-center flex space-x-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Checkbox
        id={item.name}
        className="margin-1"
        checked={checked}
        onClick={() => {
          setChecked(!checked);
          checkItem({
            listItemId: item.listItemId,
            completed: item.completed == 1 ? 0 : 1,
          });
        }}
      />
      <div className="grid gap-1">
        <label htmlFor={item.name}>{item.name}</label>
      </div>
      {isHovered && (
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              className="p-0 h-0"
              onClick={() =>
                removeItemFromList({ listItemId: item.listItemId })
              }
            >
              <MinusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{`Remove ${item.name} from the list.`}</TooltipContent>
        </Tooltip>
      )}
    </li>
  );
}
