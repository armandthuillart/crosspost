import {
	MINUTE,
	type RateLimitConfig,
	RateLimiter,
} from "@convex-dev/rate-limiter";
import type { Tier } from "../lib/types";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

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
		capacity: 100,
		kind: "fixed window",
		period: MONTH,
		rate: 100,
	},
	pro: {
		capacity: 1000,
		kind: "fixed window",
		period: MONTH,
		rate: 1000,
	},
};

export const rateLimiter = new RateLimiter(
	components.rateLimiter,
	rateLimitConfig,
);

export const { getRateLimit: getAnonymousRateLimit } =
	rateLimiter.hookAPI<DataModel>("anonymous", {
		async key(ctx) {
			return ctx.auth.getUserIdentity().then((identity) => identity!.subject);
		},
	});

export const { getRateLimit: getFreeRateLimit } =
	rateLimiter.hookAPI<DataModel>("free", {
		async key(ctx) {
			return ctx.auth.getUserIdentity().then((identity) => identity!.subject);
		},
	});

export const { getRateLimit: getProRateLimit } = rateLimiter.hookAPI<DataModel>(
	"pro",
	{
		async key(ctx) {
			return ctx.auth.getUserIdentity().then((identity) => identity!.subject);
		},
	},
);
