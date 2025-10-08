import { createApi } from "@convex-dev/better-auth";
import { createAuth } from "../auth";
import schema from "./schema";

export const {
	create,
	findOne,
	findMany,
	updateOne,
	deleteOne,
	updateMany,
	deleteMany,
} = createApi(schema, createAuth);
