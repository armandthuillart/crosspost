import type { UsageHandler } from "@convex-dev/agent";
import {
	MINUTE,
	type RateLimitConfig,
	RateLimiter,
} from "@convex-dev/rate-limiter";
import { Effect } from "effect";
import { ChatSDKError } from "../lib/errors";
import type { Tier } from "../lib/types";
import { components, internal } from "./_generated/api";
import type { DataModel, Id } from "./_generated/dataModel";

const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;

const rateLimitConfig: Record<Tier, RateLimitConfig> = {
	anonymous: {
		capacity: 10,
		kind: "fixed window",
		period: DAY,
		rate: 10,
	},
	free: {
		capacity: 150,
		kind: "fixed window",
		period: MONTH,
		rate: 150,
	},
	pro: {
		capacity: 1500,
		kind: "fixed window",
		period: MONTH,
		rate: 1500,
	},
};

export const rateLimiter = new RateLimiter(
	components.rateLimiter,
	rateLimitConfig,
);

export const rateLimitedUsageHandler: UsageHandler = async (
	ctx,
	{ userId },
) => {
	if (!userId) {
		console.warn("No user ID found in usage handler");
		return;
	}

	const tier = await ctx.runAction(internal.customers.getTier, {
		userId: userId as Id<"users">,
	});

	await rateLimiter.limit(ctx, tier, { key: userId, throws: true });
};

export const { getRateLimit: getAnonymousRateLimit } =
	rateLimiter.hookAPI<DataModel>("anonymous", {
		key: (ctx) =>
			Effect.runPromise(
				Effect.gen(function* () {
					const identity = yield* Effect.tryPromise({
						catch: () => new ChatSDKError("unauthorized:api").toResponse(),
						try: () => ctx.auth.getUserIdentity(),
					});

					return identity?.subject as Id<"users">;
				}),
			),
	});

export const { getRateLimit: getFreeRateLimit } =
	rateLimiter.hookAPI<DataModel>("free", {
		key: (ctx) =>
			Effect.runPromise(
				Effect.gen(function* () {
					const identity = yield* Effect.tryPromise({
						catch: () => new ChatSDKError("unauthorized:api").toResponse(),
						try: () => ctx.auth.getUserIdentity(),
					});

					return identity?.subject as Id<"users">;
				}),
			),
	});

export const { getRateLimit: getProRateLimit } = rateLimiter.hookAPI<DataModel>(
	"pro",
	{
		key: (ctx) =>
			Effect.runPromise(
				Effect.gen(function* () {
					const identity = yield* Effect.tryPromise({
						catch: () => new ChatSDKError("unauthorized:api").toResponse(),
						try: () => ctx.auth.getUserIdentity(),
					});

					return identity?.subject as Id<"users">;
				}),
			),
	},
);
