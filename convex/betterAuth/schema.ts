import { defineSchema } from "convex/server";
import { v } from "convex/values";
import { tables } from "./generatedSchema";

export const tier = v.union(
	v.literal("anonymous"),
	v.literal("free"),
	v.literal("pro"),
);

const schema = defineSchema({
	...tables,
	users: tables.users.index("by_is_anonymous", ["isAnonymous"]),
});

export default schema;
