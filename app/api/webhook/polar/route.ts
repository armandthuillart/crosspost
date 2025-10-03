import { Webhooks } from "@polar-sh/nextjs";
import { fetchMutation } from "convex/nextjs";
import { api } from "~/convex/generated/api";

export const POST = Webhooks({
	onCustomerStateChanged: async ({
		data: { externalId, activeSubscriptions },
	}) => {
		const isPro = activeSubscriptions.some(({ status }) => status === "active");

		if (externalId) {
			if (isPro) {
				await fetchMutation(api.betterAuth.auth.updateUserTier, {
					tier: "pro",
					userId: externalId,
				});
			} else {
				await fetchMutation(api.betterAuth.auth.updateUserTier, {
					tier: "free",
					userId: externalId,
				});
			}
		}
	},
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
});
