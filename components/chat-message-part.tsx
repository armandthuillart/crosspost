"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { Text } from "@/components/chat-message-part.text";

interface ChatMessagePartProps {
	part: UIMessage["parts"][number];
	mode: "view" | "edit";
	message: UIMessage;
	onCancel: () => void;
}

export function ChatMessagePart({
	mode,
	part,
	message,
	onCancel,
}: ChatMessagePartProps) {
	switch (part.type) {
		case "text":
			return (
				<Text message={message} mode={mode} onCancel={onCancel} part={part} />
			);
		default:
			return null;
	}
}
