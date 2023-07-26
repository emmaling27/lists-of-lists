import { Id } from "../convex/_generated/dataModel";

export type Result =
  | { status: "success" }
  | { status: "error"; message: string };

export type ItemData = {
  listItemId: Id<"list_items">;
  item: Id<"items">;
  name: string;
  total: number;
  completed: number;
};

export type ListData = {
  _id: Id<"lists">;
  _creationTime: number;
  name: string;
  itemsBySublists: Record<string, ItemData[]>;
  itemsNotOnSublists: ItemData[];
};
