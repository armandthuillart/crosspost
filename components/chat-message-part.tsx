"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { Text } from "@/components/chat-message-part.text";

interface MessagePartProps {
	part: UIMessage["parts"][number];
	mode: "view" | "edit";
	message: UIMessage;
	onCancel: () => void;
	messages: UIMessage[];
}

export function MessagePart({
	mode,
	part,
	message,
	onCancel,
	messages,
}: MessagePartProps) {
	const shouldStream =
		message.id === messages.at(-1)?.id &&
		(message.status === "streaming" || message.role === "assistant");

	switch (part.type) {
		case "text":
			return (
				<Text
					isEditing={mode === "edit"}
					message={message}
					onCancel={onCancel}
					shouldStream={shouldStream}
				/>
			);
		default:
			return null;
	}
}
