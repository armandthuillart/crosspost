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

export const { limit, hookAPI } = new RateLimiter(
	components.rateLimiter,
	rateLimitConfig,
);

export const { getRateLimit: getAnonymousRateLimit } = hookAPI<DataModel>(
	"anonymous",
	{
		async key(ctx) {
			return ctx.auth.getUserIdentity().then((identity) => identity!.subject);
		},
	},
);

export const { getRateLimit: getFreeRateLimit } = hookAPI<DataModel>("free", {
	async key(ctx) {
		return ctx.auth.getUserIdentity().then((identity) => identity!.subject);
	},
});

export const { getRateLimit: getProRateLimit } = hookAPI<DataModel>("pro", {
	async key(ctx) {
		return ctx.auth.getUserIdentity().then((identity) => identity!.subject);
	},
});
