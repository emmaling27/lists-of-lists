"use client";
import ListsView from "@/components/ListsView";
import NewListForm from "@/components/NewListForm";
import useStoreUserEffect from "@/lib/useStoreUserEffect";
import { UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

export default function Home() {
  const { isAuthenticated } = useConvexAuth();
  const userId = useStoreUserEffect();
  if (userId === null) {
    return <div>Storing user...</div>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <title>Lists of Lists</title>
      <h1>Lists of Lists</h1>
      <ListsView />
      <NewListForm />
      <div>
        {isAuthenticated ? "Logged in" : "Logged out or still loading"}
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  );
}
