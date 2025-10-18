"use client";

import { useQuery } from "convex/react";
import {
	type ComponentProps,
	type ComponentType,
	type ReactNode,
	useState,
} from "react";
import { DraftEditor } from "~/components/draft.editor";
import { Bluesky } from "~/components/draft.layout.bluesky";
import { LinkedIn } from "~/components/draft.layout.linkedin";
import { Threads } from "~/components/draft.layout.threads";
import { X } from "~/components/draft.layout.x";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ShareIcon } from "~/components/ui/icons";
import { ShiningText } from "~/components/ui/shining-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Platform } from "~/lib/types";
import { cn, getURL } from "~/lib/utils";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";

interface Options {
	maxLength: number;
	components: {
		layout: ComponentType<{
			children: ReactNode;
		}>;
		post: {
			component: ComponentType<{
				children: ReactNode;
			}>;
			props:
				| ComponentProps<typeof Bluesky.Tweet>
				| ComponentProps<typeof Threads.Post>
				| ComponentProps<typeof X.Post>;
		};
	};
}

const PLATFORM_CONFIG: Record<Platform, Options> = {
	bluesky: {
		components: {
			layout: Bluesky,
			post: { component: Bluesky.Tweet, props: {} },
		},
		maxLength: 300,
	},
	linkedin: {
		components: {
			layout: LinkedIn,
			post: { component: LinkedIn.Post, props: {} },
		},
		maxLength: 3000,
	},
	threads: {
		components: {
			layout: Threads,
			post: { component: Threads.Post, props: {} },
		},
		maxLength: 10000,
	},
	x: {
		components: {
			layout: X,
			post: { component: X.Post, props: {} },
		},
		maxLength: 280,
	},
};

function renderUI(
	content: string,
	platform: Platform,
	children: (content: string) => ReactNode,
) {
	const config = PLATFORM_CONFIG[platform];

	const {
		components: {
			layout: Layout,
			post: { component: Post, props },
		},
	} = config;

	return (
		<Layout>
			<Post {...props}>{children(content)}</Post>
		</Layout>
	);
}

function renderIcon(platform: Platform, className: string) {
	if (platform === "x") return <X.Icon className={className} />;
	if (platform === "bluesky") return <Bluesky.Icon className={className} />;
	if (platform === "threads") return <Threads.Icon className={className} />;
	if (platform === "linkedin") return <LinkedIn.Icon className={className} />;
}

function getLabel(platform: Platform) {
	if (platform === "x") return "X";
	if (platform === "bluesky") return "Bluesky";
	if (platform === "threads") return "Threads";
	if (platform === "linkedin") return "LinkedIn";
}

interface DraftProps {
	draftId: Id<"drafts">;
}

export function Draft({ draftId }: DraftProps) {
	const draft = useQuery(api.drafts.getDraft, { draftId });

	const platforms = draft
		? (Object.keys(draft.versions) as Platform[]).sort(
				(a, b) => a.length - b.length,
			)
		: [];

	const [platform, setPlatform] = useState<Platform>(platforms[0]);

	if (!draft) {
		return <ShiningText text="Loading draft..." />;
	}

	function handlePost() {
		if (!draft) return;

		const content = draft.versions[platform];

		if (!content) return;

		const url = getURL(platform, content);
		window.open(url, "_blank", "noopener,noreferrer");
	}

	return (
		<Tabs
			className="relative not-first:mt-4 mb-4 w-full gap-0 overflow-hidden rounded-4xl bg-muted"
			defaultValue={platforms[0]}
			onValueChange={(value) => setPlatform(value as Platform)}
			value={platform}
		>
			<div className="flex items-center justify-between p-2">
				<TabsList className="p-0">
					{platforms.map((platform) => (
						<TabsTrigger
							className="group/tabs-trigger h-8 rounded-full border-0 px-3 data-[state=inactive]:text-muted-foreground data-[state=active]:shadow-none"
							key={platform}
							value={platform}
						>
							{renderIcon(
								platform,
								"group-data-[state=inactive]/tabs-trigger:!text-muted-foreground",
							)}

							<span className="capitalize group-not-data-[state=active]/tabs-trigger:hidden">
								{getLabel(platform)}
							</span>
						</TabsTrigger>
					))}
				</TabsList>

				<Button className="rounded-full" onClick={handlePost} size="sm">
					Post
					<ShareIcon className="size-4" />
				</Button>
			</div>

			<div className="p-2 pt-0">
				{platforms.map((platform) => {
					const content = draft.versions[platform];

					return (
						<TabsContent key={platform} value={platform}>
							<Card className="relative h-88 rounded-2xl border-0 p-0 shadow-none">
								<CardContent
									className={cn(
										"size-full overflow-hidden rounded-[inherit] bg-background max-md:px-0",
										platform === "linkedin" && "not-dark:ring ring-border",
										platform,
									)}
								>
									{renderUI(content ?? "", platform, (content) => (
										<DraftEditor
											content={content}
											draftId={draftId}
											maxLength={PLATFORM_CONFIG[platform].maxLength}
											platform={platform}
										/>
									))}
								</CardContent>
							</Card>
						</TabsContent>
					);
				})}
			</div>
		</Tabs>
	);
}
