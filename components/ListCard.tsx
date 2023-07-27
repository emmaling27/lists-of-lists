import Link from "next/link";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "./ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function ListCard({ list }: { list: Doc<"lists"> }) {
  const deleteList = useMutation(api.lists.deleteList);
  return (
    <Card key={list._id} className="flex flex-col h-full w-full">
      <CardHeader>
        <CardTitle>{list.name}</CardTitle>
        <CardDescription>
          Created on {new Date(list._creationTime).toDateString()}
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto flex flex-row justify-between">
        <Button asChild>
          <Link href={`/list/${list._id}`}>View</Link>
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" className="p-2">
              <TrashIcon />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Delete list</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this list? This action is
              permanent.
            </DialogDescription>
            <Button onClick={() => deleteList({ listId: list._id })}>
              Yes, delete
            </Button>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
