import { ListData } from "../lib/types";
import { getItemByName } from "./helpers";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { withUser } from "./middleware";

export const listData = query({
  args: {
    listId: v.id("lists"),
  },

  handler: withUser(async ({ db }, { listId }) => {
    const list = await db.get(listId);
    if (list === null) {
      throw new Error("List not found");
    }
    const listItems = await db
      .query("list_items")
      .withIndex("by_list_sublist", (q) => q.eq("list", listId))
      .collect();
    let items = await Promise.all(
      listItems.map(async (listItem) => {
        const itemDoc = await db.get(listItem.item);
        if (itemDoc === null) {
          throw new Error("Item not found");
        }
        return {
          listItemId: listItem._id,
          item: itemDoc._id,
          sublist: listItem.sublist,
          name: itemDoc.name,
          total: listItem.total,
          completed: listItem.completed,
        };
      })
    );
    let sublistsById: { [id: string]: string } = {};
    await Promise.all(
      list.sublists.map(async (sublistId) => {
        const sublist = await db.get(sublistId);
        if (sublist === null) {
          throw new Error(`Sublist ${sublistId} not found`);
        }
        sublistsById[sublistId] = sublist.name;
      })
    );
    const listData: ListData = {
      _id: list._id,
      _creationTime: list._creationTime,
      name: list.name,
      itemsBySublists: {},
      itemsNotOnSublists: [],
    };
    items.forEach((item) => {
      if (item.sublist === null) {
        listData.itemsNotOnSublists.push(item);
      } else {
        const sublistName = sublistsById[item.sublist];
        if (listData.itemsBySublists[sublistName] === undefined) {
          listData.itemsBySublists[sublistName] = [];
        }
        listData.itemsBySublists[sublistName].push(item);
      }
    });
    return listData;
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
      sublist: null,
      total: 1,
      completed: 0,
    });
  }),
});

export const removeItemFromList = mutation({
  args: {
    listItemId: v.id("list_items"),
  },

  handler: withUser(async ({ db }, { listItemId }) => {
    await db.delete(listItemId);
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
      .withIndex("by_list_sublist", (q) => q.eq("list", listId))
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
      .withIndex("by_list_sublist", (q) => q.eq("list", listId))
      .collect();
    await Promise.all(
      listItems.map((listItem) => db.patch(listItem._id, { completed: 0 }))
    );
  }),
});

export const sublists = query({
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
          inList: list.sublists.includes(sublist._id),
        };
      })
    );
    return sublistsWithItems;
  }),
});

export const addSublistToList = mutation({
  args: {
    listId: v.id("lists"),
    sublistId: v.id("sublists"),
  },

  handler: withUser(async ({ db }, { listId, sublistId }) => {
    const list = await db.get(listId);
    if (list === null) {
      throw new Error(`List ${listId} not found`);
    }
    if (sublistId in list.sublists) {
      throw new Error(`Sublist ${sublistId} already in list ${listId}`);
    }
    const sublist = await db.get(sublistId);
    if (sublist === null) {
      throw new Error(`Sublist ${sublistId} not found`);
    }
    // Add items from the sublist to the list
    await Promise.all(
      sublist.items.map(async (itemId) => {
        const existingListItem = await db
          .query("list_items")
          .withIndex("by_list_item", (q) =>
            q.eq("list", listId).eq("item", itemId)
          )
          .first();
        if (existingListItem === null) {
          return await db.insert("list_items", {
            list: listId,
            item: itemId,
            sublist: sublistId,
            total: 1,
            completed: 0,
          });
        }
      })
    );
    await db.patch(listId, {
      sublists: list.sublists.concat([sublistId]),
    });
  }),
});

export const removeSublistFromList = mutation({
  args: {
    listId: v.id("lists"),
    sublistId: v.id("sublists"),
  },

  handler: withUser(async ({ db }, { listId, sublistId }) => {
    const removeListItems = async () => {
      const listItems = await db
        .query("list_items")
        .withIndex("by_list_sublist", (q) =>
          q.eq("list", listId).eq("sublist", sublistId)
        )
        .collect();

      await Promise.all(listItems.map((listItem) => db.delete(listItem._id)));
    };
    const removeSublist = async () => {
      const list = await db.get(listId);
      if (list === null) {
        throw new Error(`List ${listId} not found`);
      }
      await db.patch(listId, {
        sublists: list.sublists.filter((id) => id !== sublistId),
      });
    };
    await Promise.all([removeListItems(), removeSublist()]);
  }),
});
