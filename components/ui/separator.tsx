"use client";

import { Separator as SeparatorPrimitive } from "radix-ui";
import { cn } from "~/lib/utils";

interface SeparatorProps extends SeparatorPrimitive.SeparatorProps {
	className?: string;
	decorative?: boolean;
	orientation?: "horizontal" | "vertical";
}

function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: SeparatorProps) {
	return (
		<SeparatorPrimitive.Root
			className={cn(
				"shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px",
				className,
			)}
			data-slot="separator"
			decorative={decorative}
			orientation={orientation}
			{...props}
		/>
	);
}

export { Separator };
