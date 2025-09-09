import type { Infer } from "convex/values";
import type { platform } from "../convex/schema";

export type Tier = "anonymous" | "free" | "pro";

export type Platform = Infer<typeof platform>;
