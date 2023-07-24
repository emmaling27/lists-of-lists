import { Doc, Id } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { TrashIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function SublistItem({
  sublistId,
  item,
}: {
  sublistId: Id<"sublists">;
  item: Doc<"items">;
}) {
  const removeItemFromSublist = useMutation(api.sublist.removeItemFromSublist);
  return (
    <li key={item._id} className="my-0 ml-6 list-disc">
      {item.name}
      <Tooltip>
        <TooltipTrigger>
          <Button
            variant="ghost"
            className="p-1"
            onClick={() =>
              removeItemFromSublist({ sublistId, itemId: item._id })
            }
          >
            <TrashIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Remove hat from the sublist.</TooltipContent>
      </Tooltip>
    </li>
  );
}
