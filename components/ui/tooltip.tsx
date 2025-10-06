"use client";

import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "~/lib/utils";

function TooltipProvider({
	delayDuration = 0,
	...props
}: TooltipPrimitive.TooltipProviderProps) {
	return (
		<TooltipPrimitive.Provider
			data-slot="tooltip-provider"
			delayDuration={delayDuration}
			{...props}
		/>
	);
}

function Tooltip({ ...props }: TooltipPrimitive.TooltipProps) {
	return (
		<TooltipProvider>
			<TooltipPrimitive.Root data-slot="tooltip" {...props} />
		</TooltipProvider>
	);
}

function TooltipTrigger({ ...props }: TooltipPrimitive.TooltipTriggerProps) {
	return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
	className,
	sideOffset = 8,
	showArrow = false,
	children,
	...props
}: TooltipPrimitive.TooltipContentProps & {
	showArrow?: boolean;
}) {
	return (
		<TooltipPrimitive.Portal>
			<TooltipPrimitive.Content
				className={cn(
					"z-50 w-fit text-balance rounded-sm bg-primary px-2 py-1 text-primary-foreground text-xs",
					className,
				)}
				data-slot="tooltip-content"
				sideOffset={sideOffset}
				{...props}
			>
				{children}
				{showArrow && (
					<TooltipPrimitive.Arrow className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-xs bg-primary fill-primary" />
				)}
			</TooltipPrimitive.Content>
		</TooltipPrimitive.Portal>
	);
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
