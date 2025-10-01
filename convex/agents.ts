import type { GatewayModelId } from "@ai-sdk/gateway";
import type { OpenAIResponsesProviderOptions } from "@ai-sdk/openai";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { components } from "~/convex/generated/api";

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
	languageModel: "openai/gpt-5-mini" as GatewayModelId,
	name: "chat",
	providerOptions: {
		openai: {
			reasoningEffort: "medium",
			reasoningSummary: "detailed",
			textVerbosity: "medium",
		} satisfies OpenAIResponsesProviderOptions,
	},
	stopWhen: stepCountIs(3),
	textEmbeddingModel: "openai/text-embedding-3-small",
});
