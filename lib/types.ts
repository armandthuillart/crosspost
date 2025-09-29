import type { UIMessage } from "@convex-dev/agent/react";
import type { InferUITools, UIDataTypes } from "ai";
import type { z } from "zod/v3";
import type { draft, post, rename } from "../convex/tools";
import type { platformSchema, tierSchema } from "../lib/schema";

export type Tier = z.infer<typeof tierSchema>;

export type Platform = z.infer<typeof platformSchema>;

export type TextUIPart = Extract<UIMessage["parts"][number], { type: "text" }>;

export interface User {
	id: string;
	tier: Tier;
	name: string;
	email: string;
}

type UITools = {
	draft: {
		input: {
			title: string;
			versions: { threads?: string; bluesky?: string; x?: string };
		};
		output: string;
	};
	post: {
		input: {
			title: string;
			content: string;
			platform: "threads" | "linkedin" | "bluesky" | "x";
		};
		output: string;
	};
	rename: {
		input: { title: string };
		output: string;
	};
};

export type MyMessage = UIMessage<never, UIDataTypes, UITools>;
