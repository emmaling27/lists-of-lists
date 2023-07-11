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

export default function ListsView() {
  const listLists = useQuery(api.lists.listLists);
  return (
    <div>
      {listLists?.map((list) => (
        <Card key={list._id}>
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
      ))}
    </div>
  );
}
