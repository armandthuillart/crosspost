"use client";

import { atom, useAtom } from "jotai";
import {
	DownloadIcon,
	HashIcon,
	HeartIcon,
	type LucideProps,
	MessageSquareIcon,
	MoreHorizontalIcon,
	RepeatIcon,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import {
	type ComponentProps,
	forwardRef,
	type ReactNode,
	useCallback,
	useLayoutEffect,
	useRef,
} from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

const tweetMarginTopAtom = atom<number>(0);

function formatNumber(num: number): string {
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
	}
	return num.toString();
}

function Page({ children, className, ...props }: ComponentProps<"div">) {
	const [tweetMarginTop] = useAtom(tweetMarginTopAtom);

	return (
		<div
			className={cn(
				"bluesky flex h-full items-center justify-center px-4 pb-8 antialiased before:bg-background",
				className,
			)}
			{...props}
		>
			<div
				className="flex flex-col"
				data-feed
				style={{ marginTop: tweetMarginTop }}
			>
				<Header />

				<Bluesky.Tweet
					avatar="https://cdn.bsky.app/img/avatar_thumbnail/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreihagr2cmvl2jt4mgx3sppwe2it3fwolkrbtjrhcnwjk4jdijhsoze@jpeg"
					commentsCount={45}
					content="PSA on links: On Bluesky, there's no limit to the number of links you can share, and they will receive the same visibility as your other posts 💙"
					createdAt="6d"
					displayName="Bluesky"
					handle="@bsky.app"
					isVerified
					likesCount={45}
					repliesCount={12}
				/>
				{children}
				<Bluesky.Tweet
					avatar="https://cdn.bsky.app/img/avatar_thumbnail/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreihagr2cmvl2jt4mgx3sppwe2it3fwolkrbtjrhcnwjk4jdijhsoze@jpeg"
					commentsCount={818}
					content={`📢 1.104 is rolling out with new ways to personalize your notifications!

					• Activity Notifications: Get push alerts from your favorite accounts
					• Repost Notifications: See when someone likes or reposts something you've reposted
					• New Notification Settings: Fine-tune which notifications you receive
					`}
					createdAt="6d"
					displayName="Bluesky"
					handle="@bsky.app"
					image="https://cdn.bsky.app/img/feed_fullsize/plain/did:plc:z72i7hdynmk6r22z27h6tvur/bafkreifphviernsyfyselkgzry34uokctsjkpiqcwtfiky65bjh3sgv3aq@jpeg"
					isStartOfThread
					isThread
					isVerified
					likesCount={13200}
					repliesCount={5600}
				/>
			</div>
		</div>
	);
}

function Header() {
	return (
		<>
			<div className="flex items-center justify-between border-x px-5 pt-3">
				<div className="size-8.5" />
				<div className="flex size-7 items-center justify-center">
					<Icon className="size-8.5 shrink-0 text-selection-foreground" />
				</div>
				<div className="flex size-8.5 items-center justify-center rounded-lg hover:bg-accent">
					<HashIcon className="text-muted-foreground" />
				</div>
			</div>

			<div className="sticky top-0 z-10 mx-auto grid h-11.75 w-full max-w-150 grid-cols-2 border border-t-0 bg-background">
				<div className="flex justify-center p-3.5 pb-0 hover:bg-accent">
					<div className="flex h-full flex-col items-center justify-between">
						<p className="font-semibold text-[15px] text-foreground leading-5">
							Discover
						</p>
						<span className="h-0.75 w-16" />
					</div>
				</div>

				<div className="flex justify-center p-3.5 pb-0 hover:bg-accent">
					<div className="flex h-full flex-col items-center justify-between">
						<p className="font-semibold text-[15px] text-foreground leading-5">
							Following
						</p>
						<span className="h-0.75 w-16 bg-selection-foreground" />
					</div>
				</div>
			</div>
		</>
	);
}

interface TweetProps {
	image?: string;
	avatar?: string;
	handle?: string;
	content?: string;
	children?: ReactNode;
	isThread?: boolean;
	createdAt?: string;
	className?: string;
	likesCount?: number;
	isVerified?: boolean;
	displayName?: string;
	repliesCount?: number;
	commentsCount?: number;
	isEndOfThread?: boolean;
	isStartOfThread?: boolean;
}

function Tweet({
	image,
	avatar,
	handle = "@you",
	content,
	isThread,
	children,
	createdAt = "now",
	className,
	likesCount,
	isVerified,
	displayName = "You",
	repliesCount,
	commentsCount,
	isEndOfThread = false,
	isStartOfThread = false,
}: TweetProps) {
	const tweetRef = useRef<HTMLDivElement>(null);
	const [, setTweetMarginTop] = useAtom(tweetMarginTopAtom);

	const centerTweet = useCallback(() => {
		const tweet = tweetRef.current;

		if (!tweet) {
			return;
		}

		if (!children) {
			return;
		}

		const pageElement = tweet.closest(".bluesky");
		if (!pageElement) return;

		const flexContainer = pageElement.querySelector("[data-feed]");
		if (!flexContainer) return;

		const flexHeight = (flexContainer as HTMLElement).offsetHeight;

		const tweetHeight = tweet.offsetHeight;

		const marginAdjustment = flexHeight / 2 - tweetHeight / 2;

		setTweetMarginTop(marginAdjustment);
	}, [setTweetMarginTop, children]);

	useLayoutEffect(() => {
		centerTweet();

		const node = tweetRef.current;
		if (!node) return;

		const resizeObserver = new ResizeObserver(() => {
			centerTweet();
		});
		resizeObserver.observe(node);

		return () => {
			resizeObserver.disconnect();
		};
	}, [centerTweet]);

	return (
		<motion.div
			className={cn(
				"mx-auto flex w-full max-w-150 border not-last:border-t-0 p-2.5 pr-3.75 pb-2 last:border-t-0 last:border-b-0 hover:bg-muted/45 data-[thread-end=true]:border-t-0 data-[thread-start=true]:border-b-0 data-[thread-end=true]:pt-0",
				className,
			)}
			data-thread-end={isEndOfThread}
			data-thread-start={isStartOfThread}
			data-tweet
			ref={tweetRef}
		>
			<div className="flex flex-col pr-2.5 pl-2">
				<Avatar className="size-10.5 border">
					<AvatarImage src={avatar ?? ""} />
				</Avatar>

				{isThread && (
					<div className="mx-auto mt-1 h-full w-0.5 shrink bg-border" />
				)}
			</div>

			<div className="flex w-full flex-col">
				<div className="flex items-center pb-1">
					<span className="font-semibold leading-4.25">{displayName}</span>
					{isVerified && <Badge />}
					&nbsp;
					<span className="text-muted-foreground leading-4.25">{handle}</span>
					<span className="pl-1 text-muted-foreground leading-4.25">
						· {createdAt}
					</span>
				</div>

				<div className="prose dark:prose-invert w-full">
					{children ? (
						children
					) : (
						<p className="whitespace-pre-line text-foreground">{content}</p>
					)}

					{image && (
						<div className="relative mt-2 mb-1 aspect-video">
							<Image
								alt="Image"
								fetchPriority="auto"
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								src={image}
							/>
						</div>
					)}

					<div className="grid grid-cols-5 pt-0.5">
						<div className="-ml-1.5">
							<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
								<div className="flex size-4.5 items-center justify-center">
									<MessageSquareIcon className="size-4" />
								</div>

								{commentsCount && (
									<span className="text-sm leading-[13.125px]">
										{formatNumber(commentsCount)}
									</span>
								)}
							</div>
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
							<RepeatIcon className="size-4.5" />

							{repliesCount && (
								<span className="text-sm leading-[13.125px]">
									{formatNumber(repliesCount)}
								</span>
							)}
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
							<HeartIcon className="size-4.5" />

							{likesCount && (
								<span className="text-sm leading-[13.125px]">
									{formatNumber(likesCount)}
								</span>
							)}
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
							<DownloadIcon className="size-4.5" />
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
							<MoreHorizontalIcon className="size-4.5" />
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function Badge() {
	return (
		<svg className="ml-0.5 size-3" viewBox="0 0 24 24">
			<title>Verified</title>
			<path
				clipRule="evenodd"
				d="M8.792 1.615a4.154 4.154 0 0 1 6.416 0 4.154 4.154 0 0 0 3.146 1.515 4.154 4.154 0 0 1 4 5.017 4.154 4.154 0 0 0 .777 3.404 4.154 4.154 0 0 1-1.427 6.255 4.153 4.153 0 0 0-2.177 2.73 4.154 4.154 0 0 1-5.781 2.784 4.154 4.154 0 0 0-3.492 0 4.154 4.154 0 0 1-5.78-2.784 4.154 4.154 0 0 0-2.178-2.73A4.154 4.154 0 0 1 .87 11.551a4.154 4.154 0 0 0 .776-3.404A4.154 4.154 0 0 1 5.646 3.13a4.154 4.154 0 0 0 3.146-1.515Z"
				fill="var(--color-selection-foreground)"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M17.861 8.26a1.438 1.438 0 0 1 0 2.033l-6.571 6.571a1.437 1.437 0 0 1-2.033 0L5.97 13.58a1.438 1.438 0 0 1 2.033-2.033l2.27 2.269 5.554-5.555a1.437 1.437 0 0 1 2.033 0Z"
				fill="var(--color-white)"
				fillRule="evenodd"
			/>
		</svg>
	);
}

const Icon = forwardRef<SVGSVGElement, LucideProps>(function BlueskyIcon(
	{ width = 24, height = 24, ...props },
	ref,
) {
	return (
		<svg
			fill="#1385FE"
			height={height}
			ref={ref}
			viewBox="0 0 24 24"
			width={width}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>Bluesky</title>
			<path d="M12 11.3884C11.0942 9.62673 8.62833 6.34423 6.335 4.7259C4.13833 3.17506 3.30083 3.4434 2.75167 3.69256C2.11583 3.9784 2 4.95506 2 5.52839C2 6.10339 2.315 10.2367 2.52 10.9276C3.19917 13.2076 5.61417 13.9776 7.83917 13.7309C4.57917 14.2142 1.68333 15.4017 5.48083 19.6292C9.65833 23.9542 11.2058 18.7017 12 16.0392C12.7942 18.7017 13.7083 23.7651 18.4442 19.6292C22 16.0392 19.4208 14.2142 16.1608 13.7309C18.3858 13.9784 20.8008 13.2076 21.48 10.9276C21.685 10.2376 22 6.10256 22 5.52923C22 4.95423 21.8842 3.97839 21.2483 3.6909C20.6992 3.44256 19.8617 3.17423 17.665 4.72423C15.3717 6.34506 12.9058 9.62756 12 11.3884Z" />
		</svg>
	);
});

export const Bluesky = Object.assign(Page, {
	Badge,
	Icon,
	Tweet,
});
