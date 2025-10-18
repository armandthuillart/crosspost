"use client";

import { useUIMessages } from "@convex-dev/agent/react";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ParamsOf } from "~/.next/types/routes";
import { ChatBanner } from "~/components/chat.banner";
import { ChatGreetings } from "~/components/chat.greetings";
import { ChatHeader } from "~/components/chat.header";
import { ChatInput, type InputRef } from "~/components/chat.input";
import { ChatMessages } from "~/components/chat.messages";
import { ChatSuggestions } from "~/components/chat.suggestions";
import type { MyMessage } from "~/lib/types";
import { attr } from "~/lib/utils";
import { api } from "../convex/_generated/api";

interface ChatProps {
	initialMessages: Array<MyMessage>;
	preloadedUser: Preloaded<typeof api.auth.getUser>;
	userLocation: { city?: string; country?: string; region?: string };
}

export function Chat({
	initialMessages,
	preloadedUser,
	userLocation,
}: ChatProps) {
	const { chatId } = useParams<ParamsOf<"/[locale]/chat/[chatId]">>();

	const [hasBeenSubmitted, setHasBeenSubmitted] = useState(false);

	useEffect(() => {
		if (chatId) {
			setHasBeenSubmitted(false);
		}
	}, [chatId]);

	const user = usePreloadedQuery(preloadedUser);
	const isPro = user?.tier === "pro";
	const isFree = user?.tier === "free";
	const isAnonymous = !user || user?.tier === "anonymous";

	const {
		status,
		results: uiMessages,
		loadMore,
	} = useUIMessages(
		api.chats.loadChat,
		chatId ? { threadId: chatId } : "skip",
		{
			initialNumItems: 10,
			stream: true,
		},
	);

	const messages = status === "LoadingFirstPage" ? initialMessages : uiMessages;

	const isChat = !!chatId || hasBeenSubmitted || messages.length > 0;

	const lastOrder =
		messages.find(({ status }) => status === "streaming")?.order ?? 0;

	const isStreaming = messages.some(({ status }) => status === "streaming");

	const isWaitingForResponse = messages.some(
		({ text, role, status }) =>
			role === "assistant" &&
			(status === "pending" || (status === "streaming" && !text)),
	);

	const isProcessing = messages.some(
		({ status }) => status === "pending" || status === "streaming",
	);

	const [hasSentMessage, setHasSentMessage] = useState(false);

	useEffect(() => {
		if (chatId) {
			setHasSentMessage(false);
		}
	}, [chatId]);

	useEffect(() => {
		if (isProcessing) {
			setHasSentMessage(true);
		}
	}, [isProcessing]);

	const inputRef = useRef<InputRef>(null);

	const handleSubmit = (prompt: string) => {
		inputRef.current?.onSubmit(prompt);
	};

	return (
		<main
			className="group/chat @container/chat relative flex size-full flex-col [--header-height:--spacing(13)]"
			{...attr("chat", isChat)}
		>
			<ChatHeader isAnonymous={isAnonymous} isChat={isChat} isFree={isFree} />

			<div className="flex h-full flex-col overflow-y-scroll group-data-chat/chat:gap-32">
				<div className="flex h-full flex-col group-data-chat/chat:h-full group-data-chat/chat:justify-center group-data-chat/chat:overflow-hidden max-md:shrink-0 group-not-data-chat/chat:md:gap-6 group-not-data-chat/chat:md:pt-44 group-not-data-chat/chat:lg:pt-[30dvh]">
					{!isChat ? (
						<ChatGreetings />
					) : (
						<ChatMessages
							canLoadMore={status === "CanLoadMore"}
							hasSentMessage={hasSentMessage}
							isLoadingMore={status === "LoadingMore"}
							isStreaming={isStreaming}
							isWaitingForResponse={isWaitingForResponse}
							loadMore={loadMore}
							messages={messages as Array<MyMessage>}
						/>
					)}

					<div className="px-4">
						<div className="relative mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-4 @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] max-md:mb-4 md:flex-col-reverse md:group-data-chat/chat:pb-4 md:group-not-data-chat/chat:pb-0">
							{isChat && (
								<ChatBanner
									isAnonymous={isAnonymous}
									isFree={isFree}
									isPro={isPro}
								/>
							)}

							{!isChat && <ChatSuggestions onSubmit={handleSubmit} />}

							<ChatInput
								chatId={chatId}
								isChat={isChat}
								isProcessing={isProcessing}
								isStreaming={isStreaming}
								onStartNewChat={() => setHasBeenSubmitted(true)}
								order={lastOrder}
								ref={inputRef}
								user={user}
								userLocation={userLocation}
							/>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
