"use client";

import {
	type GetRateLimitValueQuery,
	useRateLimit,
} from "@convex-dev/rate-limiter/react";
import type { Id } from "@/convex/_generated/dataModel";
import type { Tier } from "@/lib/types";
import { api } from "../convex/_generated/api";

export function ChatStreamer({
	userId,
	userTier,
}: {
	userId: Id<"users">;
	userTier: Tier;
}) {
	console.log("the user is:", userTier);

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

	const { status } = useRateLimit(getRateLimitApi, { key: userId });

	if (status?.ok) {
		return null;
	}

	return <div />;
}
