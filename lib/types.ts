import type { UIMessage } from "@convex-dev/agent/react";
import type { InferUITool, UIDataTypes, UITool } from "ai";
import type { z } from "zod";
import type { getDraft, renameChat } from "../convex/tools";
import type { draftSchema, platformSchema, tierSchema } from "../lib/schema";

export type Tier = z.infer<typeof tierSchema>;

export type UIDraft = z.infer<typeof draftSchema>;

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
	"get-draft": InferUITool<typeof getDraft>;
	"web-search": UITool;
	"rename-chat": InferUITool<typeof renameChat>;
};

export type MyMessage = UIMessage<unknown, UIDataTypes, MyUITools>;

export type ThemeColor = "default" | "green" | "blue" | "pink" | "orange";
