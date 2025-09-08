"use client";

import type { HTMLAttributes } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type ActionsProps = HTMLAttributes<HTMLDivElement>;

function Actions({ children, className, ...props }: ActionsProps) {
	return (
		<div
			className={cn(
				"group-data-[role=assistant]/message:-ml-1 group-data-[role=user]/message:-mr-1 flex p-1 transition-opacity duration-500 ease-[cubic-bezier(.32,.72,0,1)] group-data-[mode=edit]/message:pointer-events-none group-data-[role=user]/message:justify-end group-has-focus-visible/message:group-data-[mode=view]/message:opacity-100 group-hover/message:group-data-[mode=view]/message:opacity-100 group-data-[role=user]/message:md:opacity-0",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

interface ActionProps extends ButtonProps {
	tooltip: string;
}

function Action({ tooltip, children, className, ...props }: ActionProps) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className={cn("size-8 [&>svg]:size-4", className)}
						size="icon"
						variant="ghost"
						{...props}
					>
						{children}
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom">{tooltip}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

export { Actions, Action };
