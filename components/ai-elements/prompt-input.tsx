"use client";

import { type ComponentProps, memo } from "react";
import { Button, type ButtonProps } from "~/components/ui/button";
import { SendIcon, StopIcon } from "~/components/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

function PromptInput({
	className,
	children,
	...props
}: ComponentProps<"form">) {
	return (
		<form
			className={cn(
				"group/prompt-input grid grid-cols-[auto_1fr_auto] rounded-4xl bg-muted p-2.5 [grid-template-areas:'left_center_right'] data-expanded:[grid-template-areas:'center_center_center''left_void_right']",
				className,
			)}
			{...props}
		>
			{children}
		</form>
	);
}

function PromptInputTextarea({
	className,
	...props
}: ComponentProps<"textarea">) {
	return (
		<div
			className={cn(
				"-my-2.5 flex min-h-14 w-full px-2.5 [grid-area:center] group-data-expanded/prompt-input:mb-0",
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

const PromptInputSubmit = memo(({ className, ...props }: ButtonProps) => (
	<Button
		className="rounded-full [grid-area:right]"
		size="icon"
		type="submit"
		{...props}
	>
		<SendIcon className="size-5" />
	</Button>
));

const PromptInputStop = memo(({ className, ...props }: ButtonProps) => (
	<Button
		className="rounded-full bg-background [grid-area:right] hover:bg-background"
		size="icon"
		type="button"
		variant="secondary"
		{...props}
	>
		<StopIcon className="size-5" />
	</Button>
));

const PromptInputButton = memo(
	({
		className,
		children,
		tooltip,
		kbd,
		...props
	}: ButtonProps & { kbd: string; tooltip: string }) => (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="h-9 [grid-area:left]" {...props}>
					{children}
				</TooltipTrigger>
				<TooltipContent className="flex gap-1.5" side="bottom">
					{tooltip}{" "}
					<kbd className="-mr-1 flex size-4 items-center justify-center rounded bg-white/20 text-muted-foreground">
						{kbd}
					</kbd>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	),
);

export {
	PromptInput,
	PromptInputStop,
	PromptInputButton,
	PromptInputSubmit,
	PromptInputTextarea,
};
