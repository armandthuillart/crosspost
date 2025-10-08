"use client";

import {
	type GetRateLimitValueQuery,
	useRateLimit,
} from "@convex-dev/rate-limiter/react";
import { format, isToday, isTomorrow } from "date-fns";
import { useAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "~/components/ui/button";
import { CloseIcon } from "~/components/ui/icons";
import { showBannerAtom } from "~/lib/atoms";
import { authClient } from "~/lib/auth-client";
import { api } from "../convex/_generated/api";

async function handleSignInWithGoogle() {
	await authClient.signIn.social({
		callbackURL: "/api/auth/proxy/oauth",
		provider: "google",
	});
}

interface ChatBannerProps {
	isPro: boolean;
	isFree: boolean;
	isAnonymous: boolean;
}

export function ChatBanner({ isPro, isFree, isAnonymous }: ChatBannerProps) {
	const [isVisible, setIsVisible] = useAtom(showBannerAtom);

	let getRateLimitApi: GetRateLimitValueQuery =
		api.rateLimiting.getAnonymousRateLimit;

	if (isFree) {
		getRateLimitApi = api.rateLimiting.getFreeRateLimit;
	}

	if (isPro) {
		getRateLimitApi = api.rateLimiting.getProRateLimit;
	}

	const { check, status } = useRateLimit(getRateLimitApi);

	const now = Date.now();
	const count = check(now, 0);

	const remainingCount = count && Math.max(0, count.value);

	if (remainingCount === undefined) {
		return null;
	}

	const description = (() => {
		if (!status?.retryAt) return null;
		const date = new Date(status?.retryAt);

		if (isPro) {
			return `Will reset on ${format(date, "LLLL, d yyyy")}.`;
		}
		if (isToday(date)) {
			return `Will reset at ${format(date, "HH:mm")}.`;
		}
		if (isTomorrow(date)) {
			return `Will reset tomorrow, at ${format(date, "HH:mm")}.`;
		}
		return `Will reset on ${format(date, "LLLL, d yyyy 'at' HH:mm")}.`;
	})();

	return (
		<AnimatePresence initial={false}>
			{isVisible && (
				<motion.div
					className="@container/banner group/banner absolute inset-x-0 bottom-full"
					layout="position"
					transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
				>
					<div className="relative size-full">
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="mb-2"
							exit={{ opacity: 0, y: 8 }}
							initial={{ opacity: 0, y: 8 }}
							transition={{ bounce: 0.1, duration: 0.35, type: "spring" }}
						>
							<div className="flex items-center justify-between gap-3 rounded-xl border bg-muted p-3 pl-4 shadow-2xs">
								<div className="flex flex-col text-sm">
									<span className="font-medium">
										{remainingCount === 0
											? "You've hit your usage limit."
											: "You're almost out of messages."}
									</span>
									<span className="text-muted-foreground">
										{remainingCount === 0 && description
											? `${description} ${isAnonymous ? "Sign up to get more." : ""}`
											: isAnonymous
												? `You have ${remainingCount} ${remainingCount === 1 ? "message" : "messages"} left. Sign up to get more.`
												: `You have ${remainingCount} ${remainingCount === 1 ? "message" : "messages"} left.`}
									</span>
								</div>

								<div className="flex items-center gap-3">
									{isAnonymous ? (
										<Button
											className="rounded-full"
											onClick={handleSignInWithGoogle}
											size="sm"
										>
											Sign up for free
										</Button>
									) : (
										<Button className="rounded-full" size="sm">
											Upgrade
										</Button>
									)}

									<Button
										className="size-8 rounded-full"
										onClick={() => setIsVisible(false)}
										size="icon"
										variant="ghost"
									>
										<CloseIcon className="size-4" />
									</Button>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
