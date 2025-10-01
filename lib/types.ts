import type { UIMessage } from "@convex-dev/agent/react";
import type { InferUITool, UIDataTypes } from "ai";
import type { z } from "zod/v3";
import type { draftPost, renameChat } from "~/convex/tools";
import type { draftSchema, platformSchema, tierSchema } from "~/lib/schema";

export type Tier = z.infer<typeof tierSchema>;

export type Draft = z.infer<typeof draftSchema>;

export type UIDraft = InferUITool<typeof draftPost>;

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
	"draft-post": UIDraft;
	"rename-chat": InferUITool<typeof renameChat>;
};

export type MyMessage = UIMessage<unknown, UIDataTypes, MyUITools>;
