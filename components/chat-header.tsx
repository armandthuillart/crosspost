"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export function ChatHeader({ isAnonymous }: { isAnonymous: boolean }) {
	if (isAnonymous) {
		return (
			<header className="inset-0 bottom-auto z-50 flex w-full items-center justify-end p-2 group-data-[messages=false]/chat:absolute group-data-[messages=true]/chat:sticky @max-8xl/chat:group-data-[messages=true]/chat:bg-background">
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
		<header className="inset-0 bottom-auto z-50 flex items-center justify-between p-2 group-data-[messages=false]/chat:absolute group-data-[messages=true]/chat:sticky @max-8xl/chat:group-data-[messages=true]/chat:bg-background">
			<SidebarTrigger />
		</header>
	);
}
