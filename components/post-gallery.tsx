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
	column: number;
	order: number;
}

function PostCard({
	handle,
	content,
	platform,
	postedAt,
	isPremium,
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
						likeCount={100}
						replyCount={10}
						repostCount={10}
						viewsCount={1000}
					>
						{content}
					</X.Post>
				)}
				{platform === "threads" && (
					<Threads.Post
						className="rounded-md border bg-card"
						handle={handle}
						isVerified
						likesCount={100}
					>
						{content}
					</Threads.Post>
				)}
				{platform === "linkedin" && (
					<LinkedIn.Post
						className="size-full overflow-hidden rounded-md"
						createdAt={formatDistanceToNow(postedAt)}
						displayName={displayName}
						likeCount={100}
						replyCount={10}
						repostCount={10}
					>
						{content}
					</LinkedIn.Post>
				)}
				{platform === "bluesky" && (
					<Bluesky.Tweet
						className="!border size-full overflow-hidden rounded-md"
						createdAt={formatDistanceToNow(postedAt)}
						displayName={displayName}
						likesCount={100}
						repliesCount={10}
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
		content: `wait it's "jif" not "gif"??? my whole life is a lie`,
		displayName: "Armand",
		handle: "@armand",
		id: "1",
		isPremium: false,
		order: 1,
		platform: "x",
		postedAt: new Date(Date.now() - 2 * 60 * 1000),
	},
	{
		column: 2,
		content: `anyone tried the new agent kit yet? is it actually good or just more hype`,
		displayName: "Emma",
		handle: "emma",
		id: "8",
		isPremium: false,
		order: 2,
		platform: "threads",
		postedAt: new Date(Date.now() - 5 * 60 * 1000),
	},
	{
		column: 3,
		content:
			"spent 20 min looking for my keys. they were literally in my pocket the whole time",
		displayName: "sarahcodes",
		handle: "@sarahcodes",
		id: "2",
		isPremium: true,
		order: 2,
		platform: "x",
		postedAt: new Date(Date.now() - 8 * 60 * 1000),
	},
	{
		column: 1,
		content:
			"my coffee shop has been secretly adding cinnamon to my usual order for months. i never asked for it but now i'm addicted. they know me better than i know myself",
		displayName: "River",
		handle: "river.bsky.social",
		id: "10",
		isPremium: false,
		order: 2,
		platform: "bluesky",
		postedAt: new Date(Date.now() - 3 * 60 * 1000),
	},
	{
		column: 2,
		content:
			"ok this new AI thing is actually wild. just watched it build a whole react app in like 30 seconds. we're all gonna be unemployed",
		displayName: "Alex",
		handle: "@alexdev",
		id: "3",
		isPremium: true,
		order: 2,
		platform: "x",
		postedAt: new Date(Date.now() - 15 * 60 * 1000),
	},
	{
		column: 3,
		content:
			"It only has to make sense to you. Remember that.",
		displayName: "Marcus",
		handle: "marcus",
		id: "9",
		isPremium: false,
		order: 1,
		platform: "threads",
		postedAt: new Date(Date.now() - 18 * 60 * 1000),
	},
	{
		column: 1,
		content: "my timeline is absolutely unhinged today what is happening",
		displayName: "Maya",
		handle: "@mayathoughts",
		id: "4",
		isPremium: false,
		order: 3,
		platform: "x",
		postedAt: new Date(Date.now() - 25 * 60 * 1000),
	},
	{
		column: 2,
		content:
			"debugging at 2am taught me:\n\n• check logs first (saves you from looking like an idiot)\n• it's never as complicated as you think\n• coffee hits different when you're not having a breakdown\n\nwhat's your worst debugging nightmare?",
		displayName: "David Thompson",
		handle: "David Thompson",
		id: "6",
		isPremium: false,
		order: 1,
		platform: "linkedin",
		postedAt: new Date(Date.now() - 24 * 60 * 1000),
	},
	{
		column: 3,
		content: "coffee shop wifi died and i'm literally shaking",
		displayName: "jordanwrites",
		handle: "@jordanwrites",
		id: "5",
		isPremium: false,
		order: 3,
		platform: "x",
		postedAt: new Date(Date.now() - 35 * 60 * 1000),
	},
	{
		column: 1,
		content:
			"sunset from my balcony was unreal tonight. sometimes you just gotta stop and appreciate the little things before they're gone",
		displayName: "Phoenix",
		handle: "phoenix.bsky.social",
		id: "11",
		isPremium: false,
		order: 4,
		platform: "bluesky",
		postedAt: new Date(Date.now() - 12 * 60 * 1000),
	},
	{
		column: 3,
		content:
			"reading about decentralized social networks and honestly the future is wild. we're either gonna solve everything or break everything, no in between",
		displayName: "Sage",
		handle: "sage.bsky.social",
		id: "12",
		isPremium: false,
		order: 4,
		platform: "bluesky",
		postedAt: new Date(Date.now() - 30 * 60 * 1000),
	},
];
