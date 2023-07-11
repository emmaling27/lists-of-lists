import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  items: defineTable({
    name: v.string(),
    creator: v.id("users"),
  }).index("by_creator_name", ["creator", "name"]),
  sublists: defineTable({
    name: v.string(),
    items: v.array(v.id("items")),
    creator: v.id("users"),
    lastUpdated: v.int64(),
  }).index("by_creator_name", ["creator", "name"]),
  lists: defineTable({
    name: v.string(),
    creator: v.id("users"),
    items: v.array(
      v.object({ item: v.id("items"), total: v.int64(), completed: v.int64() })
    ),
    sublists: v.array(v.id("sublists")),
    lastUpdated: v.int64(),
  }).index("by_creator_name", ["creator", "name"]),
  sublists_to_lists: defineTable({
    sublist: v.id("sublists"),
    lists: v.array(v.id("lists")),
  }).index("by_sublist", ["sublist"]),
});
