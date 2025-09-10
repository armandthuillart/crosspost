import {
	type AuthFunctions,
	BetterAuth,
	type PublicAuthFunctions,
} from "@convex-dev/better-auth";
import { v } from "convex/values";
import { createAuth } from "../lib/auth";
import { api, components, internal } from "./_generated/api";
import type { DataModel, Id } from "./_generated/dataModel";
import { internalQuery, query } from "./_generated/server";

const authFunctions: AuthFunctions = internal.auth;
const publicAuthFunctions: PublicAuthFunctions = api.auth;

export const betterAuthComponent = new BetterAuth(components.betterAuth, {
	authFunctions,
	publicAuthFunctions,
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
			isAnonymous: user.isAnonymous ?? undefined,
		});
		return userId;
	},
	onDeleteUser: async (ctx, userId) => {
		await ctx.db.delete(userId as Id<"users">);
	},
	onUpdateUser: async (ctx, user) => {
		await ctx.db.patch(user.userId as Id<"users">, {
			isAnonymous: user.isAnonymous ?? undefined,
		});
	},
});

export const getUser = query({
	args: {},
	handler: async (ctx) => {
		const userMetadata = await betterAuthComponent.getAuthUser(ctx);

		if (!userMetadata) {
			return null;
		}

		const user = await ctx.db.get(userMetadata.userId as Id<"users">);

		return {
			...user,
			...userMetadata,
		};
	},
});

export const getSession = query({
	args: {},
	handler: async (ctx) => {
		const auth = createAuth(ctx);
		const headers = await betterAuthComponent.getHeaders(ctx);

		const session = await auth.api.getSession({ headers });

		if (!session) {
			return null;
		}

		return session;
	},
});

export const fetchUser = internalQuery({
	args: { userId: v.id("users") },
	handler: async (ctx, { userId }) => {
		const user = await ctx.db.get(userId);
		return user;
	},
});
