import type { GatewayEmbeddingModelId, GatewayModelId } from "@ai-sdk/gateway";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { appName } from "../lib/constants";
import { AGENT_PROMPT } from "../lib/prompts";
import { components } from "./_generated/api";
import { draft, post, rename } from "./tools";

export const agent = new Agent(components.agent, {
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
	instructions: AGENT_PROMPT,
	languageModel: "xai/grok-4-fast-non-reasoning" as GatewayModelId,
	name: appName,
	stopWhen: stepCountIs(3),
	textEmbeddingModel:
		"openai/text-embedding-3-small" as GatewayEmbeddingModelId,
	tools: { draft, post, rename },
});
