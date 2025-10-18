"use client";

import { useTranslations } from "next-intl";
import { parseAsBoolean, useQueryState } from "nuqs";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	ArrowUpRightIcon,
	CloseIcon,
} from "~/components/ui/icons";
import { VisuallyHidden } from "~/components/ui/visually-hidden";
import type { LegalDocument } from "~/lib/types";
import { cn } from "~/lib/utils";

const snapPoints = [0.5, 1];

export function AppLegalDocumentsClient({ pages }: { pages: LegalDocument[] }) {
	const t = useTranslations("AppLegalDocuments");

	const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
	const [index, setIndex] = useState(0);
	const [viewer, setViewer] = useState<string | null>(null);

	const hasViewer = !!viewer;
	const hasNext = hasViewer && index < pages.length - 1;
	const hasPrevious = hasViewer && index > 0;

	const handleNext = () => {
		if (hasNext) {
			const nextIndex = index + 1;
			setIndex(nextIndex);
			setViewer(pages[nextIndex].id);
		}
	};

	const handlePrevious = () => {
		if (hasPrevious) {
			const prevIndex = index - 1;
			setIndex(prevIndex);
			setViewer(pages[prevIndex].id);
		}
	};

	const handleViewDocument = (id: string) => {
		const index = pages.findIndex((doc) => doc.id === id);
		setIndex(index);
		setViewer(id);
	};

	const [isOpen, setIsOpen] = useQueryState(
		"policies",
		parseAsBoolean.withDefault(false),
	);

	return (
		<Drawer
			fadeFromIndex={0}
			onOpenChange={setIsOpen}
			open={isOpen}
			setActiveSnapPoint={setSnap}
			snapPoints={snapPoints}
		>
			<DrawerContent className="-mx-px fixed inset-0 top-auto flex h-full flex-col bg-background *:first:mb-5 data-[vaul-drawer-direction=bottom]:max-h-9/10 data-[vaul-drawer-direction=bottom]:rounded-t-3xl">
				<div
					className={cn("relative flex w-full flex-col gap-4 p-4 pt-0", {
						"[--chat-content-max-width:var(--container-3xl)]": hasViewer,
						"[--chat-content-max-width:var(--container-lg)]": !hasViewer,
						"overflow-hidden": snap !== 1,
						"overflow-y-auto": snap === 1,
					})}
				>
					<DrawerHeader className="sticky top-0 z-10 mx-auto w-full max-w-(--chat-content-max-width) bg-background">
						<VisuallyHidden>
							<DrawerDescription>{t("description")}</DrawerDescription>
						</VisuallyHidden>

						<DrawerTitle className="text-xl">
							{hasViewer ? pages[index]?.title : t("title")}
						</DrawerTitle>

						{hasViewer && (
							<>
								{hasPrevious ? (
									<Button
										className="absolute top-3 left-0 flex gap-2 rounded-full"
										onClick={handlePrevious}
										size="icon"
										variant="secondary"
									>
										<ArrowLeftIcon className="size-4" />
									</Button>
								) : (
									<Button
										className="absolute top-3 left-0 flex gap-2 rounded-full"
										onClick={() => setViewer(null)}
										size="icon"
										variant="ghost"
									>
										<CloseIcon className="size-4" />
									</Button>
								)}

								{hasNext ? (
									<Button
										className="absolute top-3 right-0 flex gap-2 rounded-full"
										onClick={handleNext}
										size="icon"
										variant="secondary"
									>
										<ArrowRightIcon className="size-4" />
									</Button>
								) : (
									<Button
										className="absolute top-3 right-0 flex gap-2 rounded-full"
										onClick={() => setViewer(null)}
										size="icon"
										variant="ghost"
									>
										<CloseIcon className="size-4" />
									</Button>
								)}
							</>
						)}
					</DrawerHeader>

					{!hasViewer ? (
						<div className="mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-5">
							{pages.map(({ id, title, description }) => (
								<div key={id}>
									<Card className="min-h-25 rounded-2xl border-none bg-muted py-4 shadow-none">
										<CardHeader className="sticky top-0 gap-x-4 gap-y-0 pr-4">
											<CardTitle className="leading-normal">{title}</CardTitle>
											<CardDescription>{description}</CardDescription>

											<CardAction>
												<Button
													className="rounded-full bg-background text-foreground hover:bg-background"
													onClick={() => handleViewDocument(id)}
													size="icon"
												>
													<ArrowUpRightIcon
														className="size-5"
														strokeWidth={2}
													/>
												</Button>
											</CardAction>
										</CardHeader>
									</Card>
								</div>
							))}
						</div>
					) : (
						<div className="mx-auto w-full max-w-(--chat-content-max-width) pb-6">
							{pages[index]?.body}
						</div>
					)}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
