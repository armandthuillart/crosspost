"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { Text } from "@/components/chat-message-part.text";

interface MessagePartProps {
	part: UIMessage["parts"][number];
	mode: "view" | "edit";
	message: UIMessage;
	onCancel: () => void;
}

export function MessagePart({
	mode,
	part,
	message,
	onCancel,
}: MessagePartProps) {
	switch (part.type) {
		case "text":
			return (
				<Text
					isEditing={mode === "edit"}
					message={message}
					onCancel={onCancel}
				/>
			);
		default:
			return null;
	}
}
