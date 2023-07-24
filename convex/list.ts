import { getItemByName } from "./helpers";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { withUser } from "./middleware";

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
    const sublists = await db
      .query("sublists")
      .withIndex("by_creator_name", (q) => q.eq("creator", user._id))
      .collect();

    const sublistsWithItems = await Promise.all(
      sublists.map(async (sublist) => {
        const items = await Promise.all(
          sublist.items.map(async (itemId) => {
            const item = await db.get(itemId);
            if (item === null) {
              throw new Error(`Item ${itemId} not found`);
            }
            return item;
          })
        );
        return {
          _id: sublist._id,
          _creationTime: sublist._creationTime,
          creator: sublist.creator,
          name: sublist.name,
          items,
        };
      })
    );
    return sublistsWithItems.filter(
      (sublist) => !list.sublists.includes(sublist._id)
    );
  }),
});
