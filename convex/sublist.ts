import { getItemByName } from "./helpers";
import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { withUser } from "./middleware";

export const createSublist = mutation({
  args: {
    name: v.string(),
  },

  handler: withUser(async ({ db, user }, { name }) => {
    await db.insert("sublists", {
      name,
      items: [],
      creator: user._id,
    });
  }),
});

export const addItemToSublist = mutation({
  args: {
    sublistId: v.id("sublists"),
    itemName: v.string(),
  },

  handler: withUser(async ({ db, user }, { sublistId, itemName }) => {
    const item = await getItemByName(db, user, itemName);
    let sublist = await db.get(sublistId);
    if (!sublist) {
      throw new Error(`Sublist ${sublist} not found.`);
    }
    await db.patch(sublistId, {
      items: sublist.items.concat([item]),
    });
  }),
});

export const removeItemFromSublist = mutation({
  args: {
    sublistId: v.id("sublists"),
    itemId: v.id("items"),
  },

  handler: withUser(async ({ db }, { sublistId, itemId }) => {
    let sublist = await db.get(sublistId);
    if (!sublist) {
      throw new Error(`Sublist ${sublist} not found.`);
    }
    await db.patch(sublistId, {
      items: sublist.items.filter((item) => item !== itemId),
    });
  }),
});
