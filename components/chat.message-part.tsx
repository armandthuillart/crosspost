"use client";

import { Text } from "~/components/chat.message-part.text";
import { Thinking } from "~/components/chat.message-part.thinking";
import { Draft } from "~/components/draft";
import type { MyMessage } from "~/lib/types";

type ReasoningPart = Extract<MyMessage["parts"][number], { type: "reasoning" }>;

interface MessagePartProps {
	part: MyMessage["parts"][number];
	role: MyMessage["role"];
	isStreaming: boolean;
	reasoningParts?: ReasoningPart[];
}

export function MessagePart({
	part,
	role,
	isStreaming,
	reasoningParts,
}: MessagePartProps) {
	switch (part.type) {
		case "text":
			return <Text isStreaming={isStreaming} part={part} role={role} />;
		case "reasoning":
			if (part.text?.trim().length === 0) return null;
			if (!reasoningParts?.length) return null;
			if (reasoningParts[0] !== part) return null;
			return <Thinking isStreaming={isStreaming} parts={reasoningParts} />;
		case "tool-draft-post": {
			return <Draft part={part} />;
		}
		default:
			return null;
	}
}
