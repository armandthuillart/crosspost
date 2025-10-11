"use node";

import { Client } from "@notionhq/client";
import { v } from "convex/values";
import type { Locale } from "next-intl";
import { NotionConverter } from "notion-to-md";
import { ChatSDKError } from "../lib/errors";
import type { LegalDocument } from "../lib/types";
import { tryCatch } from "../lib/utils";
import { action } from "./_generated/server";
import { locale } from "./schema";

const dataSourceIds: Record<Locale, string> = {
	en: "289f49ff-4d48-80dd-8c72-000be39c3997",
	fr: "289f49ff-4d48-803e-b41d-000b45ad4cb7",
};

const notionClient = new Client({ auth: process.env.NOTION_API_KEY });

export const fetchLegalDocuments = action({
	args: {
		locale,
	},
	handler: async (_, { locale }) => {
		const dataSourceId = dataSourceIds[locale];

		const { data: pages, error } = await tryCatch(
			notionClient.dataSources.query({ data_source_id: dataSourceId }),
		);

		if (error) {
			throw new ChatSDKError("bad_request:api");
		}

		if (!pages || !pages.results) {
			throw new ChatSDKError("not_found:document");
		}

		const legalDocuments: LegalDocument[] = [];

		const n2m = new NotionConverter(notionClient);

		for (const { id: pageId, object: pageObject } of pages.results) {
			if (pageObject === "page") {
				const { content } = await n2m.convert(pageId);

				legalDocuments.push({
					content,
					id: pageId,
				});
			}
		}

		return legalDocuments;
	},
	returns: v.union(
		v.null(),
		v.array(
			v.object({
				content: v.string(),
				id: v.string(),
			}),
		),
	),
});
