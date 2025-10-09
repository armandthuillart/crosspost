"use client";

import { atom, useAtom } from "jotai";
import { motion } from "motion/react";
import {
	type ComponentProps,
	forwardRef,
	type ReactNode,
	type SVGProps,
	useLayoutEffect,
	useRef,
} from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { MoreIcon } from "~/components/ui/icons";
import { cn, formatNumberToK } from "~/lib/utils";

const postMarginTopAtom = atom<number>(0);

function Page({
	children,
	hasHeader = true,
	className,
	...props
}: ComponentProps<"div"> & { hasHeader?: boolean }) {
	const [postMarginTop] = useAtom(postMarginTopAtom);

	return (
		<div
			className={cn(
				"mx-auto flex w-full max-w-149.5 flex-col border-x",
				className,
			)}
			data-feed
			style={{ marginTop: postMarginTop }}
			{...props}
		>
			{hasHeader && <Header />}
			<Post
				avatar="https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_400x400.jpg"
				content="bangers are in the eye of the beholder"
				createdAt="Aug 25"
				displayName="X"
				handle="@X"
				hasSquareAvatar
				likeCount={6500}
				replyCount={1700}
				repostCount={1000}
				viewsCount={759000}
			/>
			<Post
				avatar="https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_400x400.jpg"
				content="drafts are where dreams go to die"
				createdAt="Jul 31"
				displayName="X"
				handle="@X"
				hasSquareAvatar
				likeCount={4600}
				replyCount={841}
				repostCount={1000}
				viewsCount={698000}
			/>
			{children}
			<Post
				avatar="https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_400x400.jpg"
				content="this platform is how you find out what's actually happening"
				createdAt="Jun 9"
				displayName="X"
				handle="@X"
				hasSquareAvatar
				likeCount={16000}
				replyCount={1800}
				repostCount={2100}
				viewsCount={1200000}
			/>
			<Post
				avatar="https://pbs.twimg.com/profile_images/1955359038532653056/OSHY3ewP_400x400.jpg"
				content="gm group chat say it back"
				createdAt="Apr 12"
				displayName="X"
				handle="@X"
				hasSquareAvatar
				likeCount={16000}
				replyCount={1800}
				repostCount={2100}
				viewsCount={1200000}
			/>
		</div>
	);
}

function Header() {
	return (
		<div className="sticky top-0 z-1 grid h-13 w-full grid-cols-2 border-b bg-background/85 backdrop-blur-md">
			{["For you", "Following"].map((title, index) => (
				<div className="flex items-center justify-center px-4" key={title}>
					<div className="flex flex-col">
						<p className="pt-4 pb-3 font-bold text-[0.9375rem] leading-5">
							{title}
						</p>
						{index === 0 && (
							<span className="h-1 w-14 bg-selection-foreground" />
						)}
					</div>
				</div>
			))}
		</div>
	);
}

interface PostProps {
	handle?: string;
	avatar?: string;
	content?: string;
	hasGrok?: boolean;
	children?: ReactNode;
	className?: string;
	likeCount?: number;
	createdAt?: string;
	isPremium?: boolean;
	replyCount?: number;
	viewsCount?: number;
	repostCount?: number;
	displayName?: string;
	hasSquareAvatar?: boolean;
}

function Post({
	avatar,
	handle = "@you",
	hasGrok,
	content,
	children,
	className,
	likeCount,
	createdAt = "now",
	isPremium = true,
	replyCount,
	viewsCount,
	displayName = "You",
	repostCount,
	hasSquareAvatar,
}: PostProps) {
	const fallbackUrl =
		"https://static.cdninstagram.com/rsrc.php/v1/yb/r/5OTfmveiK1K.jpg";

	const postRef = useRef<HTMLDivElement>(null);
	const [, setPostMarginTop] = useAtom(postMarginTopAtom);

	useLayoutEffect(() => {
		const centerPost = () => {
			const post = postRef.current;

			if (!post || !children) {
				return;
			}

			const cardContent = post.closest(
				'[data-slot="card-content"]',
			) as HTMLElement;

			if (!cardContent) {
				return;
			}

			const cardHeight = cardContent.offsetHeight;
			const postHeight = post.offsetHeight;
			const postOffsetTop = post.offsetTop - cardContent.offsetTop;

			const marginAdjustment = (cardHeight - postHeight) / 2 - postOffsetTop;

			setPostMarginTop(marginAdjustment);
		};

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
	}, [setPostMarginTop, children]);

	return (
		<motion.div
			className={cn(
				"z-0 flex gap-x-2 border-b px-4 pt-3 transition-colors ease-snappy hover:bg-muted",
				className,
			)}
			ref={postRef}
		>
			<Avatar className={cn("size-10", hasSquareAvatar && "rounded")}>
				<AvatarImage src={avatar ?? fallbackUrl} />
			</Avatar>

			<div className="flex w-full flex-col gap-y-3 pb-3">
				<div className="flex w-full flex-col">
					<div className="flex h-5 w-full items-center justify-between">
						<div className="flex h-full items-center gap-1 overflow-hidden">
							<div className="flex h-full items-center gap-0.5">
								<span className="truncate font-bold text-base">
									{displayName}
								</span>
								{isPremium && (
									<Badge variant={handle === "@X" ? "golden" : "default"} />
								)}
							</div>
							<div className="flex gap-1 text-base text-muted-foreground">
								<span className="truncate">{handle}</span>
								<span>•</span>
								<span className="truncate">{createdAt}</span>
							</div>
						</div>
						<div className="flex gap-1 text-muted-foreground">
							{hasGrok && <Grok />}
							<MoreIcon className="size-[18.75px]" />
						</div>
					</div>
					{children ? (
						children
					) : (
						<p className="text-base leading-5">{content}</p>
					)}
				</div>

				<div className="flex items-center gap-1 text-muted-foreground">
					<div className="flex h-5 flex-1 items-center gap-1">
						<svg
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Reply</title>
							<path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
						</svg>
						{replyCount && (
							<p className="text-sm uppercase">{formatNumberToK(replyCount)}</p>
						)}
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<svg
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Like</title>
							<path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
						</svg>
						{repostCount && (
							<p className="text-sm uppercase">
								{formatNumberToK(repostCount)}
							</p>
						)}
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<svg
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Like</title>
							<path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
						</svg>
						{likeCount && (
							<p className="text-sm uppercase">{formatNumberToK(likeCount)}</p>
						)}
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<svg
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Views</title>
							<path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
						</svg>
						{viewsCount && (
							<p className="text-sm uppercase">{formatNumberToK(viewsCount)}</p>
						)}
					</div>

					<div className="flex items-center gap-2">
						<svg
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Bookmark</title>
							<path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
						</svg>
						<svg
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<title>Share</title>
							<path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
						</svg>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

const Badge = forwardRef<
	SVGSVGElement,
	SVGProps<SVGSVGElement> & { variant?: "default" | "golden" }
>(function Badge({ height = 18.75, variant = "default", ...props }, ref) {
	if (variant === "golden") {
		return (
			<svg
				height={height}
				ref={ref}
				viewBox="0 0 22 22"
				xmlns="http://www.w3.org/2000/svg"
				{...props}
			>
				<title>Verified account</title>
				<g>
					<linearGradient
						gradientUnits="userSpaceOnUse"
						id="41-a"
						x1="4.411"
						x2="18.083"
						y1="2.495"
						y2="21.508"
					>
						<stop offset="0" stopColor="#f4e72a" />
						<stop offset=".539" stopColor="#cd8105" />
						<stop offset=".68" stopColor="#cb7b00" />
						<stop offset="1" stopColor="#f4ec26" />
						<stop offset="1" stopColor="#f4e72a" />
					</linearGradient>
					<linearGradient
						gradientUnits="userSpaceOnUse"
						id="41-b"
						x1="5.355"
						x2="16.361"
						y1="3.395"
						y2="19.133"
					>
						<stop offset="0" stopColor="#f9e87f" />
						<stop offset=".406" stopColor="#e2b719" />
						<stop offset=".989" stopColor="#e2b719" />
					</linearGradient>
					<g clipRule="evenodd" fillRule="evenodd">
						<path
							d="M13.324 3.848L11 1.6 8.676 3.848l-3.201-.453-.559 3.184L2.06 8.095 3.48 11l-1.42 2.904 2.856 1.516.559 3.184 3.201-.452L11 20.4l2.324-2.248 3.201.452.559-3.184 2.856-1.516L18.52 11l1.42-2.905-2.856-1.516-.559-3.184zm-7.09 7.575l3.428 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
							fill="url(#41-a)"
						/>
						<path
							d="M13.101 4.533L11 2.5 8.899 4.533l-2.895-.41-.505 2.88-2.583 1.37L4.2 11l-1.284 2.627 2.583 1.37.505 2.88 2.895-.41L11 19.5l2.101-2.033 2.895.41.505-2.88 2.583-1.37L17.8 11l1.284-2.627-2.583-1.37-.505-2.88zm-6.868 6.89l3.429 3.428 5.683-6.206-1.347-1.247-4.4 4.795-2.072-2.072z"
							fill="url(#41-b)"
						/>
						<path
							d="M6.233 11.423l3.429 3.428 5.65-6.17.038-.033-.005 1.398-5.683 6.206-3.429-3.429-.003-1.405.005.003z"
							fill="#d18800"
						/>
					</g>
				</g>
			</svg>
		);
	}

	return (
		<svg
			fill="var(--selection-foreground)"
			height={height}
			ref={ref}
			viewBox="0 0 22 22"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>Badge</title>
			<path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
		</svg>
	);
});

const Grok = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function Grok(
	{ width = 18.75, ...props },
	ref,
) {
	return (
		<svg
			fill="currentColor"
			ref={ref}
			viewBox="0 0 33 32"
			width={width}
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>Grok</title>
			<path d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466" />
		</svg>
	);
});

const Icon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(function XIcon(
	{ height = 24, ...props },
	ref,
) {
	return (
		<svg
			fill="none"
			height={height}
			ref={ref}
			viewBox="0 0 1200 1227"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<title>X</title>
			<path
				d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
				fill="currentColor"
			/>
		</svg>
	);
});

export const X = Object.assign(Page, {
	Icon,
	Post,
});
