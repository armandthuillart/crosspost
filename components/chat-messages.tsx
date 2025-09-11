"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { atom, useAtom } from "jotai";
import { AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Action, Actions } from "@/components/ai-elements/actions";
import {
	Conversation,
	ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { MessagePart } from "@/components/chat-message-part";
import {
	CopyIcon,
	PencilEditIcon,
	RepeatIcon,
	TickIcon,
} from "@/components/ui/icons";

export const isStreamingAtom = atom(false);

export function ChatMessages({
	threadId,
	messages,
}: {
	threadId: string;
	messages: Array<UIMessage>;
}) {
	const [, setIsStreaming] = useAtom(isStreamingAtom);

	const lastMessage = messages.at(-1);
	const isStreaming = messages.some((m) => m.status === "streaming");
	const hasSentMessage = messages.some((m) => m.status === "pending");

	useEffect(() => {
		setIsStreaming(false);
	}, [setIsStreaming]);

	useEffect(() => {
		setIsStreaming(isStreaming);
	}, [isStreaming, setIsStreaming]);

	const [isCopied, setIsCopied] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		if (threadId) {
			setIsPending(false);
		}
	}, [threadId]);

	useEffect(() => {
		if (hasSentMessage) {
			setIsPending(true);
		}
	}, [hasSentMessage]);

	async function handleCopy(message: UIMessage) {
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
					{messages.map((message) => (
						<Message
							data-mode={editingId === message.id ? "edit" : "view"}
							from={message.role}
							hasScrollPadding={isPending && message.id === lastMessage?.id}
							key={message.id}
						>
							<MessageContent>
								{message.parts.map((part, i) => (
									<MessagePart
										key={`${message.id}-${i}`}
										message={message}
										messages={messages}
										mode={editingId === message.id ? "edit" : "view"}
										onCancel={() => setEditingId(null)}
										part={part}
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
										<Action tooltip="Try again">
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
