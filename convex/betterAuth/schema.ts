import { defineSchema } from "convex/server";
import { tables } from "~/convex/betterAuth/generatedSchema";

const schema = defineSchema({
	...tables,
	user: tables.user.index("by_is_anonymous", ["isAnonymous"]),
});

export default schema;
