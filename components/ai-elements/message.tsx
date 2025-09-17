"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import {
	type HTMLMotionProps,
	motion,
	type Transition,
	type Variants,
} from "motion/react";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants: Variants = {
	animate: { filter: "blur(0px)", opacity: 1, scale: 1, y: 0 },
	exit: { filter: "blur(12px)", opacity: 0, scale: 0.9, y: "80dvh" },
	initial: { filter: "blur(12px)", opacity: 0, scale: 0.9, y: "80dvh" },
};

const transition: Transition = {
	default: { duration: 0.15 },
	duration: 0.5,
	ease: [0.32, 0.72, 0, 1],
	layout: { bounce: 0.4, duration: 1, type: "spring" },
};

interface MessageProps extends HTMLMotionProps<"div"> {
	from: UIMessage["role"];
	animate?: boolean;
}

function Message({ from, animate = false, className, ...props }: MessageProps) {
	return (
		<motion.div
			animate={animate ? "animate" : undefined}
			className={cn(
				"group/message px-4 data-user:pt-3 not-first:data-user:pt-12",
				className,
			)}
			exit={animate ? "exit" : undefined}
			initial={animate ? "initial" : undefined}
			transition={transition}
			variants={variants}
			{...props}
		/>
	);
}

function MessageContent({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"mx-auto flex w-full max-w-(--chat-content-max-width) flex-col @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] group-data-user/message:gap-1 group-not-data-user/message:group-data-scroll-padding/message:min-h-96",
				className,
			)}
			{...props}
		/>
	);
}

type MessageBubbleProps = HTMLAttributes<HTMLDivElement>;

function MessageBubble({ className, ...props }: MessageBubbleProps) {
	return (
		<div className="flex flex-col group-data-user/message:items-end">
			<div
				className={cn(
					"max-w-7/10 rounded-xl bg-muted px-4 py-1.5 data-multiline:py-3",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

export { Message, MessageBubble, MessageContent };
