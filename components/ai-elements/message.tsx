"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { motion } from "motion/react";
import type { ComponentProps, HTMLAttributes } from "react";
import { cn } from "~/lib/utils";

interface MessageProps extends ComponentProps<"div"> {
	from: UIMessage["role"];
}

function Message({ from, className, ...props }: MessageProps) {
	return (
		<div
			className={cn(
				"group/message px-4 data-user:pt-3 not-first:data-user:pt-12",
				className,
			)}
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
					"w-fit max-w-7/10 rounded-xl bg-message px-4 py-1.5 text-message-foreground data-multiline:py-3",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

function MessageThinking({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("w-fit rounded-xl bg-muted px-4 py-3", className)}
			{...props}
		>
			<div className="flex gap-1.5 text-muted-foreground">
				{[1, 2, 3].map((dot) => (
					<motion.div
						animate={{ opacity: [0.3, 1, 0.3] }}
						className="size-2 shrink-0 rounded-full bg-current"
						key={dot}
						transition={{
							delay: (dot - 1) * 0.3,
							duration: 2,
							repeat: Infinity,
						}}
					/>
				))}
			</div>
		</div>
	);
}

export { Message, MessageBubble, MessageContent, MessageThinking };
