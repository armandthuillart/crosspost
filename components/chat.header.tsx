"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { AppIcon, SparkleIcon, StarIcon } from "~/components/ui/icons";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { authClient } from "~/lib/auth-client";

interface ChatHeaderProps {
	isFree: boolean;
	isAnonymous: boolean;
}

export function ChatHeader({ isFree, isAnonymous }: ChatHeaderProps) {
	const { push } = useRouter();

	async function handleSignInWithGoogle() {
		await authClient.signIn.social({ provider: "google" });
	}

	if (isAnonymous) {
		return (
			<header className="absolute @max-8xl/chat:sticky inset-0 bottom-auto z-50 flex w-full items-center justify-between p-2 group-not-data-chat/chat:justify-end @max-8xl/chat:group-data-chat/chat:bg-background">
				<Button
					className="group/trigger group-not-data-chat/chat:hidden"
					onClick={() => push("/")}
					size="icon"
					variant="ghost"
				>
					<AppIcon className="size-6" />
				</Button>

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

			{isFree && (
				<div className="-translate-x-1/2 absolute start-1/2">
					<Button className="gap-1.5 rounded-full px-3" variant="selection">
						<StarIcon className="size-3.5" />
						Upgrade
					</Button>
				</div>
			)}
		</header>
	);
}
