"use client";

import type { Preloaded } from "convex/react";
import { ChatGreetings } from "@/components/chat-greetings";
import { ChatHeader } from "@/components/chat-header";
import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { ChatStreamer } from "@/components/chat-streamer";
import type { api } from "@/convex/_generated/api";
import type { Tier } from "@/lib/types";
import type { Id } from "../convex/_generated/dataModel";

interface ChatProps {
	userId: Id<"users">;
	userTier: Tier;
	threadId: string | null;
	isAnonymous: boolean;
	preloadedMessages: Preloaded<typeof api.chat.messages.list> | null;
}

export function Chat({
	userId,
	userTier,
	threadId,
	isAnonymous,
	preloadedMessages,
}: ChatProps) {
	return (
		<main
			className="group/chat @container/chat relative flex size-full flex-col"
			data-messages={!!threadId}
		>
			<ChatHeader isAnonymous={isAnonymous} />
			<div className="flex h-full flex-col overflow-y-scroll group-data-[messages=false]/chat:gap-32">
				<div className="flex h-full flex-col overflow-hidden px-4 group-data-[messages=true]/chat:h-full group-data-[messages=true]/chat:justify-center max-md:shrink-0 group-data-[messages=false]/chat:md:gap-6 group-data-[messages=false]/chat:md:pt-24 group-data-[messages=false]/chat:lg:pt-[30svh]">
					{threadId && preloadedMessages ? (
						<ChatMessages
							preloadedMessages={preloadedMessages}
							threadId={threadId}
						/>
					) : (
						<ChatGreetings />
					)}
					<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 pb-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] md:group-data-[messages=false]/chat:pb-0">
						{threadId && <ChatStreamer userId={userId} userTier={userTier} />}
						<ChatInput threadId={threadId ?? null} />
					</div>
				</div>
			</div>
		</main>
	);
}
