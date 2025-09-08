"use client";

import type { UseChatHelpers } from "@ai-sdk/react";
import type { TextUIPart } from "ai";
import { MessageBubble, MessageEditor } from "@/components/ai-elements/message";
import { Response } from "@/components/ai-elements/response";
import type { MyMessage } from "@/lib/types";

interface TextProps {
	part: TextUIPart;
	mode: "edit" | "view";
	status: UseChatHelpers<MyMessage>["status"];
	message: MyMessage;
	onCancel: () => void;
	regenerate: UseChatHelpers<MyMessage>["regenerate"];
	setMessages: UseChatHelpers<MyMessage>["setMessages"];
}

export function Text({
	mode,
	part,
	status,
	message,
	onCancel,
	regenerate,
	setMessages,
}: TextProps) {
	switch (message.role) {
		case "user":
			if (mode === "edit") {
				return (
					<MessageEditor
						message={message}
						onCancel={onCancel}
						regenerate={regenerate}
						setMessages={setMessages}
					/>
				);
			}

			return (
				<MessageBubble data-multiline={(part.text.length ?? 0) > 55}>
					<Response from={message.role} status={status}>
						{part.text}
					</Response>
				</MessageBubble>
			);

		default:
			return (
				<Response from={message.role} status={status}>
					{part.text}
				</Response>
			);
	}
}
