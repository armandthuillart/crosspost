"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import type { UIMessagePart } from "ai";
import { Text } from "@/components/chat-message-part.text";
import type { Tools } from "@/lib/types";

interface ChatMessagePartProps {
	part: UIMessagePart<never, Tools>;
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
