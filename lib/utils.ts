import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Platform } from "../lib/types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function attr(key: string, condition: boolean) {
	return condition ? { [`data-${key}`]: true } : {};
}

export function formatNumberToK(number: number) {
	if (number >= 1000) {
		const value = number / 1000;
		const formatted = Number.isInteger(value)
			? value.toString()
			: value.toFixed(1).replace(/\.0$/, "");
		return `${formatted}k`;
	}
	return number.toString();
}

export function getURL(platform: Platform, content: string): string {
	function parse(content: string): string {
		const hashtags = content.match(/#\w+/g)?.map((tag) => tag.slice(1)) || [];
		const urls = content.match(/https?:\/\/[^\s]+/g) || [];
		const via = content.match(/@(\w+)/)?.[1] || null;

		let text = content
			.replace(/#\w+/g, "")
			.replace(/https?:\/\/[^\s]+/g, "")
			.replace(/@\w+/g, "")
			.replace(/\s+/g, " ")
			.trim();

		if (hashtags.length > 0) {
			text += ` ${hashtags.map((tag) => `#${tag}`).join(" ")}`;
		}
		if (urls.length > 0) {
			text += `\n${urls[0]}`;
		}
		if (via) {
			text += `\n@${via}`;
		}
		return text;
	}

	const parsedContent = parse(content);

	if (platform === "linkedin") {
		const encodedContent = encodeURIComponent(parsedContent);
		return `https://www.linkedin.com/feed/?shareActive&mini=true&text=${encodedContent}`;
	}

	const params = new URLSearchParams();
	params.append("text", parsedContent);

	const baseUrls: Record<Exclude<Platform, "linkedin">, string> = {
		bluesky: "https://bsky.app/intent/compose",
		threads: "https://www.threads.net/intent/post",
		x: "https://x.com/intent/post",
	};

	const baseUrl = baseUrls[platform];
	return `${baseUrl}?${params.toString()}`;
}

export async function tryCatch<T>(
	promise: Promise<T>,
): Promise<{ data: T | null; error: Error | null }> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error: unknown) {
		return {
			data: null,
			error: error instanceof Error ? error : new Error(String(error)),
		};
	}
}
