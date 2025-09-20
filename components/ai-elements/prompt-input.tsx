"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import { memo } from "react";
import { ArrowUpIcon, StopIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function PromptInput({ className, ...props }: HTMLMotionProps<"form">) {
	return (
		<motion.form
			className={cn(
				"group/prompt-input grid grid-cols-[auto_1fr_auto] gap-x-2 rounded-4xl not-dark:border bg-background p-2.5 shadow-2xs transition-colors duration-250 ease-snappy not-dark:has-focus-visible:border-input has-focus-visible:shadow-xs data-[state=collapsed]:min-h-14 data-[state=collapsed]:pl-3.5 dark:bg-muted data-[state=collapsed]:[grid-template-areas:'tool_input_action'] data-[state=expanded]:[grid-template-areas:'input_input_input''tool_footer_action']",
				className,
			)}
			layoutId="prompt-input"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
			{...props}
		/>
	);
}

function PromptInputTextarea({
	className,
	...props
}: HTMLMotionProps<"textarea">) {
	return (
		<motion.div
			className={cn(
				"-mt-2.5 group-not-data-[state=expanded]/prompt-input:-mb-2.5 flex w-full [grid-area:input] group-data-[state=expanded]/prompt-input:px-2.5",
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
}: HTMLMotionProps<"button">) {
	return (
		<motion.button
			className={cn(
				"disabled:!pointer-events-none disabled:!opacity-50 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-none transition-all duration-500 ease-snappy [grid-area:action]",
				className,
			)}
			layout="position"
			layoutId="prompt-input-submit"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
			type="submit"
			{...props}
		>
			<ArrowUpIcon className="size-5" />
		</motion.button>
	);
}

const PromptInputSubmit = memo(PurePromptInputSubmit);

function PromptInputStop({ className, ...props }: HTMLMotionProps<"button">) {
	return (
		<motion.button
			className={cn(
				"disabled:!pointer-events-none disabled:!opacity-50 flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground shadow-none [grid-area:action] hover:bg-secondary/80",
				className,
			)}
			layout="position"
			layoutId="prompt-input-stop"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
			type="button"
			{...props}
		>
			<StopIcon className="size-5" />
		</motion.button>
	);
}

export { PromptInput, PromptInputSubmit, PromptInputTextarea, PromptInputStop };
