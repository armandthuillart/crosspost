"use client";

import { atom, useAtom } from "jotai";
import { type Locale, useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type ReactNode, useEffect, useState, useTransition } from "react";
import { themeColors } from "~/app/theme-provider";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import {
	AppearanceIcon,
	LanguageIcon,
	PaintBrushIcon,
} from "~/components/ui/icons";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";
import { SHORTCUTS, useShortcut } from "~/hooks/use-shortcuts";
import { usePathname, useRouter } from "~/i18n/navigation";
import { routing } from "~/i18n/routing";
import { themeColorAtom } from "~/lib/atoms";
import type { ThemeColor } from "~/lib/types";
import { cn } from "~/lib/utils";

export const snapPoints = ["500px", 0.8];
export const snapPointsAtom = atom<number | string | null>(snapPoints[0]);

export function AppSettings({ children }: { children: ReactNode }) {
	const [snap, setSnap] = useAtom(snapPointsAtom);
	const [isOpen, setIsOpen] = useState(false);
	const [themeColor, setThemeColor] = useAtom(themeColorAtom);
	const [isPending, startTransition] = useTransition();

	const t = useTranslations("AppSettings");
	const pathname = usePathname();
	const locale = useLocale();
	const router = useRouter();

	function handleLocaleChange(locale: Locale) {
		startTransition(() => {
			router.replace(pathname, { locale });
		});
	}

	const { theme, themes, setTheme } = useTheme();

	useEffect(() => {
		document.documentElement.setAttribute("data-theme", themeColor);
	}, [themeColor]);

	useShortcut(SHORTCUTS.OPEN_SETTINGS, () => {
		if (!isOpen) {
			setIsOpen(true);
			setSnap(snapPoints[0]);
		} else if (snap === snapPoints[0]) {
			setSnap(snapPoints[1]);
		} else {
			setIsOpen(false);
		}
	});

	return (
		<Drawer
			activeSnapPoint={snap}
			fadeFromIndex={0}
			onOpenChange={setIsOpen}
			open={isOpen}
			setActiveSnapPoint={setSnap}
			snapPoints={snapPoints}
			snapToSequentialPoint
		>
			{children}
			<DrawerContent className="-mx-px fixed inset-0 top-auto flex h-full flex-col bg-background data-[vaul-drawer-direction=bottom]:max-h-9/10 data-[vaul-drawer-direction=bottom]:rounded-t-3xl">
				<div
					className={cn("mx-auto flex w-full max-w-lg flex-col p-4 pt-5", {
						"overflow-hidden": snap !== 1,
						"overflow-y-auto": snap === 1,
					})}
				>
					<DrawerHeader>
						<DrawerTitle className="text-xl">{t("title")}</DrawerTitle>
					</DrawerHeader>

					<SettingsCategory title={t("app")}>
						<SettingsGroup>
							<SettingsGroupItem
								icon={<LanguageIcon className="size-5" />}
								title={t("appLanguage")}
							>
								<Select
									defaultValue={locale}
									onValueChange={handleLocaleChange}
									value={locale}
								>
									<SelectTrigger
										className="w-fit bg-background"
										disabled={isPending}
									>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{routing.locales.map((locale) => (
											<SelectItem key={locale} value={locale}>
												{locale === "en" && "English"}
												{locale === "fr" && "Français"}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</SettingsGroupItem>

							<Separator />

							<SettingsGroupItem
								icon={<AppearanceIcon className="size-5" />}
								title={t("appearance")}
							>
								<Select
									defaultValue={theme}
									onValueChange={setTheme}
									value={theme}
								>
									<SelectTrigger className="w-fit bg-background">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{themes.map((theme) => (
											<SelectItem key={theme} value={theme}>
												{theme === "system" && t("system")}
												{theme === "light" && t("light")}
												{theme === "dark" && t("dark")}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</SettingsGroupItem>

							<Separator />

							<SettingsGroupItem
								icon={<PaintBrushIcon className="size-5" />}
								title={t("themeColor")}
							>
								<Select
									defaultValue={themeColor}
									onValueChange={(value) => setThemeColor(value as ThemeColor)}
									value={themeColor}
								>
									<SelectTrigger className="w-fit bg-background">
										<SelectValue />
									</SelectTrigger>

									<SelectContent alignOffset={-5}>
										{themeColors.map((themeColor) => (
											<SelectItem key={themeColor} value={themeColor}>
												<span className="flex items-center gap-2">
													<span
														className={cn(
															"size-2.5 rounded-full",
															themeColor === "default"
																? "bg-muted dark:bg-accent"
																: "bg-primary",
														)}
														data-theme={themeColor}
													/>
													{t(themeColor)}
												</span>
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</SettingsGroupItem>
						</SettingsGroup>
					</SettingsCategory>
				</div>
			</DrawerContent>
		</Drawer>
	);
}

function SettingsCategory({
	title,
	children,
}: {
	title: string;
	children: ReactNode;
}) {
	return (
		<div className="flex flex-col gap-2">
			<p className="pl-4 text-muted-foreground text-sm">{title}</p>
			{children}
		</div>
	);
}

function SettingsGroup({ children }: { children: ReactNode }) {
	return <ul className="rounded-xl bg-muted pr-2.5 pl-4">{children}</ul>;
}

function SettingsGroupItem({
	icon,
	title,
	children,
}: {
	icon: ReactNode;
	title: string;
	children: ReactNode;
}) {
	return (
		<li className="flex items-center justify-between py-2.5">
			<div className="flex items-center gap-2.5">
				{icon}
				{title}
			</div>
			{children}
		</li>
	);
}
