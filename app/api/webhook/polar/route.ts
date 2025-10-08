import { Webhooks } from "@polar-sh/nextjs";
import { fetchAction } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export const POST = Webhooks({
	onCustomerStateChanged: async ({
		data: { externalId, activeSubscriptions },
	}) => {
		const isPro = activeSubscriptions.some(({ status }) => status === "active");

		if (externalId) {
			if (isPro) {
				await fetchAction(api.betterAuth.auth.updateUserTierAction, {
					tier: "pro",
					userId: externalId,
				});
			} else {
				await fetchAction(api.betterAuth.auth.updateUserTierAction, {
					tier: "free",
					userId: externalId,
				});
			}
		}
	},
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
});
