"use client";

import { useAtom } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import {
	type ComponentProps,
	memo,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { Button, type ButtonProps } from "~/components/ui/button";
import { ScrollIcon } from "~/components/ui/icons";
import { showBannerAtom } from "~/lib/atoms";
import { cn } from "~/lib/utils";

function Conversation({
	className,
	children,
	...props
}: ComponentProps<"div">) {
	return (
		<div className="-mb-7 flex h-full overflow-hidden" {...props}>
			<StickToBottom
				className={cn("relative flex-1 overflow-y-auto", className)}
				initial="instant"
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
			className={cn(
				"flex w-full flex-col overflow-hidden @7xl/chat:pt-26 pb-34",
				className,
			)}
			{...props}
		/>
	);
}

function PureConversationScrollButton({ className, ...props }: ButtonProps) {
	const { isAtBottom, scrollToBottom } = useStickToBottomContext();

	const [isVisible] = useAtom(showBannerAtom);

	const handleScroll = useCallback(() => {
		scrollToBottom();
	}, [scrollToBottom]);

	return (
		<AnimatePresence>
			{!isAtBottom && (
				<motion.div
					animate={{ opacity: 1 }}
					className="origin-bottom"
					exit={{ opacity: 0 }}
					initial={{ opacity: 0 }}
					transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
				>
					<Button
						className={cn(
							"-translate-x-1/2 absolute bottom-12 left-1/2 z-20 rounded-full hover:bg-muted",
							isVisible && "bottom-32",
							className,
						)}
						onClick={handleScroll}
						size="icon"
						variant="secondary"
						{...props}
					>
						<ScrollIcon className="size-5" />
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

const ConversationScrollButton = memo(PureConversationScrollButton);

interface ConversationLoadMoreButtonProps {
	loadMore: (numItems: number) => void;
	canLoadMore: boolean;
	isLoadingMore: boolean;
}

function ConversationAutoLoadOnTop({
	isLoadingMore,
	canLoadMore,
	loadMore,
}: ConversationLoadMoreButtonProps) {
	const { scrollRef } = useStickToBottomContext();
	const loadingRef = useRef(false);

	useEffect(() => {
		if (!isLoadingMore) {
			loadingRef.current = false;
		}
	}, [isLoadingMore]);

	useEffect(() => {
		const el = scrollRef?.current;

		if (!el) {
			return;
		}

		const onScroll = () => {
			const scrollTop = el.scrollTop;

			if (scrollTop <= 24 && canLoadMore && !loadingRef.current) {
				loadingRef.current = true;
				loadMore(10);
			}
		};

		el.addEventListener("scroll", onScroll, { passive: true });

		return () => {
			el.removeEventListener("scroll", onScroll);
		};
	}, [canLoadMore, loadMore, scrollRef]);

	return null;
}

export {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
	ConversationAutoLoadOnTop,
};
