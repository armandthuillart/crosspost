import { createApi } from "@convex-dev/better-auth";
import { createAuth } from "~/convex/auth";
import schema from "~/convex/betterAuth/schema";

export const {
	create,
	findOne,
	findMany,
	updateOne,
	deleteOne,
	updateMany,
	deleteMany,
} = createApi(schema, createAuth);
