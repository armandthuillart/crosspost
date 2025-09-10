"use client";

import type { UIMessage } from "@convex-dev/agent/react";
import { type HTMLMotionProps, motion, type Variants } from "motion/react";
import {
	type ChangeEvent,
	type HTMLAttributes,
	useEffect,
	useRef,
	useState,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const variants: Variants = {
	animate: {
		filter: "blur(0px)",
		opacity: 1,
		y: 0,
	},
	exit: {
		filter: "blur(12px)",
		opacity: 0,
		y: "80dvh",
	},
	initial: {
		filter: "blur(12px)",
		opacity: 0,
		y: "80dvh",
	},
};

interface MessageProps extends HTMLMotionProps<"div"> {
	from: UIMessage["role"];
	hasScrollPadding: boolean;
}

function Message({
	from,
	className,
	hasScrollPadding,
	...props
}: MessageProps) {
	return (
		<motion.div
			animate={from === "user" && "animate"}
			className={cn(
				"group/message px-4 data-[role=user]:pt-3 not-first:data-[role=user]:pt-12",
				hasScrollPadding && "min-h-96",
				className,
			)}
			data-role={from}
			exit={from === "user" ? "exit" : undefined}
			initial={from === "user" && "initial"}
			transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
			variants={variants}
			{...props}
		/>
	);
}

function MessageContent({
	children,
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"mx-auto flex w-full max-w-(--chat-content-max-width) flex-col @[34rem]:[--chat-content-max-width:40rem] @[64rem]:[--chat-content-max-width:48rem] [--chat-content-max-width:32rem] group-data-[role=assistant]/message:group-data-[scroll-padding=true]/message:min-h-96 group-data-[role=user]/message:gap-1",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

type MessageBubbleProps = HTMLAttributes<HTMLDivElement>;

function MessageBubble({ children, className, ...props }: MessageBubbleProps) {
	return (
		<div className="flex flex-col group-data-[role=user]/message:items-end">
			<div
				className={cn(
					"max-w-7/10 rounded-message bg-muted px-4 py-1.5 data-[multiline=true]:py-3",
					className,
				)}
				{...props}
			>
				<div>{children}</div>
			</div>
		</div>
	);
}

interface MessageEditorProps extends HTMLAttributes<HTMLDivElement> {
	message: UIMessage;
	onCancel: () => void;
}

function MessageEditor({
	message,
	onCancel,
	className,
	...props
}: MessageEditorProps) {
	// const deleteMessagesAtOrAfterMessage = useMutation(
	// 	api.streaming.deleteMessagesAtOrAfterMessage,
	// );

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const [draftContent, setDraftContent] = useState(message.text);

	// biome-ignore lint/correctness/useExhaustiveDependencies: No need to re-run.
	useEffect(() => {
		if (textareaRef.current) {
			adjustHeight();
			const textLength = draftContent.length;
			textareaRef.current.setSelectionRange(textLength, textLength);
			textareaRef.current.focus();
		}
	}, []);

	const adjustHeight = () => {
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
		}
	};

	function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
		setDraftContent(event.target.value);
		adjustHeight();
	}

	// async function handleSend() {
	// 	await deleteMessagesAtOrAfterMessage({
	// 		messageId: message.id as Id<"messages">,
	// 	});

	// 	setMessages((messages) => {
	// 		const index = messages.findIndex((m) => m.id === message.id);
	// 		if (index !== -1) {
	// 			const updatedMessage: MyMessage = {
	// 				...message,
	// 				parts: [{ text: draftContent, type: "text" }],
	// 			};
	// 			return [...messages.slice(0, index), updatedMessage];
	// 		}
	// 		return messages;
	// 	});

	// 	onCancel();
	// 	regenerate();
	// }

	// function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
	// 	const isShift = event.shiftKey;
	// 	const isComposing = event.nativeEvent.isComposing;
	// 	const hasSubmitted = event.key === "Enter";
	// 	const hasCancelled = event.key === "Escape";

	// 	if (hasSubmitted && !isShift && !isComposing) {
	// 		event.preventDefault();
	// 		handleSend();
	// 	} else if (hasCancelled) {
	// 		onCancel();
	// 	}
	// }

	return (
		<div
			className={cn(
				"flex w-full flex-col gap-2 rounded-3xl bg-muted p-3",
				className,
			)}
			{...props}
		>
			<textarea
				className="min-h-12 resize-none rounded-none border-none bg-transparent p-2 pb-0 text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
				onChange={handleChange}
				// onKeyDown={handleKeyDown}
				ref={textareaRef}
				value={draftContent}
			/>
			<div className="flex justify-end gap-2">
				<Button
					className="rounded-full px-3"
					onClick={onCancel}
					variant="outline"
				>
					Cancel
				</Button>
				<Button className="rounded-full px-3">Send</Button>
			</div>
		</div>
	);
}

export { Message, MessageBubble, MessageEditor, MessageContent };
