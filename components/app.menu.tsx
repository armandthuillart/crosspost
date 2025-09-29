"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	KeyIcon,
	LegalDocumentIcon,
	LifeBuoyIcon,
	LogOutIcon,
	SettingsIcon,
} from "~/components/ui/icons";
import { authClient } from "~/lib/auth-client";
import type { User } from "~/lib/types";

interface AppMenuProps {
	user: User;
}

export function AppMenu({ user }: AppMenuProps) {
	const { push } = useRouter();

	async function handleSignOut() {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: async () => {
					push("/");
				},
			},
		});
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="rounded-full shadow-none hover:bg-accent"
					size="icon"
					variant="ghost"
				>
					<Avatar className="size-6">
						<AvatarFallback className="border-primary bg-primary text-primary-foreground text-xs uppercase">
							{user.name.charAt(0) || user.email.charAt(0)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				alignOffset={-2}
				className="w-80"
				side="top"
			>
				<DropdownMenuItem>
					<SettingsIcon className="size-5" />
					Settings
				</DropdownMenuItem>

				<DropdownMenuSeparator />

				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<LifeBuoyIcon className="size-5" />
						Help
					</DropdownMenuSubTrigger>

					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<LegalDocumentIcon className="size-5" />
							Terms & policies
						</DropdownMenuItem>
						<DropdownMenuItem>
							<KeyIcon className="size-5" />
							Keyboard shortcuts
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuItem onClick={handleSignOut}>
					<LogOutIcon className="size-5" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
