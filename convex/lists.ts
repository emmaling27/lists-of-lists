import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { withUser } from "./middleware";
import { paginationOptsValidator } from "convex/server";
import { Result } from "../lib/types";

export const createList = mutation({
  args: {
    name: v.string(),
  },

  handler: withUser(async ({ db, user }, { name }): Promise<Result> => {
    // Make sure list name is unique for the creator
    const listsWithSameName = await db
      .query("lists")
      .withIndex("by_creator_name", (q) =>
        q.eq("creator", user._id).eq("name", name)
      )
      .collect();
    if (listsWithSameName.length > 0) {
      return {
        status: "error",
        message: "List with the same name already exists. Try another name.",
      };
    }

    const list = {
      name,
      creator: user._id,
      sublists: [],
    };
    await db.insert("lists", list);
    return { status: "success" };
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
