"use client";

import { Text } from "~/components/chat.message-part.text";
import { Thinking } from "~/components/chat.message-part.thinking";
import { Draft } from "~/components/draft";
import type { MyMessage } from "~/lib/types";

interface MessagePartProps {
	part: MyMessage["parts"][number];
	role: MyMessage["role"];
	isStreaming: boolean;
}

export function MessagePart({ part, role, isStreaming }: MessagePartProps) {
	switch (part.type) {
		case "text":
			return <Text isStreaming={isStreaming} part={part} role={role} />;
		case "reasoning":
			if (part.text?.trim().length === 0) return null;
			return <Thinking isStreaming={isStreaming} part={part} />;
		case "tool-draft-post": {
			return <Draft part={part} />;
		}
		default:
			return null;
	}
}
