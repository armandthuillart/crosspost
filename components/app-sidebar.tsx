"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppIcon, SearchIcon } from "@/components/ui/icons";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<Sidebar>
			<SidebarHeader>
				<AppSearch />
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									isActive={pathname === "/"}
									onClick={() => router.push("/")}
								>
									<AppIcon className="size-5" />
									Fragment
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

function AppSearch() {
	return (
		<div className="flex w-full items-center gap-2 pl-2.5 text-muted-foreground">
			<div className="my-2 flex size-5 shrink-0 items-center justify-center">
				<SearchIcon className="size-4 shrink-0" />
			</div>

			<input
				className="w-full text-foreground text-sm outline-none placeholder:text-muted-foreground"
				placeholder="Search"
			/>
		</div>
	);
}
