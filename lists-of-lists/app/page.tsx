import { UserButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <title>Lists of Lists</title>
      <div>
        <h1>Lists of Lists</h1>
        <UserButton afterSignOutUrl="/" />
      </div>
    </main>
  );
}
