import type { UIMessage } from "@convex-dev/agent/react";
import type { InferUITool, UIDataTypes } from "ai";
import type { z } from "zod/v3";
import type { draft, rename } from "~/convex/tools";
import type { draftSchema, platformSchema, tierSchema } from "~/lib/schema";

export type Tier = z.infer<typeof tierSchema>;

export type Draft = z.infer<typeof draftSchema>;

export type UIDraft = InferUITool<typeof draft>;

export type Platform = z.infer<typeof platformSchema>;

export type TextUIPart = Extract<UIMessage["parts"][number], { type: "text" }>;

export interface User {
	id: string;
	tier: Tier;
	email: string;
	lastName?: string;
	firstName: string;
}

type MyUITools = {
	draft: UIDraft;
	rename: InferUITool<typeof rename>;
};

export type MyMessage = UIMessage<unknown, UIDataTypes, MyUITools>;
