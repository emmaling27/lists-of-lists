import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "./_generated/api";
import schema from "./schema";

test("create a new list", async () => {
  const t = convexTest(schema);
  const asEmma = t.withIdentity({ name: "Emma" });
  await asEmma.mutation(api.storeUser.default, {});
  await asEmma.mutation(api.lists.createList, { name: "my list" });
  const lists = await asEmma.query(api.lists.listLists, {
    paginationOpts: { numItems: 5, cursor: null },
  });
  const page = lists.page;
  expect(page).toMatchObject([
    { name: "my list", archived: false, sublists: [] },
  ]);
});
