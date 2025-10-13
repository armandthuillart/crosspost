import type { OptimisticLocalStore } from "convex/browser";
import type { Platform } from "~/lib/types";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

export function optimisticallyUpdateDraft(
	{ getQuery, setQuery }: OptimisticLocalStore,
	{
		content,
		draftId,
		platform,
	}: {
		content: string;
		draftId: Id<"drafts">;
		platform: Platform;
	},
) {
	const draft = getQuery(api.drafts.getDraft, {
		draftId,
	});

	if (draft !== undefined) {
		const optimistic = { ...draft.versions, [platform]: content };

		setQuery(
			api.drafts.getDraft,
			{ draftId },
			{ ...draft, versions: optimistic },
		);
	}
}
