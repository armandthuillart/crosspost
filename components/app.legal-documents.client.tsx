"use client";

import { useAtom } from "jotai";
import { useTranslations } from "next-intl";
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
import { showPoliciesAtom } from "~/lib/atoms";
import type { LegalDocument } from "~/lib/types";
import { cn } from "~/lib/utils";

const snapPoints = [0.5, 1];

interface AppLegalDocumentsClientProps {
	legalDocuments: LegalDocument[];
}

export function AppLegalDocumentsClient({
	legalDocuments,
}: AppLegalDocumentsClientProps) {
	const t = useTranslations("AppLegalDocuments");

	const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
	const [isOpen, setIsOpen] = useAtom(showPoliciesAtom);
	const [viewer, setViewer] = useState<string | null>(null);
	const [currentIndex, setCurrentIndex] = useState(0);

	const hasViewer = !!viewer;
	const hasNext = hasViewer && currentIndex < legalDocuments.length - 1;
	const hasPrevious = hasViewer && currentIndex > 0;

	const handleNext = () => {
		if (hasNext) {
			const nextIndex = currentIndex + 1;
			setCurrentIndex(nextIndex);
			setViewer(legalDocuments[nextIndex].id);
		}
	};

	const handlePrevious = () => {
		if (hasPrevious) {
			const prevIndex = currentIndex - 1;
			setCurrentIndex(prevIndex);
			setViewer(legalDocuments[prevIndex].id);
		}
	};

	const handleViewDocument = (id: string) => {
		const index = legalDocuments.findIndex((doc) => doc.id === id);
		setCurrentIndex(index);
		setViewer(id);
	};

	return (
		<Drawer
			fadeFromIndex={0}
			onOpenChange={setIsOpen}
			open={isOpen}
			setActiveSnapPoint={setSnap}
			snapPoints={snapPoints}
		>
			<DrawerContent className="-mx-px fixed inset-0 top-auto flex h-full flex-col bg-background *:first:mb-5 data-[vaul-drawer-direction=bottom]:max-h-9/10 data-[vaul-drawer-direction=bottom]:rounded-t-3xl">
				<div className="overflow-y-auto">
					<div
						className={cn(
							"mx-auto flex w-full max-w-(--chat-content-max-width) flex-col gap-6 p-4 pt-0 [--chat-content-max-width:var(--container-lg)]",
							{
								"[--chat-content-max-width:var(--container-3xl)]": hasViewer,
								"overflow-hidden": snap !== 1,
								"overflow-y-auto": snap === 1,
							},
						)}
					>
						<DrawerHeader className="sticky top-0 z-10 bg-background">
							<VisuallyHidden>
								<DrawerDescription>{t("description")}</DrawerDescription>
							</VisuallyHidden>

							<DrawerTitle className="text-xl">
								{hasViewer ? legalDocuments[currentIndex]?.title : t("title")}
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
							legalDocuments.map(({ id, title, description }) => (
								<div className="flex flex-col gap-5" key={id}>
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
													<ArrowUpRightIcon className="size-5" />
												</Button>
											</CardAction>
										</CardHeader>
									</Card>
								</div>
							))
						) : (
							<div className="flex-1 pb-5">
								{legalDocuments[currentIndex]?.body}
							</div>
						)}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
