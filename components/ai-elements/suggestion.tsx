"use client";

import { motion } from "motion/react";
import type { ComponentProps } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";

type SuggestionsProps = ComponentProps<typeof ScrollArea>;

function Suggestions({ className, children, ...props }: SuggestionsProps) {
	return (
		<motion.div
			className="mx-auto"
			layout="position"
			transition={{ layout: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } }}
		>
			<ScrollArea
				className="w-full overflow-x-auto whitespace-nowrap"
				{...props}
			>
				<div
					className={cn("flex w-max flex-nowrap items-center gap-2", className)}
				>
					{children}
				</div>
				<ScrollBar className="hidden" orientation="horizontal" />
			</ScrollArea>
		</motion.div>
	);
}

type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
	title: string;
	prompt: string;
	onClick?: (prompt: string) => void;
	description: string;
};

function Suggestion({
	size = "sm",
	title,
	prompt,
	variant = "outline",
	onClick,
	children,
	className,
	description,
	...props
}: SuggestionProps) {
	function handleClick() {
		onClick?.(prompt);
	}

	return (
		<Button
			className={cn(
				"h-auto cursor-pointer flex-col items-start gap-0 rounded-lg bg-accent px-4 py-3",
				className,
			)}
			onClick={handleClick}
			size={size}
			type="button"
			variant="secondary"
			{...props}
		>
			<div className="font-semibold">{title}</div>
			<p className="text-muted-foreground">{description}</p>
		</Button>
	);
}

export { Suggestion, Suggestions, type SuggestionProps, type SuggestionsProps };
