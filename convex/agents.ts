import { Agent } from "@convex-dev/agent";
import { appName } from "../lib/constants";
import { CHAT_MODEL, EMBEDDING_MODEL } from "../lib/gateway";
import { CHAT_SYSTEM_PROMPT } from "../lib/prompts";
import { components } from "./_generated/api";
import { createDraft, createPostIntent } from "./tools";

export const myAgent = new Agent(components.agent, {
	instructions: CHAT_SYSTEM_PROMPT,
	languageModel: CHAT_MODEL,
	name: appName,
	textEmbeddingModel: EMBEDDING_MODEL,
	tools: { createDraft, createPostIntent },
});
