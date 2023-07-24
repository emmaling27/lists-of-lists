import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
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

export default function Sublists({ listId }: { listId: Id<"lists"> }) {
  const sublists = useQuery(api.list.otherSublists, { listId });
  return (
    <>
      <h2 className="text-2xl font-semibold">Sublists</h2>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add a new sublist</Button>
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
                    <li key={item._id} className="my-2 ml-6 list-disc">
                      {item.name}
                    </li>
                  ))}
                </ul>
              )}
              <NewItemFormForSublist sublistId={sublist._id} />
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </>
  );
}
