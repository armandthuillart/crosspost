import { Agent, stepCountIs } from "@convex-dev/agent";
import { appName } from "../lib/constants";
import { CHAT_SYSTEM_PROMPT } from "../lib/prompts";
import { components } from "./_generated/api";
import { createDraft, createPostIntent, renameChat } from "./tools";

export const chatAgent = new Agent(components.agent, {
	contextOptions: {
		recentMessages: 40,
		searchOptions: {
			limit: 20,
			messageRange: { after: 2, before: 3 },
			textSearch: true,
			vectorScoreThreshold: 0.25,
			vectorSearch: true,
		},
		searchOtherThreads: true,
	},
	instructions: CHAT_SYSTEM_PROMPT,
	languageModel: "google/gemini-2.5-flash",
	name: appName,
	stopWhen: stepCountIs(3),
	textEmbeddingModel: "google/text-embedding-005",
	tools: { createDraft, createPostIntent, renameChat },
});
