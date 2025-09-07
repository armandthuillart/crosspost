"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

export function ChatHeader() {
	return (
		<header className="inset-0 bottom-auto z-50 flex items-center justify-between p-2 group-data-[messages=false]/chat:absolute group-data-[messages=true]/chat:sticky @max-8xl/chat:group-data-[messages=true]/chat:bg-background">
			<SidebarTrigger />
		</header>
	);
}
