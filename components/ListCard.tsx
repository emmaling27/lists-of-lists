import Link from "next/link";
import { TrashIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
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
        <Tooltip>
          <TooltipTrigger>
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => deleteList({ listId: list._id })}
            >
              <TrashIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete list</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
}
