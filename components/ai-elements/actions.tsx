"use client";

import type { HTMLAttributes } from "react";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

type ActionsProps = HTMLAttributes<HTMLDivElement>;

function Actions({ children, className, ...props }: ActionsProps) {
	return (
		<div
			className={cn(
				"group-not-data-user/message:-ml-1 group-data-user/message:-mr-1 flex p-1 group-data-user/message:justify-end group-data-user/message:has-focus-visible:opacity-100 group-data-user/message:md:opacity-0 group-data-user/message:md:hover:opacity-100",
				className,
			)}
			{...props}
		>
			<TooltipProvider>{children}</TooltipProvider>
		</div>
	);
}

function Action({
	tooltip,
	children,
	className,
	...props
}: ButtonProps & { tooltip: string }) {
	return (
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
	);
}

export { Actions, Action };
