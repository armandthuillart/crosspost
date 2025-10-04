"use client";

import type { ComponentProps, ComponentType, ReactNode } from "react";
import { DraftEditor } from "~/components/draft.editor";
import { DraftHeader } from "~/components/draft.header";
import { Bluesky } from "~/components/draft.layout.bluesky";
import { LinkedIn } from "~/components/draft.layout.linkedin";
import { Threads } from "~/components/draft.layout.threads";
import { X } from "~/components/draft.layout.x";
import { DraftVersions } from "~/components/draft.versions";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent } from "~/components/ui/tabs";
import type { Platform, UIDraft } from "~/lib/types";
import { cn, getURL } from "~/lib/utils";

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
			post: { component: X.Post, props: { hasGrok: true } },
		},
		maxLength: 280,
	},
};

function renderUI(platform: Platform, content: string) {
	const config = PLATFORM_CONFIG[platform];

	const {
		maxLength,
		components: {
			layout: Layout,
			post: { component: Post, props },
		},
	} = config;

	return (
		<Layout>
			<Post {...props}>
				<DraftEditor content={content} maxLength={maxLength} />
			</Post>
		</Layout>
	);
}

interface DraftProps {
	title: string;
	versions: UIDraft["versions"];
}

export function Draft({ title, versions }: DraftProps) {
	const platforms = (Object.keys(versions) as Platform[]).sort(
		(a, b) => a.length - b.length,
	);

	const defaultPlatform = platforms[0];

	function handlePublish(platform: Platform) {
		const content = versions[platform];
		if (!content) return;
		const url = getURL(platform, content);
		window.open(url, "_blank", "noopener,noreferrer");
	}

	return (
		<Tabs
			className="relative not-first:mt-4 mb-4 w-full"
			defaultValue={defaultPlatform}
		>
			<DraftVersions platforms={platforms} />

			{platforms.map((platform) => {
				const content = versions[platform] ?? "";
				return (
					<TabsContent key={platform} value={platform}>
						<Card className="relative h-88 overflow-hidden rounded-2xl p-0 shadow-sm">
							<DraftHeader
								onPublish={() => handlePublish(platform)}
								title={title}
							/>
							<CardContent
								className={cn("z-0 overflow-hidden bg-background", platform)}
							>
								{renderUI(platform, content)}
							</CardContent>
						</Card>
					</TabsContent>
				);
			})}
		</Tabs>
	);
}
