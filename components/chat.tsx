"use client";

import { useChat } from "@ai-sdk/react";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";
import { ChatGreetings } from "@/components/chat-greetings";
import { ChatHeader } from "@/components/chat-header";
import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import type { MyMessage } from "@/lib/types";

interface ChatProps {
	isAnonymous: boolean;
	initialMessages: MyMessage[];
}

export function Chat({ isAnonymous, initialMessages }: ChatProps) {
	const [query] = useQueryState("q", parseAsString);

	const { id, stop, status, messages, regenerate, sendMessage, setMessages } =
		useChat({
			messages: initialMessages,
		});

	useEffect(() => {
		if (query) {
			sendMessage({
				parts: [{ text: query, type: "text" }],
				role: "user",
			});

			window.history.replaceState({}, "", `/chat/${id}`);
		}
	}, [id, query, sendMessage]);

	return (
		<main
			className="group/chat @container/chat relative flex size-full flex-col"
			data-messages={messages.length > 0}
		>
			<ChatHeader isAnonymous={isAnonymous} />
			<div className="flex h-full flex-col overflow-y-scroll group-data-[messages=false]/chat:gap-32">
				<div className="flex h-full flex-col overflow-hidden px-4 group-data-[messages=true]/chat:h-full group-data-[messages=true]/chat:justify-center max-md:shrink-0 group-data-[messages=false]/chat:md:gap-6 group-data-[messages=false]/chat:md:pt-24 group-data-[messages=false]/chat:lg:pt-[30svh]">
					{messages.length > 0 ? (
						<ChatMessages
							chatId={id}
							messages={messages}
							regenerate={regenerate}
							setMessages={setMessages}
							status={status}
						/>
					) : (
						<ChatGreetings />
					)}
					<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 pb-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] md:group-data-[messages=false]/chat:pb-0">
						<ChatInput setMessages={setMessages} status={status} stop={stop} />
					</div>
				</div>
			</div>
		</main>
	);
}
