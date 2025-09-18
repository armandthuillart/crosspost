import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	KeyIcon,
	LegalDocumentIcon,
	LifeBuoyIcon,
	LogOutIcon,
} from "@/components/ui/icons";

export function AppMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="rounded-full shadow-none hover:bg-accent"
					size="icon"
					variant="ghost"
				>
					<Avatar className="size-6"></Avatar>
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				alignOffset={-2}
				className="w-80"
				side="top"
			>
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

				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<LogOutIcon className="size-5" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
