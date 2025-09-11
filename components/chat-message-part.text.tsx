"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { useSmoothText } from "@convex-dev/agent/react";
import { MessageBubble, MessageEditor } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

interface TextProps {
	message: UIMessage;
	onCancel: () => void;
	isEditing: boolean;
	shouldStream: boolean;
}

export function Text({
	message,
	onCancel,
	isEditing,
	shouldStream,
}: TextProps) {
	const [visibleText] = useSmoothText(message.text, {
		startStreaming: shouldStream,
	});

	switch (message.role) {
		case "user":
			if (isEditing) {
				return <MessageEditor message={message} onCancel={onCancel} />;
			}

			return (
				<MessageBubble data-multiline={message.text.length > 55}>
					<Response>{visibleText}</Response>
				</MessageBubble>
			);

		default:
			return <Response>{visibleText}</Response>;
	}
}
