import type { UIMessage } from "ai";

export type Tools = {};

export type Metadata = { createdAt: string };

export type MyMessage = UIMessage<Metadata, never, Tools>;
