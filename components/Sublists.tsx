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
          <div key={sublist._id}>{sublist.name}</div>
        ))}
      </div>
    </>
  );
}
