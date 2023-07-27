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
  }).index("by_creator_name", ["creator", "name"]),
  lists: defineTable({
    name: v.string(),
    creator: v.id("users"),
    sublists: v.array(v.id("sublists")),
    archived: v.optional(v.boolean()),
  })
    .index("by_creator_name", ["creator", "name"])
    .index("by_creator", ["creator"]),
  list_items: defineTable({
    list: v.id("lists"),
    item: v.id("items"),
    sublist: v.union(v.id("sublists"), v.null()),
    total: v.float64(),
    completed: v.float64(),
  })
    .index("by_list_sublist", ["list", "sublist"])
    .index("by_list_item", ["list", "item"]),
});
