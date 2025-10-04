"use client";

import { atom, useAtom } from "jotai";
import {
	ChevronDownIcon,
	EllipsisIcon,
	HeartIcon,
	type LucideProps,
	MessageCircleIcon,
	PlusIcon,
	Repeat2Icon,
	SendIcon,
} from "lucide-react";
import { type MotionProps, motion } from "motion/react";
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
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const postMarginTopAtom = atom<number>(0);

function formatNumber(num: number): string {
	if (num >= 1000) {
		return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
	}
	return num.toString();
}

interface PageProps extends ComponentProps<"div"> {
	avatar?: string;
}

function Page({ children, className, avatar, ...props }: PageProps) {
	const [postMarginTop] = useAtom(postMarginTopAtom);

	return (
		<div
			className={cn("flex flex-1 items-center justify-center px-5", className)}
			{...props}
		>
			<div
				className="flex max-w-160 flex-col"
				data-feed
				style={{ marginTop: `-${postMarginTop / 2}px` }}
			>
				<Header />

				<div className="flex size-full flex-col rounded-t-3xl border border-b-0 bg-card shadow-lg">
					<div className="flex items-center justify-between border-b p-6">
						<div className="flex items-center gap-3">
							<Avatar className="size-9">
								<AvatarImage
									src={
										avatar ??
										"https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg"
									}
								/>
							</Avatar>

							<span className="text-muted-foreground leading-5.25">
								What&apos;s new?
							</span>
						</div>

						<Button
							className="bg-card px-4 font-semibold text-base hover:bg-card"
							variant="outline"
						>
							Post
						</Button>
					</div>
					<Threads.Post
						avatar="https://scontent-cdg4-1.cdninstagram.com/v/t51.2885-19/532425827_17922468903102532_3119748025702625018_n.jpg?stp=dst-jpg_s640x640_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QE8wR4Z0joPLkiyCpyOf5E-MU10n210ZUJKd74a1dz2dkK36dBCfiECi-SrLjFDc58&_nc_ohc=0fgGJKlEKo0Q7kNvwEgSsAE&_nc_gid=ipBe9Ju-XUmeq0LtdtdhwA&edm=AAZTMJEBAAAA&ccb=7-5&oh=00_AfUlKMSyJhY1hvScM8r9YtUb5qc_4hT3JPmI76Y6uwoxLg&oe=68B4DC2B&_nc_sid=49cb7f"
						content="How do you take your toast? 🧈"
						handle="threads"
						isVerified
						likesCount={1400}
						postedAt="2h"
						repliesCount={636}
						repostsCount={59}
					/>
					{children}
					<Threads.Post
						avatar="https://scontent-cdg4-1.cdninstagram.com/v/t51.2885-19/532425827_17922468903102532_3119748025702625018_n.jpg?stp=dst-jpg_s640x640_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QE8wR4Z0joPLkiyCpyOf5E-MU10n210ZUJKd74a1dz2dkK36dBCfiECi-SrLjFDc58&_nc_ohc=0fgGJKlEKo0Q7kNvwEgSsAE&_nc_gid=ipBe9Ju-XUmeq0LtdtdhwA&edm=AAZTMJEBAAAA&ccb=7-5&oh=00_AfUlKMSyJhY1hvScM8r9YtUb5qc_4hT3JPmI76Y6uwoxLg&oe=68B4DC2B&_nc_sid=49cb7f"
						content="One underrated form of self-care: threading"
						handle="threads"
						isVerified
						likesCount={5900}
						postedAt="1d"
						repliesCount={752}
						repostsCount={459}
					/>
					<Threads.Post
						avatar="https://scontent-cdg4-1.cdninstagram.com/v/t51.2885-19/532425827_17922468903102532_3119748025702625018_n.jpg?stp=dst-jpg_s640x640_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-cdg4-1.cdninstagram.com&_nc_cat=1&_nc_oc=Q6cZ2QE8wR4Z0joPLkiyCpyOf5E-MU10n210ZUJKd74a1dz2dkK36dBCfiECi-SrLjFDc58&_nc_ohc=0fgGJKlEKo0Q7kNvwEgSsAE&_nc_gid=ipBe9Ju-XUmeq0LtdtdhwA&edm=AAZTMJEBAAAA&ccb=7-5&oh=00_AfUlKMSyJhY1hvScM8r9YtUb5qc_4hT3JPmI76Y6uwoxLg&oe=68B4DC2B&_nc_sid=49cb7f"
						content="If we made you a bowl of pasta shaped like Threads, would you eat it? 🍝"
						handle="threads"
						isVerified
						likesCount={2600}
						postedAt="2d"
						repliesCount={603}
						repostsCount={101}
					/>
				</div>
			</div>
		</div>
	);
}

function Header() {
	return (
		<div className="flex h-15 w-full shrink-0 items-center justify-center">
			<div className="flex items-center gap-4">
				<h1 className="font-semibold text-[0.9375rem] leading-5.25">For you</h1>

				<div className="flex size-6 items-center justify-center rounded-full border border-input bg-card">
					<ChevronDownIcon className="size-4 text-foreground" />
				</div>
			</div>
		</div>
	);
}

interface PostProps {
	image?: string;
	handle?: string;
	avatar?: string;
	content?: string;
	postedAt?: string;
	children?: ReactNode;
	likesCount?: number;
	isVerified?: boolean;
	repostsCount?: number;
	repliesCount?: number;
	isEndOfThread?: boolean;
	isStartOfThread?: boolean;
}

function Post({
	image,
	handle,
	avatar,
	content,
	children,
	postedAt,
	likesCount,
	isVerified,
	repostsCount,
	repliesCount,
	isEndOfThread = false,
	isStartOfThread = false,
}: PostProps) {
	const postRef = useRef<HTMLDivElement>(null);
	const [, setPostMarginTop] = useAtom(postMarginTopAtom);

	const centerPost = useCallback(() => {
		const post = postRef.current;

		if (!post) {
			return;
		}

		if (!children) {
			return;
		}

		const pageElement = post.closest(".threads");
		if (!pageElement) return;

		const flexContainer = pageElement.querySelector("[data-feed]");
		if (!flexContainer) return;

		const flexHeight = (flexContainer as HTMLElement).offsetHeight;

		const postHeight = post.offsetHeight;

		const marginAdjustment = flexHeight / 2 - postHeight / 2;

		setPostMarginTop(marginAdjustment);
	}, [setPostMarginTop, children]);

	useLayoutEffect(() => {
		centerPost();

		const node = postRef.current;
		if (!node) return;

		const resizeObserver = new ResizeObserver(() => {
			centerPost();
		});
		resizeObserver.observe(node);

		return () => {
			resizeObserver.disconnect();
		};
	}, [centerPost]);

	const props = children
		? ({
				layout: "preserve-aspect",
				onLayoutMeasure: centerPost,
				ref: postRef,
			} as MotionProps)
		: {};

	return (
		<motion.div
			className="flex gap-3 border-b px-6 pt-3 pb-2"
			data-post
			data-thread-end={isEndOfThread}
			data-thread-start={isStartOfThread}
			ref={postRef}
			{...props}
		>
			<Avatar className="relative mt-1 size-9 shrink-0 overflow-visible">
				<Image
					alt="Avatar"
					className="rounded-full"
					fetchPriority="auto"
					height={36}
					src={
						avatar ??
						"https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg"
					}
					width={36}
				/>

				<div className="-right-0.5 -bottom-px absolute flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground outline-2 outline-card">
					<PlusIcon className="size-3" />
				</div>
			</Avatar>

			<div className="flex w-full flex-col">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5">
						<div className="flex items-center gap-1">
							<span className="font-semibold leading-5.25">
								{handle ?? "you"}
							</span>
							{isVerified && <Badge />}
						</div>

						<span className="text-muted-foreground leading-5.25">
							{postedAt ?? "now"}
						</span>
					</div>

					<EllipsisIcon className="size-5 text-muted-foreground" />
				</div>

				<div className="mt-0.75 flex flex-col items-start gap-1.5 text-left">
					{children ? (
						children
					) : (
						<div className="prose dark:prose-invert">
							<p>{content}</p>
						</div>
					)}

					{image && (
						<div className="relative mt-2 mb-1 aspect-video w-full">
							<Image
								alt="Image"
								className="rounded-md border object-cover"
								fetchPriority="auto"
								fill
								sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
								src={image}
							/>
						</div>
					)}

					<div className="-ml-3 flex">
						<Button className="gap-1 rounded-full px-3" variant="ghost">
							<HeartIcon className="size-4.5" />
							{likesCount && (
								<span className="text-sm leading-5.25">
									{formatNumber(likesCount)}
								</span>
							)}
						</Button>

						<Button className="gap-1 rounded-full px-3" variant="ghost">
							<MessageCircleIcon className="size-4.5" />
							{repliesCount && (
								<span className="text-sm leading-5.25">
									{formatNumber(repliesCount)}
								</span>
							)}
						</Button>

						<Button className="gap-1 rounded-full px-3" variant="ghost">
							<Repeat2Icon className="size-4.5" />
							{repostsCount && (
								<span className="text-sm leading-5.25">
									{formatNumber(repostsCount)}
								</span>
							)}
						</Button>

						<Button className="rounded-full" size="icon" variant="ghost">
							<SendIcon className="size-4.5" />
						</Button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function Badge() {
	return (
		<svg
			aria-label="Verified"
			className="size-3 fill-[#0095F6]"
			role="img"
			viewBox="0 0 40 40"
		>
			<title>Verified</title>
			<path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"></path>
		</svg>
	);
}

const Icon = forwardRef<SVGSVGElement, LucideProps>(function Icon(
	{ width = 24, height = 24, ...props },
	ref,
) {
	return (
		<svg
			fill="currentColor"
			height={height}
			ref={ref}
			viewBox="0 0 24 24"
			width={width}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>Threads</title>
			<path d="M12.1835 1.41016L12.1822 1.41016C9.09012 1.43158 6.70036 2.47326 5.09369 4.51569C3.66581 6.33087 2.93472 8.86436 2.91016 12.0068V12.0082C2.93472 15.1508 3.66586 17.6696 5.09369 19.4847C6.70043 21.5271 9.10257 22.5688 12.1946 22.5902H12.1958C14.944 22.5711 16.8929 21.8504 18.4985 20.2463C20.6034 18.1434 20.5408 15.5048 19.8456 13.8832C19.3163 12.6493 18.2709 11.6618 16.8701 11.0477C16.6891 8.06345 15.0097 6.32178 12.2496 6.30415C10.6191 6.29409 9.14792 7.02378 8.24685 8.39104L9.90238 9.5267C10.4353 8.71818 11.2789 8.32815 12.2371 8.33701C13.6244 8.34586 14.5362 9.11128 14.7921 10.4541C14.02 10.3333 13.1902 10.2982 12.3076 10.3488C9.66843 10.5008 7.9399 12.061 8.05516 14.2244C8.17571 16.4862 10.367 17.7186 12.4476 17.605C14.9399 17.4684 16.4209 15.6292 16.7722 13.2836C17.3493 13.6575 17.7751 14.1344 18.0163 14.6969C18.4559 15.7222 18.4838 17.4132 17.1006 18.7952C15.8838 20.0108 14.4211 20.5407 12.1891 20.5572C9.71428 20.5388 7.85698 19.746 6.65154 18.2136C5.51973 16.7748 4.92843 14.6882 4.90627 12.0002C4.92843 9.31211 5.51973 7.22549 6.65154 5.78673C7.85698 4.25433 9.71424 3.46156 12.189 3.44303C14.6819 3.4617 16.5728 4.25837 17.8254 5.79937C18.5162 6.64934 18.949 7.66539 19.2379 8.71407L21.1776 8.19656C20.8148 6.85917 20.2414 5.58371 19.363 4.50305C17.7098 2.46918 15.2816 1.43166 12.1835 1.41016ZM12.4204 12.3782C13.3044 12.3272 14.1239 12.3834 14.8521 12.5345C14.7114 14.1116 14.0589 15.4806 12.3401 15.575C11.2282 15.6376 10.1031 15.1413 10.0484 14.114C10.0077 13.3503 10.5726 12.4847 12.4204 12.3782Z" />
		</svg>
	);
});

export const Threads = Object.assign(Page, {
	Badge,
	Icon,
	Post,
});
