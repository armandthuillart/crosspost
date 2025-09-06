"use client";

import type { ComponentProps } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { ArrowUpIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

function PromptInput({ className, ...props }: ComponentProps<"form">) {
	return (
		<form
			className={cn(
				"group/prompt-input grid grid-cols-[auto_1fr_auto] gap-x-2 rounded-4xl border bg-material p-2.5 shadow-sm transition-[border] duration-500 ease-[cubic-bezier(.32,.72,0,1)] has-focus-visible:border-input data-[state=collapsed]:min-h-14 data-[state=collapsed]:[grid-template-areas:'tool_input_action'] data-[state=expanded]:[grid-template-areas:'input_input_input''tool_footer_action']",
				className,
			)}
			{...props}
		/>
	);
}

function PromptInputTextarea({
	className,
	...props
}: ComponentProps<"textarea">) {
	return (
		<div
			className={cn(
				"-mt-2.5 group-not-data-[state=expanded]/prompt-input:-mb-2.5 flex w-full [grid-area:input] group-not-data-[state=expanded]/prompt-input:ml-1 group-data-[state=expanded]/prompt-input:px-2.5",
				className,
			)}
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
		</div>
	);
}

function PurePromptInputSubmit({ className, ...props }: ButtonProps) {
	return (
		<Button
			className={cn(
				"shrink-0 rounded-full shadow-none [grid-area:action]",
				className,
			)}
			size="icon"
			type="submit"
			{...props}
		>
			<ArrowUpIcon className="size-5" />
		</Button>
	);
}

export { PromptInput, PromptInputTextarea, PurePromptInputSubmit };
