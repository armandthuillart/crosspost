import type { ThreadDoc } from "@convex-dev/agent";
import type { OptimisticLocalStore } from "convex/browser";
import { insertAtTop } from "convex/react";
import type {
	FunctionReference,
	PaginationOptions,
	PaginationResult,
} from "convex/server";

export function optimisticallyCreateChat(
	query: FunctionReference<
		"query",
		"public",
		{
			paginationOpts: PaginationOptions;
		},
		PaginationResult<ThreadDoc>
	>,
	setCurrentThreadId: (id: string) => void,
): (store: OptimisticLocalStore) => void {
	return (store) => {
		const optimisticId = generateConvexId();
		setCurrentThreadId(optimisticId);

		insertAtTop({
			argsToMatch: { paginationOpts: { cursor: null, numItems: 10 } },
			item: {
				_creationTime: Date.now(),
				_id: optimisticId,
				status: "active",
				title: "New Chat",
			},
			localQueryStore: store,
			paginatedQuery: query,
		});
	};
}

function generateConvexId(): string {
	const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";
	for (let i = 0; i < 32; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}
