"use client";

import {
	BlueskyIcon,
	LinkedInIcon,
	ThreadsIcon,
	XIcon,
} from "~/components/ui/icons";
import { TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Platform } from "~/lib/types";

export function DraftVersions({ platforms }: { platforms: Platform[] }) {
	return (
		<TabsList className="-translate-x-1/2 absolute start-1/2 top-3 z-3 rounded-full bg-transparent p-1">
			{platforms.map((platform) => (
				<TabsTrigger
					className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
					key={platform}
					value={platform}
				>
					{platform === "x" && <XIcon className="size-5" />}
					{platform === "threads" && <ThreadsIcon className="size-5" />}
					{platform === "bluesky" && <BlueskyIcon className="size-5" />}
					{platform === "linkedin" && <LinkedInIcon className="size-5" />}
				</TabsTrigger>
			))}
		</TabsList>
	);
}
