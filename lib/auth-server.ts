import { getStaticAuth } from "@convex-dev/better-auth";
import { getToken as getTokenNextjs } from "@convex-dev/better-auth/nextjs";
import { createAuth } from "@/convex/auth";

export const getToken = () => {
	getStaticAuth(createAuth);
	// @ts-expect-error - static auth isn't typed
	return getTokenNextjs(createAuth);
};
