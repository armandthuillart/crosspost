"use client";

import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function TooltipProvider(props: ComponentProps<typeof BaseTooltip.Provider>) {
	return <BaseTooltip.Provider {...props} />;
}

function Tooltip(props: ComponentProps<typeof BaseTooltip.Root>) {
	return (
		<TooltipProvider closeDelay={0} delay={0}>
			<BaseTooltip.Root {...props} />
		</TooltipProvider>
	);
}

function TooltipTrigger(props: ComponentProps<typeof BaseTooltip.Trigger>) {
	return <BaseTooltip.Trigger {...props} />;
}

function TooltipContent({
	className,
	children,
	side,
	...props
}: ComponentProps<typeof BaseTooltip.Popup> &
	ComponentProps<typeof BaseTooltip.Positioner>) {
	return (
		<BaseTooltip.Portal>
			<BaseTooltip.Positioner side={side} sideOffset={10}>
				<BaseTooltip.Popup
					className={cn(
						"dark:-outline-offset-1 flex flex-col rounded-sm bg-primary px-1.5 py-px text-primary-foreground text-sm shadow-border shadow-lg",
						className,
					)}
					{...props}
				>
					<BaseTooltip.Arrow className="data-[side=top]:-bottom-2 data-[side=bottom]:-top-2 data-[side=left]:-right-3.25 data-[side=right]:-rotate-90 data-[side=right]:-left-3.25 flex data-[side=left]:rotate-90 data-[side=top]:rotate-180">
						<svg
							aria-hidden="true"
							className=""
							fill="none"
							height="10"
							viewBox="0 0 20 10"
							width="20"
						>
							<path
								className="fill-primary"
								d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
							/>
						</svg>
					</BaseTooltip.Arrow>
					{children}
				</BaseTooltip.Popup>
			</BaseTooltip.Positioner>
		</BaseTooltip.Portal>
	);
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
