import { internalMutation } from "./_generated/server";

export const backfillArchivedField = internalMutation({
  args: {},

  handler: async (ctx) => {
    const lists = await ctx.db.query("lists").collect();
    for (const list of lists) {
      if (list.archived === undefined) {
        await ctx.db.patch(list._id, { archived: false });
      }
    }
  },
});
