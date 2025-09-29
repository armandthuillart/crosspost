"use client";

import { type UIMessage, useSmoothText } from "@convex-dev/agent/react";
import { MessageBubble } from "~/components/ai-elements/message";
import { Response } from "~/components/ai-elements/response";
import type { TextUIPart } from "~/lib/types";
import { attr } from "~/lib/utils";

interface TextProps {
	part: TextUIPart;
	role: UIMessage["role"];
}

export function Text({ part, role }: TextProps) {
	const [visibleText] = useSmoothText(part.text, {
		startStreaming: part.state === "streaming",
	});

	if (role === "user") {
		return (
			<MessageBubble {...attr("multiline", part.text.length > 55)}>
				<Response>{visibleText}</Response>
			</MessageBubble>
		);
	}

	return <Response>{visibleText}</Response>;
}
