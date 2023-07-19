import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { withUser } from "./middleware";
import { paginationOptsValidator } from "convex/server";

export const createList = mutation({
  args: {
    name: v.string(),
  },

  handler: withUser(async ({ db, user }, { name }) => {
    // Make sure list name is unique for the creator
    const listsWithSameName = await db
      .query("lists")
      .withIndex("by_creator_name", (q) =>
        q.eq("creator", user._id).eq("name", name)
      )
      .collect();
    if (listsWithSameName.length > 0) {
      throw new Error("List with same name already exists");
    }

    const list = {
      name,
      creator: user._id,
      sublists: [],
      lastUpdated: Date.now(),
    };
    await db.insert("lists", list);
  }),
});

export const listLists = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: withUser(async ({ db, user }, { paginationOpts }) => {
    return await db
      .query("lists")
      .withIndex("by_creator", (q) => q.eq("creator", user._id))
      .paginate(paginationOpts);
  }),
});
