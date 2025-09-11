import type { UIMessage } from "ai";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function attr(key: string, condition: boolean) {
	return condition ? { [`data-${key}`]: true } : {};
}

export function buildTextFromParts(parts: UIMessage["parts"]) {
	return parts
		.filter((part) => part.type === "text")
		.map((part) => part.text)
		.join("\n")
		.trim();
}
