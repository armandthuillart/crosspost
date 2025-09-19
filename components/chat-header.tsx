"use client";

import { useRouter } from "next/navigation";
import { AppMenu } from "@/components/app-menu";
import { CTA } from "@/components/chat-header.upgrade";
import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import type { User } from "@/lib/types";

interface ChatHeaderProps {
	user: User;
	isFree: boolean;
	isChat: boolean;
	threadId: string;
	isAnonymous: boolean;
}

export function ChatHeader({
	user,
	isChat,
	isFree,
	threadId,
	isAnonymous,
}: ChatHeaderProps) {
	const router = useRouter();

	async function handleSignInWithGoogle() {
		await authClient.signIn.social({
			callbackURL: `/api/auth/proxy/oauth?${isChat ? new URLSearchParams({ threadId }) : ""}`,
			provider: "google",
		});
	}

	if (isAnonymous) {
		return (
			<header className="absolute @max-8xl/chat:sticky inset-0 bottom-auto z-50 flex w-full items-center justify-between p-2 @max-8xl/chat:group-data-chat/chat:bg-background">
				<Button
					className="group/trigger"
					onClick={() => router.push("/")}
					size="icon"
					variant="ghost"
				>
					<AppIcon className="size-6 text-primary" />
				</Button>

				{isFree && <CTA />}

				<div className="flex items-center gap-2">
					<Button
						className="rounded-full"
						onClick={handleSignInWithGoogle}
						variant="outline"
					>
						Sign in
					</Button>
					<Button className="rounded-full" onClick={handleSignInWithGoogle}>
						Sign up for free
					</Button>
				</div>
			</header>
		);
	}

	return (
		<header className="inset-0 bottom-auto z-50 flex items-center justify-between p-2 group-not-data-chat/chat:absolute group-data-chat/chat:sticky @max-8xl/chat:group-data-chat/chat:bg-background">
			<SidebarTrigger />
			<AppMenu user={user} />
		</header>
	);
}
