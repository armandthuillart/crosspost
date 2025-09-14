import type { UIMessage } from "ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Doc } from "../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function attr(key: string, condition: boolean) {
	return condition ? { [`data-${key}`]: true } : {};
}

export function toUIMessages(
	messages: Array<Doc<"messages">>,
): Array<UIMessage> {
	return messages.map((message) => ({
		id: message._id,
		parts: message.parts,
		role: message.role,
	}));
}

export function extract(parts: UIMessage["parts"]) {
	return parts
		.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join("\n")
		.trim();
}
