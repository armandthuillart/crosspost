"use client";

import { formatDistanceToNow } from "date-fns";
import { useTranslations } from "next-intl";
import { Bluesky } from "~/components/draft.layout.bluesky";
import { LinkedIn } from "~/components/draft.layout.linkedin";
import { Threads } from "~/components/draft.layout.threads";
import { X } from "~/components/draft.layout.x";
import { appName } from "~/lib/constants";
import type { Platform } from "~/lib/types";
import { cn } from "~/lib/utils";

const createColumn = (columnIndex: number) => (
	<div className="col-span-1 flex flex-col gap-6">
		{seeds
			.filter((seed) => seed.column === columnIndex + 1)
			.sort((a, b) => a.order - b.order)
			.map((seed) => (
				<PostCard key={seed.id} {...seed} />
			))}
	</div>
);

export function PostGallery() {
	const t = useTranslations("PostGallery");

	return (
		<div className="px-4">
			<div className="mx-auto mt-24 flex w-full max-w-7xl flex-col gap-4 pb-24">
				<div className="flex flex-col">
					<p className="font-medium">{t("title")}</p>
					<p className="text-muted-foreground text-sm/6">
						{t("description", { appName })}
					</p>
				</div>

				<div className="grid @5xl/chat:grid-cols-3 @lg/chat:grid-cols-2 grid-cols-1 justify-center gap-6">
					{createColumn(0)}
					{createColumn(1)}
					{createColumn(2)}
				</div>
			</div>
		</div>
	);
}

interface PostCardProps {
	id: string;
	handle: string;
	content: string;
	postedAt: Date;
	platform: Platform;
	isPremium: boolean;
	displayName: string;
	likesCount: number;
	replyCount: number;
	repostCount: number;
	viewsCount: number;
	column: number;
	order: number;
}

function PostCard({
	handle,

	content,
	platform,
	postedAt,
	isPremium,
	likesCount,
	replyCount,
	viewsCount,
	repostCount,
	displayName,
}: PostCardProps) {
	return (
		<div className="overflow-hidden rounded-xl border outline-none transition-[opacity,box-shadow,background-color] ease-snappy focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
			<div
				className={cn(
					"flex bg-background p-2",
					platform === "linkedin" && "max-w-138.75",
					platform === "threads" && "max-w-160",
					platform === "bluesky" && "max-w-150",
					platform === "x" && "max-w-149.5",
					platform,
				)}
			>
				{platform === "x" && (
					<X.Post
						className="size-full rounded-md border"
						createdAt={formatDistanceToNow(postedAt)}
						displayName={displayName}
						handle={handle}
						isPremium={isPremium}
						likeCount={likesCount}
						replyCount={replyCount}
						repostCount={repostCount}
						viewsCount={viewsCount}
					>
						{content}
					</X.Post>
				)}
				{platform === "threads" && (
					<Threads.Post
						className="rounded-md border bg-card"
						handle={handle}
						isVerified
						likesCount={likesCount}
						repliesCount={replyCount}
						repostsCount={repostCount}
					>
						{content}
					</Threads.Post>
				)}
				{platform === "linkedin" && (
					<LinkedIn.Post
						className="size-full overflow-hidden rounded-md"
						createdAt={formatDistanceToNow(postedAt)}
						displayName={displayName}
						likeCount={likesCount}
						replyCount={replyCount}
						repostCount={repostCount}
					>
						{content}
					</LinkedIn.Post>
				)}
				{platform === "bluesky" && (
					<Bluesky.Tweet
						className="!border size-full overflow-hidden rounded-md"
						commentsCount={repostCount}
						createdAt={formatDistanceToNow(postedAt)}
						displayName={displayName}
						handle={handle}
						likesCount={likesCount}
						repliesCount={replyCount}
					>
						{content}
					</Bluesky.Tweet>
				)}
			</div>
		</div>
	);
}

const seeds: PostCardProps[] = [
	{
		column: 1,
		content:
			"been debugging the same issue for 3 hours and it was a typo in the variable name why am i like this",
		displayName: "jen",
		handle: "@jenbuilds",
		id: "1",
		isPremium: false,
		likesCount: 100,
		order: 1,
		platform: "x",
		postedAt: new Date(Date.now() - 4 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 2,
		content:
			"why does every tutorial assume i already know what im trying to learn",
		displayName: "cal",
		handle: "cal",
		id: "8",
		isPremium: false,
		likesCount: 100,
		order: 2,
		platform: "threads",
		postedAt: new Date(Date.now() - 8 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 3,
		content: "my code works but i have no idea why shipping it anyway",
		displayName: "Marcus Chen",
		handle: "@mchen",
		id: "2",
		isPremium: true,
		likesCount: 100,
		order: 2,
		platform: "x",
		postedAt: new Date(Date.now() - 12 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 1,
		content:
			"local bakery started recognizing me and now they just hand me my usual without asking not sure if this is peak adulthood or just sad",
		displayName: "River Song",
		handle: "river.bsky.social",
		id: "10",
		isPremium: false,
		likesCount: 100,
		order: 2,
		platform: "bluesky",
		postedAt: new Date(Date.now() - 6 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 2,
		content:
			"wrote some code that actually worked on the first try and now im suspicious what did i miss",
		displayName: "Taylor Kim",
		handle: "@taylorcodes",
		id: "3",
		isPremium: true,
		likesCount: 100,
		order: 2,
		platform: "x",
		postedAt: new Date(Date.now() - 18 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 3,
		content:
			"anyone elses imposter syndrome just background noise at this point",
		displayName: "dev_irl",
		handle: "dev_irl",
		id: "9",
		isPremium: false,
		likesCount: 100,
		order: 1,
		platform: "threads",
		postedAt: new Date(Date.now() - 22 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 1,
		content:
			"explaining what i do for work to my parents will never not be awkward",
		displayName: "sam",
		handle: "@samwrites",
		id: "4",
		isPremium: false,
		likesCount: 100,
		order: 3,
		platform: "x",
		postedAt: new Date(Date.now() - 28 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 2,
		content:
			"After 3 years building our design system from scratch, we're open sourcing it next week.\n\nWhat started as a side project to solve our own problems turned into something we think can help other teams ship faster. Still can't believe we're here.\n\nMore details coming soon. Would love to hear what challenges you're facing with design systems.",
		displayName: "Priya Sharma",
		handle: "Priya Sharma",
		id: "6",
		isPremium: false,
		likesCount: 100,
		order: 1,
		platform: "linkedin",
		postedAt: new Date(Date.now() - 45 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 3,
		content: "reminder that taking a break is productive actually",
		displayName: "alex",
		handle: "@alexthinks",
		id: "5",
		isPremium: false,
		likesCount: 100,
		order: 3,
		platform: "x",
		postedAt: new Date(Date.now() - 38 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 1,
		content:
			"watching the clouds move while my code compiles sometimes the in between moments are the best ones",
		displayName: "morgan",
		handle: "morgan.bsky.social",
		id: "11",
		isPremium: false,
		likesCount: 100,
		order: 4,
		platform: "bluesky",
		postedAt: new Date(Date.now() - 16 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
	{
		column: 3,
		content:
			"decentralization either saves us or fragments us into a million pieces probably both",
		displayName: "kai",
		handle: "kai.bsky.social",
		id: "12",
		isPremium: false,
		likesCount: 100,
		order: 4,
		platform: "bluesky",
		postedAt: new Date(Date.now() - 34 * 60 * 1000),
		replyCount: 10,
		repostCount: 10,
		viewsCount: 1000,
	},
];
