import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx/runtime/next";
import { docs, meta } from "~/.source";
import { i18n } from "~/lib/i18n";

export const source = loader({
	baseUrl: "/docs",
	i18n,
	source: createMDXSource(docs, meta),
});
