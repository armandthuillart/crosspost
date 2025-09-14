"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState } from "react";
import { ChatGreetings } from "@/components/chat-greetings";
import { ChatHeader } from "@/components/chat-header";
import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { ChatStreamer } from "@/components/chat-streamer";
import type { Tier } from "@/lib/types";
import { attr } from "@/lib/utils";
import type { Id } from "../convex/betterAuth/_generated/dataModel";

interface ChatProps {
	token: string;
	userId: Id<"user">;
	userTier: Tier;
	isAnonymous: boolean;
	optimisticId: string;
	initialMessages: Array<UIMessage>;
}

export function Chat({
	token,
	userId,
	userTier,
	isAnonymous,
	optimisticId,
	initialMessages,
}: ChatProps) {
	const { status, messages, sendMessage } = useChat({
		id: optimisticId,
		messages: initialMessages,
		onError: (error) => {
			console.error(error);
		},
		transport: new DefaultChatTransport({
			api: `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/api/chat`,
			headers: { Authorization: `Bearer ${token}` },
			prepareSendMessagesRequest({ messages, id: optimisticId }) {
				return {
					body: {
						message: messages.at(-1),
						optimisticId,
					},
				};
			},
		}),
	});

	const isChat = messages.length > 0;
	const hasSubmitted = status === "submitted";

	const [hasSentMessage, setHasSentMessage] = useState(false);

	useEffect(() => {
		if (optimisticId) {
			setHasSentMessage(false);
		}
	}, [optimisticId]);

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
						<ChatMessages hasSentMessage={hasSentMessage} messages={messages} />
					)}
					<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 pb-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] md:group-not-data-chat/chat:pb-0">
						{isChat && <ChatStreamer userId={userId} userTier={userTier} />}
						<ChatInput
							chatStatus={status}
							isChat={isChat}
							optimisticId={optimisticId}
							sendMessage={sendMessage}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
