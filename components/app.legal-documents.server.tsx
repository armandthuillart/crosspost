import { getLocale } from "next-intl/server";
import { AppLegalDocumentsClient } from "~/components/app.legal-documents.client";
import { source } from "~/lib/source";
import type { LegalDocument } from "~/lib/types";
import { getMDXComponents } from "~/mdx-components";

export async function AppLegalDocuments() {
	const locale = await getLocale();

	const pages: LegalDocument[] = source.getPages(locale).map((page) => {
		const MDX = page.data.body;

		return {
			body: <MDX components={getMDXComponents()} key={page.slugs[0]} />,
			description: page.data.description,
			id: page.slugs[0],
			title: page.data.title,
		};
	});

	return <AppLegalDocumentsClient pages={pages} />;
}
