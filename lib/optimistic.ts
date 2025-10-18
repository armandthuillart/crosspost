import type { OptimisticLocalStore } from "convex/browser";
import type { Platform } from "~/lib/types";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

export function optimisticallyUpdateDraft(
	localStore: OptimisticLocalStore,
	args: {
		content: string;
		draftId: Id<"drafts">;
		platform: Platform;
	},
) {
	const draft = localStore.getQuery(api.drafts.getDraft, {
		draftId: args.draftId,
	});

	if (draft !== undefined) {
		const optimistic = {
			...draft.versions,
			[args.platform]: args.content,
		};

		localStore.setQuery(
			api.drafts.getDraft,
			{ draftId: args.draftId },
			{ ...draft, versions: optimistic },
		);
	}
}
