import { createGatewayProvider, type GatewayModelId } from "@ai-sdk/gateway";
import type { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";

const gateway = createGatewayProvider({
	baseURL: process.env.AI_GATEWAY_BASE_URL,
});

interface AvailableModel {
	id: GatewayModelId;
	name: string;
}

export async function getAvailableModels(): Promise<AvailableModel[]> {
	const response = await gateway.getAvailableModels();
	return [...response.models.map(({ id, name }) => ({ id, name }))];
}

interface ModelOptions {
	model: GatewayModelId;
	providerOptions?: Record<"google", GoogleGenerativeAIProviderOptions>;
}

export function getModelOptions(modelId: GatewayModelId): ModelOptions {
	if (modelId === "google/gemini-2.5-flash") {
		return {
			model: modelId,
			providerOptions: {
				google: {
					responseModalities: ["TEXT"],
				},
			},
		};
	}

	if (modelId === "google/gemini-2.5-flash-lite") {
		return {
			model: modelId,
			providerOptions: {
				google: {
					responseModalities: ["TEXT"],
				},
			},
		};
	}

	return {
		model: modelId,
	};
}
