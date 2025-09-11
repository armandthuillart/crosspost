"use client";

import {
	type GetRateLimitValueQuery,
	useRateLimit,
} from "@convex-dev/rate-limiter/react";
import type { Id } from "@/convex/_generated/dataModel";
import type { Tier } from "@/lib/types";
import { api } from "../convex/_generated/api";

interface ChatStreamerProps {
	userId: Id<"users">;
	userTier: Tier;
}

export function ChatStreamer({ userId, userTier }: ChatStreamerProps) {
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

	const { check, status } = useRateLimit(getRateLimitApi, {
		key: userId,
	});

	const now = Date.now();
	const checked = check(now, 0);

	const remaining =
		checked?.config?.rate != null && checked?.value != null
			? Math.max(0, Math.floor(checked.value))
			: undefined;

	if (!status) {
		return null;
	}

	return (
		<div>
			{remaining !== undefined && (
				<div>
					Remaining: {remaining} /{" "}
					{checked?.config?.capacity ?? checked?.config?.rate}
				</div>
			)}
			{!status.ok && (
				<div>
					You're limited. Try again after{" "}
					{Math.ceil((status.retryAt - now) / 1000)}s
				</div>
			)}
		</div>
	);
}
