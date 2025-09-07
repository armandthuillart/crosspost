import type { GatewayModelId } from "@ai-sdk/gateway";

export const CHAT_MODEL: GatewayModelId = "google/gemini-2.5-flash";
export const CHAT_TITLE_MODEL: GatewayModelId = "google/gemini-2.5-flash-lite";

export const SUPPORTED_MODELS: GatewayModelId[] = [
	CHAT_MODEL,
	CHAT_TITLE_MODEL,
];
