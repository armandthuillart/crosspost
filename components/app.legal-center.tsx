"use client";

import { useAction } from "convex/react";
import { useAtom } from "jotai";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Streamdown } from "streamdown";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import { ScrollArea } from "~/components/ui/scroll-area";
import { showPoliciesAtom } from "~/lib/atoms";
import type { LegalDocument } from "~/lib/types";
import { cn } from "~/lib/utils";
import { api } from "../convex/_generated/api";

export function AppLegalCenter() {
	const locale = useLocale();
	const fetchLegalDocuments = useAction(api.notion.fetchLegalDocuments);

	const [isOpen, setIsOpen] = useAtom(showPoliciesAtom);
	const [documents, setDocuments] = useState<LegalDocument[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [hasFetched, setHasFetched] = useState(false);
	const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

	useEffect(() => {
		if (isOpen && !hasFetched) {
			async function fetchDocs() {
				try {
					setIsLoading(true);
					const docs = await fetchLegalDocuments({ locale });
					setDocuments(docs || []);
					if (docs && docs.length > 0) {
						setSelectedDoc(docs[0].id);
					}
					setHasFetched(true);
				} catch (error) {
					console.error("Failed to fetch legal documents:", error);
				} finally {
					setIsLoading(false);
				}
			}
			fetchDocs();
		}
	}, [isOpen, hasFetched, fetchLegalDocuments, locale]);

	const selectedDocument =
		documents.find((doc) => doc.id === selectedDoc) || documents[0];

	return (
		<Drawer
			fadeFromIndex={0}
			onOpenChange={setIsOpen}
			open={isOpen}
			snapPoints={[0.5, 1]}
		>
			<DrawerContent className="-mx-px fixed inset-0 top-auto flex h-full flex-col bg-background data-[vaul-drawer-direction=bottom]:max-h-9/10 data-[vaul-drawer-direction=bottom]:rounded-t-3xl">
				<div className="mx-auto flex w-full max-w-lg flex-col p-4 pt-5">
					<DrawerHeader>
						<DrawerTitle className="text-xl">Legal Documents</DrawerTitle>
					</DrawerHeader>

					{isLoading ? (
						<div className="flex items-center justify-center p-8">
							<div className="text-muted-foreground">Loading...</div>
						</div>
					) : documents.length === 0 ? (
						<div className="flex items-center justify-center p-8">
							<div className="text-muted-foreground">No documents found.</div>
						</div>
					) : (
						<div className="flex h-[calc(100vh-8rem)]">
							{/* Document List Sidebar */}
							<div className="w-80 border-r">
								<div className="p-6">
									<h2 className="font-medium text-lg">Documents</h2>
								</div>

								<ScrollArea className="h-[calc(100vh-12rem)]">
									<div className="space-y-1 p-4">
										{documents.map((doc) => (
											<button
												className={cn(
													"w-full rounded-lg p-3 text-left transition-colors hover:bg-muted",
													selectedDoc === doc.id ||
														(!selectedDoc && doc.id === documents[0].id)
														? "bg-muted"
														: "",
												)}
												key={doc.id}
												onClick={() => setSelectedDoc(doc.id)}
												type="button"
											>
												<div className="font-medium text-sm">
													Document {doc.id.slice(-8)}
												</div>
											</button>
										))}
									</div>
								</ScrollArea>
							</div>

							{/* Document Content */}
							<div className="flex-1">
								<ScrollArea className="h-full">
									<div className="p-6">
										<DocumentViewer document={selectedDocument} />
									</div>
								</ScrollArea>
							</div>
						</div>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function DocumentViewer({ document }: { document: LegalDocument }) {
	return (
		<div className="max-w-4xl">
			<div className="mb-8">
				<h1 className="font-semibold text-2xl">
					Document {document.id.slice(-8)}
				</h1>
			</div>
			<div className="prose prose-sm dark:prose-invert max-w-none">
				<Streamdown>{document.content}</Streamdown>
			</div>
		</div>
	);
}
