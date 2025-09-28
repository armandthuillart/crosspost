"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import { type ComponentProps, memo } from "react";
import { ArrowUpIcon, StopIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../ui/button";

function PromptInput({
	children,
	className,
	...props
}: HTMLMotionProps<"form">) {
	return (
		<motion.form
			className="group/prompt-input overflow-hidden not-dark:border bg-background transition-[box-shadow,border-color,background-color] ease-snappy not-dark:has-focus-visible:border-input has-focus-visible:shadow-xs dark:bg-muted"
			layout
			layoutId="prompt-input-outer"
			style={{ borderRadius: 28 }}
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
			{...props}
		>
			<motion.div
				className="grid grid-cols-[auto_1fr_auto] p-2.5 [grid-template-areas:'left_center_right'] group-data-expanded/prompt-input:[grid-template-areas:'center_center_center''left_void_right']"
				layoutId="prompt-input-inner"
				transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
			>
				{children}
			</motion.div>
		</motion.form>
	);
}

function PromptInputTextarea({
	className,
	...props
}: HTMLMotionProps<"textarea">) {
	return (
		<motion.div
			className={cn(
				"-my-2.5 flex min-h-14 w-full px-2.5 [grid-area:center]",
				className,
			)}
			layout="position"
			layoutId="prompt-input-textarea-container"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
		>
			<motion.textarea
				className={cn(
					"my-4 max-h-52 w-full resize-none antialiased outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-0",
					className,
				)}
				layout="position"
				layoutId="prompt-input-textarea-content"
				name="prompt"
				rows={1}
				transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
				{...props}
			/>
		</motion.div>
	);
}

function PurePromptInputSubmit({
	className,
	...props
}: ComponentProps<"button">) {
	return (
		<motion.div
			className="h-9 [grid-area:right]"
			layout="position"
			layoutId="prompt-input-submit"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
		>
			<Button className="rounded-full" size="icon" type="submit" {...props}>
				<ArrowUpIcon className="size-5" />
			</Button>
		</motion.div>
	);
}

const PromptInputSubmit = memo(PurePromptInputSubmit);

function PromptInputStop({ className, ...props }: ComponentProps<"button">) {
	return (
		<motion.div
			className="h-9 [grid-area:right]"
			layout="position"
			layoutId="prompt-input-stop"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
		>
			<Button
				className="rounded-full"
				size="icon"
				type="button"
				variant="secondary"
				{...props}
			>
				<StopIcon className="size-5" />
			</Button>
		</motion.div>
	);
}

function PromptInputButton({ children, className, ...props }: ButtonProps) {
	return (
		<motion.div
			className="h-9 [grid-area:left]"
			layout="position"
			layoutId="prompt-input-button"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
		>
			<Button
				className="rounded-full"
				size="icon"
				type="button"
				variant="ghost"
				{...props}
			>
				{children}
			</Button>
		</motion.div>
	);
}

export {
	PromptInput,
	PromptInputStop,
	PromptInputButton,
	PromptInputSubmit,
	PromptInputTextarea,
};
