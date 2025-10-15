import { gateway } from "@ai-sdk/gateway";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { components } from "./_generated/api";

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
	languageModel: gateway.languageModel("anthropic/claude-3.5-haiku"),
	name: "chat",
	stopWhen: stepCountIs(3),
	textEmbeddingModel: gateway.textEmbeddingModel(
		"openai/text-embedding-3-small",
	),
});
