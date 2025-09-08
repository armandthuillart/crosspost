"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
	Conversation,
	ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
	CopyIcon,
	PencilEditIcon,
	RepeatIcon,
	TickIcon,
} from "@/components/ui/icons";
import type { MyMessage } from "@/lib/types";
import { ChatMessagePart } from "./chat-message-part";

interface ChatMessagesProps {
	chatId: string;
	status: UseChatHelpers<MyMessage>["status"];
	messages: UseChatHelpers<MyMessage>["messages"];
	regenerate: UseChatHelpers<MyMessage>["regenerate"];
	setMessages: UseChatHelpers<MyMessage>["setMessages"];
}

export function ChatMessages({
	chatId,
	status,
	messages,
	regenerate,
	setMessages,
}: ChatMessagesProps) {
	const [isCopied, setIsCopied] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [hasSentMessage, setHasSentMessage] = useState(false);

	useEffect(() => {
		if (chatId) {
			setHasSentMessage(false);
		}
	}, [chatId]);

	useEffect(() => {
		if (status === "submitted") {
			setHasSentMessage(true);
		}
	}, [status]);

	async function handleCopy(message: MyMessage) {
		const textFromParts = message.parts
			?.filter((part) => part.type === "text")
			.map((part) => part.text)
			.join("\n")
			.trim();

		await navigator.clipboard.writeText(textFromParts);
		setIsCopied(true);

		setTimeout(() => {
			setIsCopied(false);
		}, 2000);
	}
	return (
		<Conversation>
			<ConversationContent>
				<AnimatePresence initial={false} mode="popLayout">
					{messages.map((message, i) => (
						<Message
							data-mode={editingId === message.id ? "edit" : "view"}
							from={message.role}
							hasScrollPadding={hasSentMessage && i === messages.length - 1}
							key={message.id}
						>
							<MessageContent>
								{message.parts?.map((part, i) => (
									<ChatMessagePart
										key={`${message.id}-${i}`}
										message={message}
										mode={editingId === message.id ? "edit" : "view"}
										onCancel={() => setEditingId(null)}
										part={part}
										regenerate={regenerate}
										setMessages={setMessages}
										status={status}
									/>
								))}
								<Actions>
									<Action onClick={() => handleCopy(message)} tooltip="Copy">
										{isCopied ? <TickIcon /> : <CopyIcon />}
									</Action>
									{message.role === "user" ? (
										<Action
											onClick={() => setEditingId(message.id)}
											tooltip="Edit message"
										>
											<PencilEditIcon />
										</Action>
									) : (
										<Action onClick={() => regenerate()} tooltip="Try again">
											<RepeatIcon />
										</Action>
									)}
								</Actions>
							</MessageContent>
						</Message>
					))}
				</AnimatePresence>
			</ConversationContent>
		</Conversation>
	);
}
