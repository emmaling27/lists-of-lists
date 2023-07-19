import { DatabaseWriter, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { withUser } from "./middleware";
import { Doc } from "./_generated/dataModel";

export const listData = query({
  args: {
    listId: v.id("lists"),
  },

  handler: withUser(async ({ db }, { listId }) => {
    let list = await db.get(listId);
    if (list === null) {
      throw new Error("List not found");
    }
    let listItems = await db
      .query("list_items")
      .withIndex("by_list", (q) => q.eq("list", listId))
      .collect();

    const items = await Promise.all(
      listItems.map(async (listItem) => {
        const itemDoc = await db.get(listItem.item);
        if (itemDoc === null) {
          throw new Error("Item not found");
        }
        return {
          listItemId: listItem._id,
          item: itemDoc._id,
          name: itemDoc.name,
          total: listItem.total,
          completed: listItem.completed,
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
    await db.insert("list_items", {
      list: listId,
      item: itemId,
      total: 1,
      completed: 0,
    });
  }),
});

export const checkItem = mutation({
  args: {
    listItemId: v.id("list_items"),
    completed: v.number(),
  },

  handler: withUser(async ({ db }, { listItemId, completed }) => {
    await db.patch(listItemId, { completed });
  }),
});

export const checkAllItems = mutation({
  args: {
    listId: v.id("lists"),
  },

  handler: withUser(async ({ db }, { listId }) => {
    const listItems = await db
      .query("list_items")
      .withIndex("by_list", (q) => q.eq("list", listId))
      .collect();
    await Promise.all(
      listItems.map((listItem) => db.patch(listItem._id, { completed: 1 }))
    );
  }),
});

export const uncheckAllItems = mutation({
  args: {
    listId: v.id("lists"),
  },

  handler: withUser(async ({ db }, { listId }) => {
    const listItems = await db
      .query("list_items")
      .withIndex("by_list", (q) => q.eq("list", listId))
      .collect();
    await Promise.all(
      listItems.map((listItem) => db.patch(listItem._id, { completed: 0 }))
    );
  }),
});

export const otherSublists = query({
  args: {
    listId: v.id("lists"),
  },

  handler: withUser(async ({ db, user }, { listId }) => {
    const list = await db.get(listId);
    if (list === null) {
      throw new Error(`List ${listId} not found`);
    }
    let sublists = await db
      .query("sublists")
      .withIndex("by_creator_name", (q) => q.eq("creator", user._id))
      .collect();
    return sublists.filter((sublist) => !list.sublists.includes(sublist._id));
  }),
});
