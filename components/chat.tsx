"use client";

import { useUIMessages } from "@convex-dev/agent/react";
import { useMutation } from "convex/react";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatGreetings } from "@/components/chat-greetings";
import { ChatHeader } from "@/components/chat-header";
import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { ChatStreamer } from "@/components/chat-streamer";
import type { Tier } from "@/lib/types";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

interface ChatProps {
	userId: Id<"users">;
	userTier: Tier;
	isAnonymous: boolean;
}

export function Chat({ userId, userTier, isAnonymous }: ChatProps) {
	const params = useParams();
	const pathname = usePathname();
	const isChat = pathname.includes("/t/");

	const [threadId, setThreadId] = useState<string | null>(null);
	const createChat = useMutation(api.chat.thread.create);

	useEffect(() => {
		async function initializeThread() {
			if (isChat) {
				const urlThreadId = params.threadId as string;
				if (urlThreadId) {
					setThreadId(urlThreadId);
				}
			} else {
				if (!threadId) {
					const newThreadId = await createChat();
					setThreadId(newThreadId);
				}
			}
		}
		initializeThread();
	}, [isChat, params.threadId, threadId, createChat]);

	if (!threadId) {
		return <div>Loading...</div>;
	}

	return (
		<main
			className="group/chat @container/chat relative flex size-full flex-col"
			data-thread={isChat}
		>
			<ChatHeader isAnonymous={isAnonymous} />
			<div className="flex h-full flex-col overflow-y-scroll group-data-[thread=false]/chat:gap-32">
				<div className="flex h-full flex-col overflow-hidden px-4 group-data-[thread=true]/chat:h-full group-data-[thread=true]/chat:justify-center max-md:shrink-0 group-data-[thread=false]/chat:md:gap-6 group-data-[thread=false]/chat:md:pt-24 group-data-[thread=false]/chat:lg:pt-[30svh]">
					{isChat ? (
						<Thread threadId={threadId} userId={userId} userTier={userTier} />
					) : (
						<Home threadId={threadId} />
					)}
				</div>
			</div>
		</main>
	);
}

function Thread({
	userId,
	userTier,
	threadId,
}: {
	userId: Id<"users">;
	userTier: Tier;
	threadId: string;
}) {
	const { results: messages } = useUIMessages(
		api.chat.messages.list,
		{ threadId },
		{ initialNumItems: 10, stream: true },
	);

	return (
		<>
			<ChatMessages messages={messages} threadId={threadId} />
			<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 pb-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] md:group-data-[thread=false]/chat:pb-0">
				<ChatStreamer userId={userId} userTier={userTier} />
				<ChatInput threadId={threadId} />
			</div>
		</>
	);
}

function Home({ threadId }: { threadId: string }) {
	return (
		<>
			<ChatGreetings />
			<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 pb-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] md:group-data-[thread=false]/chat:pb-0">
				<ChatInput threadId={threadId} />
			</div>
		</>
	);
}
