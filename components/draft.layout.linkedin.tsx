"use client";

import { atom, useAtom } from "jotai";
import { motion } from "motion/react";
import {
	type ComponentProps,
	type ReactNode,
	useCallback,
	useLayoutEffect,
	useRef,
} from "react";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const postMarginTopAtom = atom<number>(0);

function Page({ children, className, ...props }: ComponentProps<"div">) {
	const [postMarginTop] = useAtom(postMarginTopAtom);

	return (
		<div
			className={cn(
				"mx-auto flex w-full max-w-138.75 flex-col gap-2",
				className,
			)}
			data-feed
			style={{ marginTop: postMarginTop }}
			{...props}
		>
			<Post
				avatar="https://media.licdn.com/dms/image/v2/C560BAQHaVYd13rRz3A/company-logo_200_200/company-logo_200_200/0/1638831590218/linkedin_logo?e=1762387200&v=beta&t=94MZ61zXYUsTUPobMzFL1GhmOwbJiBT1D-MZ7RlROMI"
				content="A reminder for today and every day: you are so much more than your job title."
				createdAt="1 week"
				displayName="LinkedIn"
				hasSquareAvatar
				likeCount={300}
				replyCount={100}
				repostCount={10}
			/>
			<Post
				avatar="https://media.licdn.com/dms/image/v2/C560BAQHaVYd13rRz3A/company-logo_200_200/company-logo_200_200/0/1638831590218/linkedin_logo?e=1762387200&v=beta&t=94MZ61zXYUsTUPobMzFL1GhmOwbJiBT1D-MZ7RlROMI"
				content="Work isn’t the point. But it can make the point possible."
				createdAt="8d"
				displayName="LinkedIn"
				hasSquareAvatar
				likeCount={200}
				replyCount={40}
				repostCount={15}
			/>
			{children}
			<Post
				avatar="https://media.licdn.com/dms/image/v2/C560BAQHaVYd13rRz3A/company-logo_200_200/company-logo_200_200/0/1638831590218/linkedin_logo?e=1762387200&v=beta&t=94MZ61zXYUsTUPobMzFL1GhmOwbJiBT1D-MZ7RlROMI"
				content="Performance should not be measured by how many hours you sit at a desk."
				createdAt="6d"
				displayName="LinkedIn"
				hasSquareAvatar
				likeCount={180}
				replyCount={100}
				repostCount={40}
			/>
			<Post
				avatar="https://media.licdn.com/dms/image/v2/C560BAQHaVYd13rRz3A/company-logo_200_200/company-logo_200_200/0/1638831590218/linkedin_logo?e=1762387200&v=beta&t=94MZ61zXYUsTUPobMzFL1GhmOwbJiBT1D-MZ7RlROMI"
				content="Today we’re celebrating National hashtag#AIinWork Day — a day to help you build the skills to thrive in an AI-powered workplace. Explore free learning resources, get practical tips, and see how to get started here: https://lnkd.in/aiinwork"
				createdAt="3d"
				displayName="LinkedIn"
				hasSquareAvatar
				likeCount={130}
				replyCount={100}
				repostCount={405}
			/>
		</div>
	);
}

interface PostProps {
	avatar?: string;
	content?: string;
	children?: ReactNode;
	className?: string;
	likeCount?: number;
	createdAt?: string;
	replyCount?: number;
	repostCount?: number;
	displayName?: string;
	hasSquareAvatar?: boolean;
}

function Post({
	avatar,
	content,
	children,
	className,
	likeCount = 50,
	createdAt = "now",
	replyCount = 20,
	displayName = "You",
	repostCount = 10,
	hasSquareAvatar,
}: PostProps) {
	const postRef = useRef<HTMLDivElement>(null);
	const [, setPostMarginTop] = useAtom(postMarginTopAtom);

	const centerPost = useCallback(() => {
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

	return (
		<motion.div
			className={cn(
				"@container/post relative rounded-lg border bg-card",
				className,
			)}
			ref={postRef}
		>
			<div className="flex items-center gap-2 pt-3 pr-18 pb-2 pl-4">
				<Avatar className={cn("size-12", hasSquareAvatar && "rounded-none")}>
					{avatar ? <AvatarImage src={avatar} /> : <AvatarIcon />}
				</Avatar>

				<div className="flex flex-col">
					<div className="font-semibold text-base/4.75">{displayName}</div>
					<div className="text-muted-foreground text-xs/3.75">Entrepreneur</div>
					<div className="text-muted-foreground text-xs/4">
						{createdAt} •{" "}
						<svg
							aria-hidden="true"
							className="inline align-sub"
							fill="currentColor"
							height="16"
							viewBox="0 0 16 16"
							width="16"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z" />
						</svg>
					</div>
				</div>
			</div>

			<div className="absolute top-1 right-2 flex"></div>

			<div className="flex w-full px-4 pb-2">
				<div className="flex w-full flex-col">
					{children ? children : <p className="text-sm leading-5">{content}</p>}
				</div>
			</div>

			<div className="px-4">
				<div className="flex h-8 items-center justify-between border-input border-b">
					<div className="flex items-center">
						<LikeIcon />
						<CongratsIcon />
						<LoveIcon />
						<span className="pl-1 text-black/60 text-sm dark:text-white/60">
							You and {likeCount} others
						</span>
					</div>
					<span className="pl-1 text-black/60 text-sm dark:text-white/60">
						{replyCount} comments · {repostCount} reposts
					</span>
				</div>
			</div>

			<div className="flex gap-1 px-4 py-1">
				<Button
					className="h-10 w-full gap-0.5 rounded font-semibold text-sm"
					variant="ghost"
				>
					<svg
						aria-hidden="true"
						fill="none"
						height="20"
						viewBox="0 0 24 24"
						width="20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M10.5213 8.05294L10.7875 8.86242C11.0058 9.52573 11.115 9.85735 11.031 10.1193C10.9632 10.3312 10.8141 10.5139 10.611 10.6341C10.36 10.7826 9.98037 10.7826 9.22092 10.7826H8.81697C6.24687 10.7826 4.96183 10.7826 4.35493 11.4987C4.28548 11.5804 4.22383 11.6674 4.17043 11.7587C3.70348 12.5573 4.23433 13.633 5.29603 15.7845C6.27027 17.7588 6.75747 18.746 7.66197 19.3271C7.74957 19.3834 7.83957 19.4365 7.93167 19.4863C8.88402 20 10.0639 20 12.4236 20H12.9354C15.7943 20 17.2237 20 18.1119 19.19C19 18.3801 19 17.0765 19 14.4696V13.5532C19 12.1832 19 11.4981 18.7417 10.8712C18.4833 10.2441 17.9886 9.72858 16.9993 8.6975L12.9079 4.43346C12.8053 4.32653 12.754 4.27306 12.7087 4.236C12.2865 3.89015 11.6347 3.92907 11.2656 4.32221C11.2261 4.36433 11.1828 4.42344 11.0964 4.54168C10.9612 4.72664 10.8936 4.81911 10.8346 4.91073C10.3072 5.73094 10.1476 6.70528 10.3893 7.63025C10.4163 7.73355 10.4512 7.84008 10.5213 8.05294Z"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
						/>
					</svg>
					<span className="@max-md/post:hidden">Like</span>
				</Button>

				<Button
					className="h-10 w-full rounded font-semibold text-sm"
					variant="ghost"
				>
					<svg
						aria-hidden="true"
						color="currentColor"
						fill="none"
						height="20"
						viewBox="0 0 24 24"
						width="20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M8 13.5H16M8 8.5H12"
							stroke="currentColor"
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
						/>
						<path
							d="M6.09881 19C4.7987 18.8721 3.82475 18.4816 3.17157 17.8284C2 16.6569 2 14.7712 2 11V10.5C2 6.72876 2 4.84315 3.17157 3.67157C4.34315 2.5 6.22876 2.5 10 2.5H14C17.7712 2.5 19.6569 2.5 20.8284 3.67157C22 4.84315 22 6.72876 22 10.5V11C22 14.7712 22 16.6569 20.8284 17.8284C19.6569 19 17.7712 19 14 19C13.4395 19.0125 12.9931 19.0551 12.5546 19.155C11.3562 19.4309 10.2465 20.0441 9.14987 20.5789C7.58729 21.3408 6.806 21.7218 6.31569 21.3651C5.37769 20.6665 6.29454 18.5019 6.5 17.5"
							stroke="currentColor"
							strokeLinecap="round"
							strokeWidth="2"
						/>
					</svg>
					<span className="@max-md/post:hidden">Comment</span>
				</Button>

				<Button
					className="h-10 w-full rounded font-semibold text-sm"
					variant="ghost"
				>
					<svg
						aria-hidden="true"
						color="currentColor"
						fill="none"
						height="20"
						viewBox="0 0 24 24"
						width="20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M3.31245 15.9844C1.62328 13.7974 1.52213 10.263 3.36893 7.90974C5.21573 5.55645 6.8522 4.97575 10.5565 4.97575C13.3938 4.97575 17.0435 4.9878 18.7683 4.9878M15.0229 2.02051L18.2839 4.81639"
							stroke="currentColor"
							strokeLinejoin="bevel"
							strokeWidth="2"
						/>
						<path
							d="M20.7196 8.05413C22.4088 10.2412 22.51 13.7756 20.6632 16.1288C18.8164 18.4821 17.1799 19.0628 13.4756 19.0628C10.6383 19.0628 6.98856 19.0508 5.26376 19.0508M9.00916 22.0181L5.7482 19.2222"
							stroke="currentColor"
							strokeLinejoin="bevel"
							strokeWidth="2"
						/>
					</svg>
					<span className="@max-md/post:hidden">Repost</span>
				</Button>

				<Button
					className="h-10 w-full rounded font-semibold text-sm"
					variant="ghost"
				>
					<svg
						aria-hidden="true"
						color="currentColor"
						fill="none"
						height="20"
						viewBox="0 0 24 24"
						width="20"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M15.2014 21.4996L21.5 2.5L2.50001 8.551L11.5065 12.4935L15.2014 21.4996Z"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="2"
						/>
						<path
							d="M11.4999 12.5L14.9999 9"
							stroke="currentColor"
							strokeLinejoin="round"
							strokeWidth="2"
						/>
					</svg>
					<span className="@max-md/post:hidden">Send</span>
				</Button>
			</div>
		</motion.div>
	);
}

export const LinkedIn = Object.assign(Page, {
	Post,
});

function LoveIcon() {
	return (
		<svg
			aria-hidden="true"
			className="-ml-1 rounded-full bg-card"
			height="16"
			viewBox="0 0 16 16"
			width="16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g>
				<path
					d="M8 0a8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8z"
					fill="none"
				/>
				<circle cx="8" cy="8" fill="#df704d" r="7" />
				<path
					d="M7.71 5A2.64 2.64 0 004 8.75l4 4 4-4A2.64 2.64 0 0012 5a2.61 2.61 0 00-1.85-.77h0A2.57 2.57 0 008.3 5l-.3.3z"
					fill="#fff3f0"
					fillRule="evenodd"
					stroke="#77280c"
				/>
				<path
					d="M11.43 5.18a2 2 0 01.53.63c.9 1.67-.6 2.72-1.54 3.67-.6.61-1.22 1.22-1.85 1.8M5.79 4.81a2.1 2.1 0 00-.79.11 1.8 1.8 0 00-1 .82A2.6 2.6 0 003.77 7v.09"
					fill="none"
				/>
				<path
					d="M7.71 5A2.6 2.6 0 004 5a2.66 2.66 0 000 3.7l4 4 4-4A2.66 2.66 0 0012 5a2.58 2.58 0 00-1.85-.78h0A2.58 2.58 0 008.3 5l-.3.25z"
					fill="none"
					stroke="#77280c"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}

function LikeIcon() {
	return (
		<svg
			aria-hidden="true"
			className="rounded-full bg-card"
			height="16"
			viewBox="0 0 16 16"
			width="16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g>
				<path
					d="M8 0a8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8z"
					fill="none"
				/>
				<circle cx="8" cy="8" fill="#378fe9" r="7" />
				<path
					d="M11.93 7.25h-.55c-.05 0-.15-.19-.4-.46-.37-.4-.78-.91-1.07-1.19a7.13 7.13 0 01-1.73-2.24c-.24-.51-.26-.74-.75-.74a.78.78 0 00-.67.81c0 .14.07.63.1.8a7.54 7.54 0 001 2.2H4.12a.88.88 0 00-.65.28.84.84 0 00-.23.66.91.91 0 00.93.85h.16a.82.82 0 00-.55.24.77.77 0 00-.21.54.81.81 0 00.74.8.8.8 0 00.33 1.42.76.76 0 00-.09.55.87.87 0 00.85.63h2.29a3.8 3.8 0 00.89-.11l1.42-.4h1.9c1.02-.04 1.29-4.64.03-4.64z"
					fill="#d0e8ff"
					fillRule="evenodd"
				/>
				<path
					d="M7.43 6.43H4.11a.88.88 0 00-.88 1 .92.92 0 00.93.84h.16a.82.82 0 00-.55.24.77.77 0 00-.21.56.83.83 0 00.74.81.81.81 0 00-.31.63.81.81 0 00.65.8.78.78 0 00-.09.56.86.86 0 00.85.62h2.29a3.8 3.8 0 00.89-.11l1.42-.47h1.9c1 0 1.27-4.64 0-4.64a5 5 0 01-.55 0s-.15-.19-.4-.46h0c-.37-.4-.78-.91-1.07-1.19a7.08 7.08 0 01-1.7-2.25 2.14 2.14 0 00-.32-.52.83.83 0 00-1.16.09 1.39 1.39 0 00-.25.38 1.71 1.71 0 00-.09.3 2.38 2.38 0 00.07.84 4.12 4.12 0 00.27.84 6.65 6.65 0 00.66 1 .18.18 0 01.07.08"
					fill="none"
					stroke="#004182"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</g>
		</svg>
	);
}

function CongratsIcon() {
	return (
		<svg
			aria-hidden="true"
			className="-ml-1 rounded-full bg-card"
			height="16"
			viewBox="0 0 16 16"
			width="16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<mask
					height="16"
					id="reactions-praise-consumption-small-a"
					maskUnits="userSpaceOnUse"
					width="16"
					x="0"
					y="0"
				>
					<path
						d="M8 1a7 7 0 017 7 7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7z"
						fill="#fff"
						fillRule="evenodd"
					/>
				</mask>
			</defs>
			<g>
				<path
					d="M8 0a8 8 0 018 8 8 8 0 01-8 8 8 8 0 01-8-8 8 8 0 018-8z"
					fill="none"
				/>
				<g>
					<path
						d="M8 1a7 7 0 017 7 7 7 0 01-7 7 7 7 0 01-7-7 7 7 0 017-7z"
						fill="#d8d8d8"
					/>
				</g>
				<g mask="url(#reactions-praise-consumption-small-a)">
					<circle cx="8" cy="8" fill="#6dae4f" r="7" />
					<path
						d="M8 1a7 7 0 11-7 7 7 7 0 017-7zm0-1a8 8 0 105.66 2.34A8 8 0 008 0z"
						fill="#fff"
					/>
					<path
						d="M12.13 9.22a9.19 9.19 0 00-.36-2.32A4.29 4.29 0 0110.44 5c-.16-.53-.27-.72-.74-.73a.74.74 0 00-.65.8c0 .24 0 .49.06.72a11.5 11.5 0 00.58 1.92l-4.5-3.38a.75.75 0 00-1.11.07.73.73 0 00.27 1L6.6 7.1l.59.56L3.62 5a.71.71 0 00-.75-.16.69.69 0 00-.46.61.71.71 0 00.36.67L5 7.77l1.35 1-2.9-2.19a.79.79 0 00-.57-.21.8.8 0 00-.54.28c-.31.4-.06.81.26 1.06L4.85 9.4l1.15.85-2.27-1.7a.74.74 0 00-1.09 0 .76.76 0 00.24 1.09l4.1 3c.6.45 2.07.84 2.72.27"
						fill="none"
						stroke="#165209"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
					/>
					<path
						d="M12.61 9.9l-.42-.37a6.69 6.69 0 00-.51-2.14A5.73 5.73 0 0110.47 5c-.16-.53-.27-.72-.74-.73a.74.74 0 00-.65.8c0 .24 0 .49.06.72a8.88 8.88 0 00.55 1.84l-.19-.1-4.31-3.31a.75.75 0 00-1.11.07.73.73 0 00-.1.59.71.71 0 00.37.47L6.55 7l.64.51-3.57-2.67a.74.74 0 00-.57-.21.77.77 0 00-.54.27.77.77 0 00-.1.59.74.74 0 00.36.51L5 7.66l1.35 1-2.9-2.18a.75.75 0 00-.57-.22.76.76 0 00-.54.28.73.73 0 00.26 1.06l2.25 1.69 1.15.85-2.27-1.69a.73.73 0 00-.54-.25.77.77 0 00-.55.25.74.74 0 00.24 1.08L7 12.64a2.68 2.68 0 002.08.51 1.15 1.15 0 001.41 0c.6-.46.41-.51.85-1.13a10.92 10.92 0 001.27-2.12z"
						fill="#dcf0cb"
						fillRule="evenodd"
					/>
					<path
						d="M12.13 9.22a9.19 9.19 0 00-.36-2.32A4.29 4.29 0 0110.44 5c-.16-.53-.27-.72-.74-.73a.74.74 0 00-.65.8c0 .24 0 .49.06.72a11.5 11.5 0 00.58 1.92l-4.5-3.38a.75.75 0 00-1.11.07.73.73 0 00.27 1L6.6 7.1l.59.56L3.62 5a.71.71 0 00-.75-.16.69.69 0 00-.46.61.71.71 0 00.36.67L5 7.77l1.35 1-2.9-2.19a.79.79 0 00-.57-.21.8.8 0 00-.54.28c-.31.4-.06.81.26 1.06L4.85 9.4l1.15.85-2.27-1.7a.74.74 0 00-1.09 0 .76.76 0 00.24 1.09l4.1 3a4.48 4.48 0 002.72.62"
						fill="none"
						stroke="#165209"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth=".5"
					/>
					<path
						d="M14.77 11.39a2.23 2.23 0 01-.46-.75 3.65 3.65 0 00-.1-.65 2.39 2.39 0 00-.36-1.08 5.85 5.85 0 01-1.21-2.38c-.16-.53-.27-.72-.74-.73a.74.74 0 00-.5.26.73.73 0 00-.15.54 4.37 4.37 0 00.06.72c.18.92.37 1.68.39 1.73L7.41 5.84a.76.76 0 00-.57-.22.72.72 0 00-.54.29.73.73 0 00.26 1l2.25 1.7.68.56-3.6-2.71a.76.76 0 00-.57-.22A.71.71 0 005 7.58l2.25 1.7 1.35 1-2.89-2.19a.73.73 0 00-1.1.08c-.31.4-.07.81.26 1.06l2.25 1.68 1.12.85L6 10.06a.72.72 0 00-1 0 .7.7 0 00-.14.58.74.74 0 00.34.49l4 3a2.74 2.74 0 001.13.5l.58.09a2.48 2.48 0 01.87.29.83.83 0 00.6 0 3.87 3.87 0 001.77-1.29 3.8 3.8 0 00.7-2 1 1 0 000-.42z"
						fill="none"
						stroke="#165209"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="1.5"
					/>
					<path
						d="M14.81 11.34l-.45-.34a6.57 6.57 0 00-.51-2.14 5.85 5.85 0 01-1.21-2.38c-.16-.53-.27-.72-.74-.73a.74.74 0 00-.5.26.73.73 0 00-.15.54 4.37 4.37 0 00.06.72c.18.93.37 1.69.39 1.73L7.41 5.79a.75.75 0 00-1.11.07c-.31.41-.06.81.26 1.06l2.25 1.69.68.56-3.6-2.76a.75.75 0 00-1.11.07c-.31.4-.06.81.26 1.06l2.25 1.69 1.35 1L5.71 8a.72.72 0 00-.57-.21.7.7 0 00-.53.28.72.72 0 00-.12.59.74.74 0 00.38.47l2.25 1.69 1.12.85L6 10a.7.7 0 00-1 0 .71.71 0 00-.16.6.72.72 0 00.36.51l4 3a4.23 4.23 0 002 .59 6.68 6.68 0 00.8.41 3.23 3.23 0 002-1.26 4.93 4.93 0 00.86-2.57z"
						fill="#ddf6d1"
						fillRule="evenodd"
					/>
					<path
						d="M5.14 10.32c.57.43 4.43 3.43 4.89 3.59a2.18 2.18 0 001.47 0 1.6 1.6 0 00.5-.31"
						fill="none"
					/>
					<path
						d="M14.77 11.39a2.23 2.23 0 01-.46-.75 3.65 3.65 0 00-.1-.65 2.39 2.39 0 00-.36-1.08 5.85 5.85 0 01-1.21-2.38c-.16-.53-.27-.72-.74-.73a.74.74 0 00-.5.26.73.73 0 00-.15.54 4.37 4.37 0 00.06.72c.18.92.37 1.68.39 1.73L7.41 5.84a.76.76 0 00-.57-.22.72.72 0 00-.54.29.73.73 0 00.26 1l2.25 1.7.68.56-3.6-2.71a.76.76 0 00-.57-.22A.71.71 0 005 7.58l2.25 1.7 1.35 1-2.89-2.19a.73.73 0 00-1.1.08c-.31.4-.07.81.26 1.06l2.25 1.68 1.12.85L6 10.06a.72.72 0 00-1 0 .7.7 0 00-.14.58.74.74 0 00.34.49l4 3a2.74 2.74 0 001.13.5l.58.09a2.48 2.48 0 01.87.29.83.83 0 00.6 0 3.87 3.87 0 001.77-1.29 3.8 3.8 0 00.7-2 1 1 0 000-.42z"
						fill="none"
						stroke="#165209"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth=".5"
					/>
					<path
						d="M8.83 2.82l-.73.92"
						fill="none"
						stroke="#165209"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M5.49 1.62l.07 1.2"
						fill="none"
						stroke="#165209"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M7.54 1.63l-.65 1.56"
						fill="none"
						stroke="#165209"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</g>
			</g>
		</svg>
	);
}

function AvatarIcon() {
	return (
		<svg
			aria-hidden="true"
			viewBox="0 0 128 128"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				className="fill-[#e7e2dc] dark:fill-[#38434f]"
				d="M0 0h128v128H0z"
			/>
			<path
				d="M88.41 84.67a32 32 0 10-48.82 0 66.13 66.13 0 0148.82 0z"
				fill="#788fa5"
			/>
			<path
				d="M88.41 84.67a32 32 0 01-48.82 0A66.79 66.79 0 000 128h128a66.79 66.79 0 00-39.59-43.33z"
				fill="#9db3c8"
			/>
			<path
				d="M64 96a31.93 31.93 0 0024.41-11.33 66.13 66.13 0 00-48.82 0A31.93 31.93 0 0064 96z"
				fill="#56687a"
			/>
		</svg>
	);
}
