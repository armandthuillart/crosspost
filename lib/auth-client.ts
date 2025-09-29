import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { polarClient } from "@polar-sh/better-auth";
import {
	anonymousClient,
	inferAdditionalFields,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "../convex/betterAuth/auth";

export const authClient = createAuthClient({
	plugins: [
		anonymousClient(),
		convexClient(),
		inferAdditionalFields<typeof auth>(),
		polarClient(),
	],
});
