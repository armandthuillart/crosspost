import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { appName } from "~/lib/constants";
import type { Platform } from "~/lib/types";

const seeds: PostCardProps[] = [
	{
		content:
			"most productivity hacks are just ways to avoid doing the actual work",
		id: "1",
		platform: "x",
		postedAt: new Date(Date.now() - 2 * 60 * 1000),
		title: "Productivity hacks",
	},
	{
		content:
			"3 hours debugging why my code and turns out i had a typo in a variable name fml",
		id: "2",
		platform: "threads",
		postedAt: new Date(Date.now() - 5 * 60 * 1000),
		title: "Debugging nightmare",
	},
	{
		content:
			"After 10 years in tech, I've learned that the best products aren't built by committees. They're built by small teams with clear vision and the courage to say no.",
		id: "3",
		platform: "linkedin",
		postedAt: new Date(Date.now() - 24 * 60 * 1000),
		title: "Product development insights",
	},
	{
		content: "if you wait for everything to be perfect to ship you're ngmi",
		id: "4",
		platform: "bluesky",
		postedAt: new Date(Date.now() - 3 * 60 * 1000),
		title: "Shipping advice",
	},
];

export function PostGallery() {
	return (
		<motion.div
			className="mx-auto mt-24 flex w-full max-w-7xl flex-col gap-4 pb-24"
			exit={{ opacity: 0 }}
			layoutId="post-gallery"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
		>
			<div className="flex flex-col">
				<p className="font-medium">From the Community</p>
				<p className="text-muted-foreground text-sm/6">
					Explore what the community is posting with {appName}.
				</p>
			</div>

			<div className="grid @5xl/chat:grid-cols-3 @lg/chat:grid-cols-2 grid-cols-1 justify-center gap-6">
				{seeds.map((seed) => (
					<PostCard key={seed.id} {...seed} />
				))}
			</div>
		</motion.div>
	);
}

interface PostCardProps {
	id: string;
	title: string;
	content: string;
	postedAt: Date;
	platform: Platform;
}

function PostCard({ title, postedAt }: PostCardProps) {
	return (
		<div className="flex w-full flex-col gap-2 has-focus-visible:ring-3 has-focus-visible:ring-ring/50">
			<div className="aspect-video overflow-hidden rounded-md border" />
			<div className="flex items-center gap-3">
				<Avatar className="size-9">
					<AvatarFallback className="font-medium">AT</AvatarFallback>
				</Avatar>

				<div className="flex flex-col">
					<p className="truncate font-medium text-sm/4.5">{title}</p>
					<p className="text-muted-foreground text-sm/4.5">
						{formatDistanceToNow(postedAt, {
							addSuffix: true,
							includeSeconds: false,
						}).replace(/^about /, "")}
					</p>
				</div>
			</div>
		</div>
	);
}
