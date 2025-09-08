import {
	type AuthFunctions,
	BetterAuth,
	type PublicAuthFunctions,
} from "@convex-dev/better-auth";
import { createAuth } from "../lib/auth";
import { api, components, internal } from "./_generated/api";
import type { DataModel, Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

const authFunctions: AuthFunctions = internal.auth;
const publicAuthFunctions: PublicAuthFunctions = api.auth;

export const betterAuthComponent = new BetterAuth(components.betterAuth, {
	authFunctions,
	publicAuthFunctions,
	verbose: true,
});

export const {
	createUser,
	updateUser,
	deleteUser,
	createSession,
	isAuthenticated,
} = betterAuthComponent.createAuthFunctions<DataModel>({
	onCreateUser: async (ctx, user) => {
		const userId = await ctx.db.insert("users", {
			isAnonymous: user.isAnonymous ?? false,
		});

		return userId;
	},
	onDeleteUser: async (ctx, userId) => {
		await ctx.db.delete(userId as Id<"users">);
	},
	onUpdateUser: async (ctx, user) => {
		await ctx.db.patch(user.userId as Id<"users">, {});
	},
});

export const getUser = query({
	args: {},
	handler: async (ctx) => {
		const userMetadata = await betterAuthComponent.getAuthUser(ctx);
		if (!userMetadata) return null;

		const user = await ctx.db.get(userMetadata.userId as Id<"users">);

		return {
			...userMetadata,
			...user,
		};
	},
});

export const getSession = query({
	args: {},
	handler: async (ctx) => {
		const auth = createAuth(ctx);

		const headers = await betterAuthComponent.getHeaders(ctx);

		const session = await auth.api.getSession({ headers });
		if (!session) return null;

		return session;
	},
});

export const signInAnonymous = mutation({
	args: {},
	handler: async (ctx) => {
		const auth = createAuth(ctx);

		const headers = await betterAuthComponent.getHeaders(ctx);

		const userId = await auth.api.signInAnonymous({ headers });

		return userId?.user.id;
	},
});
