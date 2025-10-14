"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Action, Actions } from "~/components/ai-elements/actions";
import {
	Conversation,
	ConversationAutoLoadOnTop,
	ConversationContent,
	ConversationScrollButton,
} from "~/components/ai-elements/conversation";
import {
	Message,
	MessageContent,
	MessageThinking,
} from "~/components/ai-elements/message";
import { MessagePart } from "~/components/chat.message-part";
import { CopyIcon, TickIcon } from "~/components/ui/icons";
import type { MyMessage } from "~/lib/types";
import { attr } from "~/lib/utils";

function hasContent(message: MyMessage): boolean {
	return message.parts.some((part) => part.type === "text" && part.text !== "");
}

interface ChatMessagesProps {
	messages: Array<MyMessage>;
	loadMore: (numItems: number) => void;
	isStreaming: boolean;
	canLoadMore: boolean;
	isLoadingMore: boolean;
	hasSentMessage: boolean;
	isWaitingForResponse: boolean;
}

export function ChatMessages({
	loadMore,
	messages,
	canLoadMore,
	isStreaming,
	isLoadingMore,
	hasSentMessage,
	isWaitingForResponse,
}: ChatMessagesProps) {
	const t = useTranslations("ChatMessages");

	const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

	async function handleCopy(message: MyMessage) {
		await navigator.clipboard.writeText(message.text);
		setCopiedMessageId(message.id);

		setTimeout(() => {
			setCopiedMessageId(null);
		}, 2000);
	}

	return (
		<Conversation>
			{/* Should be studied if that works or not */}
			<ConversationAutoLoadOnTop
				canLoadMore={canLoadMore}
				isLoadingMore={isLoadingMore}
				loadMore={loadMore}
			/>

			<ConversationContent>
				{messages.map((m, i) => {
					const isLast = i === messages.length - 1;
					const hasCopied = copiedMessageId === m.id;
					const hasScrollPadding =
						isLast && hasSentMessage && !isWaitingForResponse;

					return (
						<Message
							{...attr("scroll-padding", hasScrollPadding)}
							{...attr("user", m.role === "user")}
							from={m.role}
							key={m.key}
						>
							<MessageContent>
								{m.parts.map((p, i) => (
									<MessagePart
										isStreaming={isStreaming}
										// biome-ignore lint/suspicious/noArrayIndexKey: it's alright
										key={i}
										part={p}
										role={m.role}
									/>
								))}

								{hasContent(m) && (
									<Actions>
										<Action onClick={() => handleCopy(m)} tooltip={t("copy")}>
											{hasCopied ? <TickIcon /> : <CopyIcon />}
										</Action>
									</Actions>
								)}
							</MessageContent>
						</Message>
					);
				})}

				{isWaitingForResponse && (
					<Message from="assistant">
						<MessageContent>
							<MessageThinking />
						</MessageContent>
					</Message>
				)}
			</ConversationContent>
			<ConversationScrollButton />
		</Conversation>
	);
}
