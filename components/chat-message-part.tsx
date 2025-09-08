"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessagePart } from "ai";
import { Text } from "@/components/chat-message-part.text";
import type { MyMessage, Tools } from "@/lib/types";

interface ChatMessagePartProps {
	part: UIMessagePart<never, Tools>;
	mode: "view" | "edit";
	status: UseChatHelpers<MyMessage>["status"];
	message: MyMessage;
	onCancel: () => void;
	regenerate: UseChatHelpers<MyMessage>["regenerate"];
	setMessages: UseChatHelpers<MyMessage>["setMessages"];
}

export function ChatMessagePart({
	mode,
	part,
	status,
	message,
	onCancel,
	regenerate,
	setMessages,
}: ChatMessagePartProps) {
	switch (part.type) {
		case "text":
			return (
				<Text
					message={message}
					mode={mode}
					onCancel={onCancel}
					part={part}
					regenerate={regenerate}
					setMessages={setMessages}
					status={status}
				/>
			);
		default:
			return null;
	}
}
