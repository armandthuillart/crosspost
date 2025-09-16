"use client";

import { useUIMessages } from "@convex-dev/agent/react";
import { useEffect, useState } from "react";
import { ChatGreetings } from "@/components/chat-greetings";
import { ChatHeader } from "@/components/chat-header";
import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { ChatStreamer } from "@/components/chat-streamer";
import { api } from "@/convex/_generated/api";
import type { Tier } from "@/lib/types";
import { attr } from "@/lib/utils";

interface ChatProps {
	userId: string;
	userTier: Tier;
	threadId?: string;
	isAnonymous: boolean;
}

export function Chat({ userId, userTier, isAnonymous, threadId }: ChatProps) {
	const {
		status,
		results: messages,
		loadMore,
	} = useUIMessages(api.chat.loadChat, threadId ? { threadId } : "skip", {
		initialNumItems: 10,
		stream: !!threadId,
	});

	const isChat = messages.length > 0;
	const isStreaming = messages.some((m) => m.status === "streaming");
	const hasSubmitted = messages.some((m) => m.status === "pending");

	const [hasSentMessage, setHasSentMessage] = useState(false);

	useEffect(() => {
		if (threadId) {
			setHasSentMessage(false);
		}
	}, [threadId]);

	useEffect(() => {
		if (hasSubmitted) {
			setHasSentMessage(true);
		}
	}, [hasSubmitted]);

	return (
		<main
			className="group/chat @container/chat relative flex size-full flex-col"
			{...attr("chat", isChat)}
		>
			<ChatHeader isAnonymous={isAnonymous} />
			<div className="flex h-full flex-col overflow-y-scroll group-data-chat/chat:gap-32">
				<div className="flex h-full flex-col overflow-hidden px-4 group-data-chat/chat:h-full group-data-chat/chat:justify-center max-md:shrink-0 group-not-data-chat/chat:md:gap-6 group-not-data-chat/chat:md:pt-24 group-not-data-chat/chat:lg:pt-[30dvh]">
					{!isChat ? (
						<ChatGreetings />
					) : (
						<ChatMessages
							canLoadMore={status === "CanLoadMore"}
							hasSentMessage={hasSentMessage}
							isLoadingMore={status === "LoadingMore"}
							loadMore={loadMore}
							messages={messages}
						/>
					)}
					<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 pb-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] md:group-not-data-chat/chat:pb-0">
						{isChat && <ChatStreamer userTier={userTier} />}
						<ChatInput
							isChat={isChat}
							isStreaming={isStreaming}
							threadId={threadId}
							userId={userId}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
