"use client";

import { Text } from "~/components/chat.message-part.text";
import { Draft } from "~/components/draft";
import type { MyMessage } from "~/lib/types";

interface MessagePartProps {
	part: MyMessage["parts"][number];
	role: MyMessage["role"];
}

export function MessagePart({ part, role }: MessagePartProps) {
	switch (part.type) {
		case "text":
			return <Text part={part} role={role} />;
		case "tool-draft": {
			return <Draft part={part} />;
		}
		default:
			return null;
	}
}
