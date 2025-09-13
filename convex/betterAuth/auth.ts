import { createAuth } from "../auth";

// biome-ignore lint/suspicious/noExplicitAny: static instance for BetterAuth schema generation
export const auth = createAuth({} as any);
 