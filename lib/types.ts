import type { UIMessage } from "@convex-dev/agent/react";
import type { Infer } from "convex/values";
import type { z } from "zod";
import type { platform } from "@/convex/schema";
import type { tierSchema } from "@/lib/schema";

export type Tier = z.infer<typeof tierSchema>;

export type Platform = Infer<typeof platform>;

export type TextUIPart = Extract<UIMessage["parts"][number], { type: "text" }>;

export interface User {
	id: string;
	tier: Tier;
	name: string;
	email: string;
}
