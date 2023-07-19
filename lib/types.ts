import { Id } from "@/convex/_generated/dataModel";

export type ItemData = {
  listItemId: Id<"list_items">;
  item: Id<"items">;
  name: string;
  total: number;
  completed: number;
};
