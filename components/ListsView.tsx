"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
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
  const { results, status, loadMore } = usePaginatedQuery(
    api.lists.listLists,
    {},
    { initialNumItems: 10 }
  );
  return (
    <div className="grid my-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      {results
        ?.map((list) => (
          <Card key={list._id} className="flex flex-col h-full w-full">
            <CardHeader>
              <CardTitle>{list.name}</CardTitle>
              <CardDescription>
                Created on {new Date(list._creationTime).toDateString()}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild>
                <Link href={`/list/${list._id}`}>View</Link>
              </Button>
            </CardFooter>
          </Card>
        ))
        .concat([<NewListForm key="new-list" />])}
      {status == "CanLoadMore" && (
        <Button key="load-more" onClick={() => loadMore(10)}>
          Load more
        </Button>
      )}
    </div>
  );
}
