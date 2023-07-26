import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import NewSublistForm from "./NewSublistForm";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { NewItemFormForSublist } from "./NewItemForm";
import SublistItem from "./SublistItem";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { MinusCircledIcon, PlusCircledIcon } from "@radix-ui/react-icons";

export default function Sublists({ listId }: { listId: Id<"lists"> }) {
  const sublists = useQuery(api.list.sublists, { listId });
  const addSublistToList = useMutation(api.list.addSublistToList);
  const removeSublistFromList = useMutation(api.list.removeSublistFromList);
  return (
    <>
      <h2 className="text-2xl font-semibold">Sublists</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="m-2">
            Add a new sublist
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new sublist</DialogTitle>
            <DialogDescription>
              Create a new sublist that you can add to lists
            </DialogDescription>
          </DialogHeader>
          <NewSublistForm />
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-2">
        {sublists?.map((sublist) => (
          <div key={sublist._id}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="ghost"
                  className="h-0 p-1"
                  onClick={async () => {
                    if (sublist.inList) {
                      await removeSublistFromList({
                        listId,
                        sublistId: sublist._id,
                      });
                    } else {
                      await addSublistToList({
                        listId,
                        sublistId: sublist._id,
                      });
                    }
                  }}
                >
                  {sublist.inList ? <MinusCircledIcon /> : <PlusCircledIcon />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {sublist.inList
                  ? `Remove ${sublist.name} from the list.`
                  : `Add ${sublist.name} to the list.`}{" "}
              </TooltipContent>
            </Tooltip>
            <Popover key={sublist._id}>
              <PopoverTrigger className="text-left">
                {sublist.name}
              </PopoverTrigger>
              <PopoverContent>
                {sublist.items.length == 0 ? (
                  "No items in this list."
                ) : (
                  <ul>
                    {sublist.items.map((item) => (
                      <SublistItem
                        key={item._id}
                        sublistId={sublist._id}
                        item={item}
                      />
                    ))}
                  </ul>
                )}
                <NewItemFormForSublist sublistId={sublist._id} />
              </PopoverContent>
            </Popover>
          </div>
        ))}
      </div>
    </>
  );
}
