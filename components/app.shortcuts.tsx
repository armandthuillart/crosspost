"use client";

import { useAtom } from "jotai";
import { PrinterIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { Button } from "~/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import { Kbd } from "~/components/ui/kbd";
import { SHORTCUTS, useShortcut } from "~/hooks/use-shortcuts";
import { showShortcutsAtom } from "~/lib/atoms";

export function AppShortcuts() {
	const t = useTranslations("AppShortcuts");
	const [isOpen, setIsOpen] = useAtom(showShortcutsAtom);

	useShortcut(SHORTCUTS.SEE_SHORTCUTS, () => setIsOpen((isOpen) => !isOpen));

	return (
		<Drawer
			direction="left"
			onOpenChange={(isOpen) => setIsOpen(isOpen)}
			open={isOpen}
		>
			<DrawerContent
				className="data-[vaul-drawer-direction=left]:after:!bg-transparent gap-0 rounded-2xl before:bg-transparent data-[vaul-drawer-direction=left]:top-2 data-[vaul-drawer-direction=left]:bottom-2 data-[vaul-drawer-direction=left]:left-2 sm:max-w-xs"
				style={{ "--initial-transform": "calc(100% + 8px)" } as CSSProperties}
			>
				<DrawerHeader className="p-6 pb-4">
					<DrawerTitle>{t("title")}</DrawerTitle>
					<DrawerDescription>{t("description")}</DrawerDescription>
				</DrawerHeader>

				<ul className="flex flex-col px-6">
					{Object.entries(SHORTCUTS).map(
						([key, { key: keyboardKey, label, shift, modifier }]) => {
							const isMac = /Mac|iPod|iPhone|iPad|Apple/.test(
								navigator.userAgent,
							);

							return (
								<li
									className="flex items-center justify-between py-2"
									key={key}
								>
									<span className="text-sm">{label}</span>
									<div className="flex gap-2">
										{modifier && (
											<Kbd className="size-8 uppercase">
												{isMac ? "⌘" : "Ctrl"}
											</Kbd>
										)}
										{shift && <Kbd className="h-8 px-3 uppercase">Shift</Kbd>}
										<Kbd className="size-8 uppercase">{keyboardKey}</Kbd>
									</div>
								</li>
							);
						},
					)}
				</ul>

				<DrawerFooter className="p-5">
					<Button
						data-print="hidden"
						onClick={() => window.print()}
						variant="outline"
					>
						<PrinterIcon className="-ms-1 size-4 opacity-60" />
						Print
						<Kbd>⌘P</Kbd>
					</Button>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
