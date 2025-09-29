import type { GatewayModelId } from "@ai-sdk/gateway";
import type { XaiProviderOptions } from "@ai-sdk/xai";
import { Agent, stepCountIs } from "@convex-dev/agent";
import { components } from "~/convex/generated/api";
import { draft, post, rename } from "~/convex/tools";
import { appName } from "~/lib/constants";
import { AGENT_PROMPT } from "~/lib/prompts";

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
	providerOptions: {
		xai: {
			searchParameters: {
				maxSearchResults: 15,
				mode: "auto",
				returnCitations: true,
				sources: [
					{ safeSearch: true, type: "web" },
					{ type: "x" },
					{ safeSearch: true, type: "news" },
				],
			},
		} satisfies XaiProviderOptions,
	},
	stopWhen: stepCountIs(3),
	textEmbeddingModel: "openai/text-embedding-3-small",
	tools: { draft, post, rename },
});
