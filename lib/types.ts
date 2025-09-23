import type { UIMessage } from "@convex-dev/agent/react";
import type { z } from "zod/v3";
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
