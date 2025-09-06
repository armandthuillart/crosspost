"use client";

import { type HTMLMotionProps, motion } from "motion/react";
import type { ComponentProps } from "react";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function PromptInput({ className, ...props }: HTMLMotionProps<"form">) {
	return (
		<motion.form
			className={cn(
				"group/prompt-input grid grid-cols-[auto_1fr_auto] gap-x-2 rounded-4xl border bg-material p-2.5 shadow-sm transition-[border] duration-500 ease-[cubic-bezier(.32,.72,0,1)] has-focus-visible:border-input data-[state=collapsed]:min-h-14 data-[state=collapsed]:pl-3.5 data-[state=collapsed]:[grid-template-areas:'tool_input_action'] data-[state=expanded]:[grid-template-areas:'input_input_input''tool_footer_action']",
				className,
			)}
			layout
			layoutId="prompt-input-container"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
			{...props}
		/>
	);
}

function PromptInputTextarea({
	className,
	...props
}: ComponentProps<"textarea">) {
	return (
		<motion.div
			className={cn(
				"-mt-2.5 group-not-data-[state=expanded]/prompt-input:-mb-2.5 flex w-full [grid-area:input] group-data-[state=expanded]/prompt-input:px-2.5",
				className,
			)}
			layout="position"
			layoutId="textarea-container"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
		>
			<textarea
				className={cn(
					"my-4 max-h-52 w-full resize-none antialiased outline-none ring-0 placeholder:text-muted-foreground focus-visible:ring-0",
					className,
				)}
				name="prompt"
				rows={1}
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
				buttonVariants({ className, size: "icon" }),
				"shrink-0 rounded-full shadow-none [grid-area:action]",
			)}
			layout="position"
			layoutId="submit-button"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
			type="submit"
			{...props}
		>
			<ArrowUpIcon className="size-5" />
		</motion.button>
	);
}

export { PromptInput, PromptInputTextarea, PurePromptInputSubmit };
