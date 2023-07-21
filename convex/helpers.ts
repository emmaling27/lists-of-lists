import { Doc } from "./_generated/dataModel";
import { DatabaseWriter } from "./_generated/server";

export const getItemByName = async (
  db: DatabaseWriter,
  user: Doc<"users">,
  name: string
) => {
  let itemName = name.trim();
  // Make sure to use existing item with the same name
  const item = await db
    .query("items")
    .withIndex("by_creator_name", (q) =>
      q.eq("creator", user._id).eq("name", itemName)
    )
    .first();
  let itemId = item?._id;
  if (!itemId) {
    const item = {
      name: itemName,
      creator: user._id,
    };
    itemId = await db.insert("items", item);
  }
  return itemId;
};
