import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MinusIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { useState } from "react";

export default function SublistItem({
  sublistId,
  item,
}: {
  sublistId: Id<"sublists">;
  item: Doc<"items">;
}) {
  const removeItemFromSublist = useMutation(api.sublist.removeItemFromSublist);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };
  return (
    <li
      key={item._id}
      className="my-1 ml-6 list-disc"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {item.name}
      {isHovered && (
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              className="p-1 h-0"
              onClick={() =>
                removeItemFromSublist({ sublistId, itemId: item._id })
              }
            >
              <MinusIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Remove {item.name} from the sublist.</TooltipContent>
        </Tooltip>
      )}
    </li>
  );
}
