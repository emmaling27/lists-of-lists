"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import NewListForm from "./NewListForm";

export default function ListsView() {
  const listLists = useQuery(api.lists.listLists);
  return (
    <div className="grid my-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      {listLists
        ?.map((list) => (
          <Card key={list._id} className="h-full w-full">
            <CardHeader>
              <CardTitle>{list.name}</CardTitle>
              <CardDescription>
                Created on {new Date(list._creationTime).toDateString()}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild>
                <Link href={`/list/${list._id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))
        .concat([<NewListForm key="new-list" />])}
    </div>
  );
}
