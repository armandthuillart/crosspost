"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { ChatGreetings } from "@/components/chat-greetings";
import { ChatHeader } from "@/components/chat-header";
import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { ChatStreamer } from "@/components/chat-streamer";
import type { Tier } from "@/lib/types";
import { attr } from "@/lib/utils";
import type { Id } from "../convex/_generated/dataModel";

interface ChatProps {
	userId: Id<"users">;
	userTier: Tier;
	isAnonymous: boolean;
	initialMessages: Array<UIMessage>;
}

export function Chat({
	userId,
	userTier,
	isAnonymous,
	initialMessages,
}: ChatProps) {
	const { id, status, messages, sendMessage } = useChat({
		messages: initialMessages,
	});

	const isChat = messages.length > 0;

	return (
		<main
			className="group/chat @container/chat relative flex size-full flex-col"
			{...attr("chat", isChat)}
		>
			<ChatHeader isAnonymous={isAnonymous} />
			<div className="flex h-full flex-col overflow-y-scroll group-data-chat/chat:gap-32">
				<div className="flex h-full flex-col overflow-hidden px-4 group-data-chat/chat:h-full group-data-chat/chat:justify-center max-md:shrink-0 group-data-chat/chat:md:gap-6 group-data-chat/chat:md:pt-24 group-data-chat/chat:lg:pt-[30svh]">
					{!isChat ? (
						<ChatGreetings />
					) : (
						<ChatMessages
							chatId={id}
							isSubmitted={status === "submitted"}
							messages={messages}
						/>
					)}
					<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 pb-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] md:group-data-chat/chat:pb-0">
						{isChat && <ChatStreamer userId={userId} userTier={userTier} />}
						<ChatInput
							chatId={id}
							chatStatus={status}
							isChat={isChat}
							sendMessageAction={sendMessage}
						/>
					</div>
				</div>
			</div>
		</main>
	);
}
