"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AppIcon, EditIcon } from "@/components/ui/icons";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { authClient } from "@/lib/auth-client";

interface ChatHeaderProps {
	isAnonymous: boolean;
}

export function ChatHeader({ isAnonymous }: ChatHeaderProps) {
	const router = useRouter();

	async function handleSignIn() {
		await authClient.signIn.social({ provider: "google" });
	}

	if (isAnonymous) {
		return (
			<header className="inset-0 bottom-auto z-50 flex w-full items-center justify-between p-2 group-not-data-chat/chat:absolute group-data-chat/chat:sticky @max-8xl/chat:group-data-chat/chat:bg-background">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="group/trigger"
								onClick={() => router.push("/")}
								size="icon"
								variant="ghost"
							>
								<AppIcon className="size-6 text-primary group-hover/trigger:hidden" />
								<EditIcon className="hidden size-4.25 group-hover/trigger:block" />
							</Button>
						</TooltipTrigger>
						<TooltipContent side="right">New chat</TooltipContent>
					</Tooltip>
				</TooltipProvider>

				<div className="flex items-center gap-2">
					<Button
						className="rounded-full"
						onClick={handleSignIn}
						variant="outline"
					>
						Sign in
					</Button>
					<Button className="rounded-full" onClick={handleSignIn}>
						Sign up for free
					</Button>
				</div>
			</header>
		);
	}

	return (
		<header className="inset-0 bottom-auto z-50 flex items-center justify-between p-2 group-not-data-chat/chat:absolute group-data-chat/chat:sticky @max-8xl/chat:group-data-chat/chat:bg-background">
			<SidebarTrigger />
		</header>
	);
}
