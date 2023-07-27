"use client";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { Button } from "./ui/button";
import NewListForm from "./NewListForm";
import ListCard from "./ListCard";

export default function ListsView() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.lists.listLists,
    {},
    { initialNumItems: 10 }
  );
  return (
    <div className="grid my-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
      {results?.map((list) => (
        <ListCard key={list._id} list={list} />
      ))}
      <NewListForm key="new-list" />
      {status == "CanLoadMore" && (
        <Button key="load-more" onClick={() => loadMore(10)}>
          Load more
        </Button>
      )}
    </div>
  );
}
