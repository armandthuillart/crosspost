"use client";

import {
	type GetRateLimitValueQuery,
	useRateLimit,
} from "@convex-dev/rate-limiter/react";
import { api } from "../convex/_generated/api";
import type { Tier } from "../lib/types";

export function ChatStreamer({ userTier }: { userTier: Tier }) {
	let getRateLimitApi: GetRateLimitValueQuery;

	switch (userTier) {
		case "anonymous":
			getRateLimitApi = api.rateLimiting.getAnonymousRateLimit;
			break;
		case "free":
			getRateLimitApi = api.rateLimiting.getFreeRateLimit;
			break;
		case "pro":
			getRateLimitApi = api.rateLimiting.getProRateLimit;
			break;
	}

	const { status } = useRateLimit(getRateLimitApi);
	console.log(status);

	return <div />;
}
