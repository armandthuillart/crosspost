"use client";

import { useChat } from "@ai-sdk/react";
import { ChatGreetings } from "@/components/chat-greetings";
import { ChatHeader } from "@/components/chat-header";
import { ChatInput } from "@/components/chat-input";
import type { MyMessage } from "@/lib/types";

interface ChatProps {
	initialMessages: MyMessage[];
}

export function Chat({ initialMessages }: ChatProps) {
	const {
		stop,
		status,
		messages: currentMessages,
		sendMessage,
		setMessages,
		resumeStream,
		addToolResult,
	} = useChat({
		messages: initialMessages,
	});

	return (
		<main
			className="group/chat @container/chat relative flex size-full flex-col"
			data-messages={false}
		>
			<ChatHeader />
			<div className="flex h-full flex-col overflow-y-scroll group-data-[messages=false]/chat:gap-32">
				<div className="flex h-full flex-col overflow-hidden px-4 group-data-[messages=true]/chat:h-full group-data-[messages=true]/chat:justify-center max-md:shrink-0 group-data-[messages=false]/chat:md:gap-6 group-data-[messages=false]/chat:md:pt-24 group-data-[messages=false]/chat:lg:pt-[30svh]">
					<ChatGreetings />
					<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 pb-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] md:group-data-[messages=false]/chat:pb-0">
						<ChatInput />
					</div>
				</div>
			</div>
		</main>
	);
}
