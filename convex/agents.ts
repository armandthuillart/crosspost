import { Agent, stepCountIs } from "@convex-dev/agent";
import { appName } from "../lib/constants";
import { CHAT_MODEL, TEXT_EMBEDDING_MODEL } from "../lib/gateway";
import { CHAT_SYSTEM_PROMPT } from "../lib/prompts";
import { components } from "./_generated/api";
import { createDraft, createPostIntent } from "./tools";

export const chatAgent = new Agent(components.agent, {
	instructions: CHAT_SYSTEM_PROMPT,
	languageModel: CHAT_MODEL,
	name: appName,
	stopWhen: stepCountIs(3),
	textEmbeddingModel: TEXT_EMBEDDING_MODEL,
	tools: { createDraft, createPostIntent },
});
