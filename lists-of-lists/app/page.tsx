"use client";
import useStoreUserEffect from "@/lib/useStoreUserEffect";
import { UserButton } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

export default function Home() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const userId = useStoreUserEffect();
  if (userId === null) {
    return <div>Storing user...</div>;
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <title>Lists of Lists</title>
      <h1>Lists of Lists</h1>
      <div>
        {isAuthenticated ? "Logged in" : "Logged out or still loading"}
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  );
}
