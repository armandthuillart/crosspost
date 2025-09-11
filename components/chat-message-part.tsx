"use client";

import type { UIMessage } from "ai";
import { Text } from "@/components/chat-message-part.text";

interface MessagePartProps {
	part: UIMessage["parts"][number];
	role: UIMessage["role"];
}

export function MessagePart({ part, role }: MessagePartProps) {
	switch (part.type) {
		case "text":
			return <Text part={part} role={role} />;
		default:
			return null;
	}
}
