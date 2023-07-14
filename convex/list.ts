import { DatabaseWriter, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { withUser } from "./middleware";
import { Doc } from "./_generated/dataModel";

export const listData = query({
  args: {
    listId: v.id("lists"),
  },

  handler: withUser(async ({ db, user: _ }, { listId }) => {
    let list = await db.get(listId);
    if (list === null) {
      throw new Error("List not found");
    }
    const items = await Promise.all(
      list.items.map(async (item) => {
        const itemDoc = await db.get(item.item);
        if (itemDoc === null) {
          throw new Error("Item not found");
        }
        return {
          _id: itemDoc._id,
          name: itemDoc.name,
          total: item.total,
          completed: item.completed,
        };
      })
    );
    return {
      _id: list._id,
      _creationTime: list._creationTime,
      name: list.name,
      items,
    };
  }),
});

const getItemByName = async (
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

export const addItemToList = mutation({
  args: {
    name: v.string(),
    listId: v.id("lists"),
  },

  handler: withUser(async ({ db, user }, { name, listId }) => {
    let itemId = await getItemByName(db, user, name);
    const list = await db.get(listId);
    if (list === null) {
      throw new Error("List not found");
    }
    if (listId in list.items) {
      throw new Error("Item already in list");
    }
    if (itemId === undefined) {
      throw new Error("Item undefined");
    }
    await db.patch(listId, {
      items: [...list.items, { item: itemId, total: 1, completed: 0 }],
    });
  }),
});

export const checkItem = mutation({
    args: {
        listId: v.id("lists"),
        itemId: v.id("items"),
        completed: v.number(),
    },

    handler: withUser(async ({ db, user }, { listId, itemId, completed }) => {
        const list = await db.get(listId);
        if (list === null) {
            throw new Error(`List ${listId} not found`);
        }
        const item = list.items.find((item) => item.item === itemId);
        if (item === undefined) {
            throw new Error(`Item ${itemId} not found in list ${listId}`);
        }
        await db.patch(listId, {
            items: list.items.map((item) => {
                if (item.item === itemId) {
                    return { ...item, completed };
                }
                return item;
            }),
        });
    }),
});