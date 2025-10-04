"use client";

import { Text } from "~/components/chat.message-part.text";
import { Draft } from "~/components/draft";
import { ShiningText } from "~/components/ui/shining-text";
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
			return <ShiningText text="Thinking deeper..." />;
		case "tool-get-draft": {
			const title = part.input?.title;
			const versions = part.input?.versions;

			if (!title || !versions) {
				return <ShiningText text="Creating a draft..." />;
			}

			return <Draft title={title} versions={versions} />;
		}
		case "tool-rename-chat": {
			const { state } = part;

			if (state === "output-available") {
				return;
			}

			return <ShiningText text="Renaming the chat..." />;
		}
		default:
			return null;
	}
}
