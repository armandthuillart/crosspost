import {
	MINUTE,
	type RateLimitConfig,
	RateLimiter,
} from "@convex-dev/rate-limiter";
import type { Tier } from "../lib/types";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { authComponent } from "./auth";

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

export const { getRateLimit: getAnonymousRateLimit } =
	rateLimiter.hookAPI<DataModel>("anonymous", {
		async key(ctx) {
			return authComponent.getAuthUser(ctx).then(({ _id }) => _id);
		},
	});

export const { getRateLimit: getFreeRateLimit } =
	rateLimiter.hookAPI<DataModel>("free", {
		async key(ctx) {
			return authComponent.getAuthUser(ctx).then(({ _id }) => _id);
		},
	});

export const { getRateLimit: getProRateLimit } = rateLimiter.hookAPI<DataModel>(
	"pro",
	{
		async key(ctx) {
			return authComponent.getAuthUser(ctx).then(({ _id }) => _id);
		},
	},
);
