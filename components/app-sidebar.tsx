"use client";

import { usePathname, useRouter } from "next/navigation";
import { AppShader } from "@/components/app-shader";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icons";
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
				<Button className="shrink-0 opacity-0" size="icon" variant="ghost" />
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
									<div className="flex size-5 shrink-0 items-center justify-center">
										<AppShader
											darkColor="rgb(255, 255, 255)"
											lightColor="rgb(10, 10, 10)"
											pxSize={1 / 3}
											size={20}
											speed={0}
										/>
									</div>
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
		<div className="flex items-center gap-2 pl-2.5 text-muted-foreground">
			<div className="flex size-5 shrink-0 items-center justify-center">
				<SearchIcon className="size-4 shrink-0" />
			</div>

			<input
				className="w-full text-foreground text-sm outline-none placeholder:text-muted-foreground"
				placeholder="Search"
			/>
		</div>
	);
}
