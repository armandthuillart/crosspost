"use client";

import { AnimatePresence, motion } from "motion/react";
import { type ComponentProps, memo, useCallback } from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ArrowDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function Conversation({
	className,
	children,
	...props
}: ComponentProps<"div">) {
	return (
		<div className="-mb-7 flex h-full overflow-hidden" {...props}>
			<StickToBottom
				className={cn("relative flex-1 overflow-y-auto", className)}
				initial="smooth"
				resize="smooth"
			>
				{children}
			</StickToBottom>
		</div>
	);
}

function ConversationContent({
	className,
	...props
}: StickToBottom.ContentProps) {
	return (
		<StickToBottom.Content
			className={cn("flex w-full flex-col overflow-hidden pb-34", className)}
			{...props}
		/>
	);
}

function PureConversationScrollButton({ className, ...props }: ButtonProps) {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();

	const handleScroll = useCallback(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	return (
		<AnimatePresence>
			{!isAtBottom && (
				<motion.div
					animate={{ opacity: 1, scale: 1 }}
					className="origin-bottom"
					exit={{ opacity: 0, scale: 0 }}
					initial={{ opacity: 0, scale: 0 }}
					transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
				>
					<Button
						className={cn(
							"-translate-x-1/2 absolute bottom-12 left-1/2 z-20 rounded-full",
							className,
						)}
						onClick={handleScroll}
						size="icon"
						variant="outline"
						{...props}
					>
						<ArrowDownIcon className="size-5" />
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

const ConversationScrollButton = memo(PureConversationScrollButton);

export { Conversation, ConversationContent, ConversationScrollButton };
