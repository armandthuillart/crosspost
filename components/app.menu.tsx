"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
	AssistantsIcon,
	KeyboardKeyIcon,
	LifeBuoyIcon,
	LogOutIcon,
	MoreIcon,
	SignatureIcon,
} from "~/components/ui/icons";
import { SidebarMenuButton } from "~/components/ui/sidebar";
import { authClient } from "~/lib/auth-client";
import type { User } from "~/lib/types";

interface AppMenuProps {
	user: User | null;
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
				<SidebarMenuButton className="h-auto justify-between rounded-full pr-4">
					<div className="flex items-center gap-2.5 overflow-hidden">
						<Avatar>
							<AvatarFallback>
								{user?.firstName && user?.lastName
									? user.firstName.charAt(0) + user.lastName.charAt(0)
									: (user?.email?.charAt(0) ?? "?")}
							</AvatarFallback>
						</Avatar>
						<span className="truncate font-medium text-sm">
							{user?.firstName} {user?.lastName}
						</span>
					</div>
					<MoreIcon className="size-6" />
				</SidebarMenuButton>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-64" side="top">
				<DropdownMenuItem disabled>
					<AssistantsIcon className="size-4" />
					Customize
					<Badge className="ml-auto rounded-full" variant="selection">
						Soon
					</Badge>
				</DropdownMenuItem>

				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<LifeBuoyIcon className="size-4" />
						Help
					</DropdownMenuSubTrigger>

					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<SignatureIcon className="size-4" />
							Terms & policies
						</DropdownMenuItem>

						<DropdownMenuItem className="w-full">
							<KeyboardKeyIcon className="size-4" />
							Keyboard shortcuts
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>

				<DropdownMenuItem onClick={handleSignOut}>
					<LogOutIcon className="size-4" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
