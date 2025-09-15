import { Agent } from "@convex-dev/agent";
import { appName } from "../lib/constants";
import { CHAT_MODEL, EMBEDDING_MODEL } from "../lib/gateway";
import { INSTRUCTIONS } from "../lib/prompts";
import { components } from "./_generated/api";
import { createDraft, createPostIntent } from "./tools";

export const myAgent = new Agent(components.agent, {
	instructions: INSTRUCTIONS,
	languageModel: CHAT_MODEL,
	name: appName,
	textEmbeddingModel: EMBEDDING_MODEL,
	tools: { createDraft, createPostIntent },
});
