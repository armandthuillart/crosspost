import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { MyMessage } from "@/lib/types";
import type { Doc } from "../convex/_generated/dataModel";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function convertDbMessagesToUiMessages(
	dbMessages: Doc<"messages">[],
): MyMessage[] {
	return dbMessages.map((msg) => ({
		id: msg._id,
		metadata: { createdAt: new Date(msg.createdAt).toISOString() },
		parts: msg.parts,
		role: msg.role,
	}));
}
