import { Id } from "@/convex/_generated/dataModel";

type ListData = {
  _id: Id<"lists">;
  _creationTime: number;
  name: string;
  items: ItemData[];
};

export type ItemData = {
  _id: Id<"items">;
  name: string;
  total: number;
  completed: number;
};
