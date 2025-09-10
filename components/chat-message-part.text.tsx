"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { useSmoothText } from "@convex-dev/agent/react";
import type { TextUIPart } from "ai";
import { MessageBubble, MessageEditor } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";

interface TextProps {
	part: TextUIPart;
	mode: "edit" | "view";
	message: UIMessage;
	onCancel: () => void;
}

export function Text({ mode, part, message, onCancel }: TextProps) {
	const [visibleText] = useSmoothText(message.text, {
		startStreaming: message.status === "streaming",
	});

	switch (message.role) {
		case "user":
			if (mode === "edit") {
				return <MessageEditor message={message} onCancel={onCancel} />;
			}

			return (
				<MessageBubble data-multiline={(part.text.length ?? 0) > 55}>
					<Response>{visibleText}</Response>
				</MessageBubble>
			);

		default:
			return <Response>{visibleText}</Response>;
	}
}
