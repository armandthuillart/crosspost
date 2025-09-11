"use client";

import { useSmoothText } from "@convex-dev/agent/react";
import type { TextUIPart, UIMessage } from "ai";
import { MessageBubble } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import { attr } from "@/lib/utils";

interface TextProps {
	part: TextUIPart;
	role: UIMessage["role"];
}

export function Text({ part, role }: TextProps) {
	const [textPart] = useSmoothText(part.text, {
		startStreaming: part.state === "streaming",
	});

	switch (role) {
		case "user":
			return (
				<MessageBubble {...attr("multiline", part.text.length > 55)}>
					<Response>{textPart}</Response>
				</MessageBubble>
			);
		default:
			return <Response>{textPart}</Response>;
	}
}
