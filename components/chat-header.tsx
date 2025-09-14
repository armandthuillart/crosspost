"use client";

import { Button } from "@/components/ui/button";
import { AppIcon } from "@/components/ui/icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

interface ChatHeaderProps {
	isAnonymous: boolean;
}

export function ChatHeader({ isAnonymous }: ChatHeaderProps) {
	if (isAnonymous) {
		return (
			<header className="inset-0 bottom-auto z-50 flex w-full items-center justify-between p-2 group-not-data-messages/chat:absolute group-data-messages/chat:sticky @max-8xl/chat:group-data-messages/chat:bg-background">
				<Button size="icon" variant="ghost">
					<AppIcon className="size-6 text-primary" />
				</Button>

				<div className="flex items-center gap-2">
					<Button
						className="rounded-full"
						onClick={async () =>
							await authClient.signIn.social({ provider: "google" })
						}
						variant="outline"
					>
						Sign in
					</Button>
					<Button
						className="rounded-full"
						onClick={async () =>
							await authClient.signIn.social({ provider: "google" })
						}
					>
						Sign up for free
					</Button>
				</div>
			</header>
		);
	}

	return (
		<header className="inset-0 bottom-auto z-50 flex items-center justify-between p-2 group-not-data-messages/chat:absolute group-data-messages/chat:sticky @max-8xl/chat:group-data-messages/chat:bg-background">
			<SidebarTrigger />
		</header>
	);
}
