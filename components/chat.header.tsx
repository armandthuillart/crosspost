"use client";

import { useTranslations } from "next-intl";
import { CTA } from "~/components/chat.header.upgrade-cta";
import { Button } from "~/components/ui/button";
import { AppIcon } from "~/components/ui/icons";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { useRouter } from "~/i18n/navigation";
import { authClient } from "~/lib/auth-client";

interface ChatHeaderProps {
	isChat: boolean;
	isFree: boolean;
	isAnonymous: boolean;
}

export function ChatHeader({ isChat, isFree, isAnonymous }: ChatHeaderProps) {
	const router = useRouter();
	const t = useTranslations("ChatHeader");

	async function handleSignInWithGoogle() {
		await authClient.signIn.social({
			provider: "google",
		});
	}

	if (isAnonymous) {
		return (
			<header className="absolute @max-8xl/chat:sticky inset-0 bottom-auto z-50 flex w-full items-center justify-between p-2 group-not-data-chat/chat:justify-end @max-8xl/chat:group-data-chat/chat:bg-background">
				<Button
					className="group/trigger group-not-data-chat/chat:hidden"
					onClick={() => router.push("/")}
					size="icon"
					variant="ghost"
				>
					<AppIcon className="size-6" />
				</Button>

				<div className="flex items-center gap-2">
					<Button
						className="rounded-full"
						onClick={handleSignInWithGoogle}
						variant="secondary"
					>
						{t("signIn")}
					</Button>

					<Button className="rounded-full" onClick={handleSignInWithGoogle}>
						{t("signUp")}
					</Button>
				</div>
			</header>
		);
	}

	return (
		<header className="absolute inset-0 bottom-auto z-50 flex items-center justify-between p-2 @max-8xl/chat:group-data-chat/chat:bg-background">
			<SidebarTrigger />
			{!isChat && isFree && <CTA />}
		</header>
	);
}
