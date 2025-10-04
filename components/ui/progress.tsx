"use client";

import { Progress as ProgressPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function getColor(progress: number) {
	if (progress >= 0.9) {
		return "text-destructive-foreground";
	} else if (progress >= 0.5) {
		return "text-amber-700 dark:text-amber-400";
	}
	return "text-primary";
}

function Progress({
	className,
	value,
	...props
}: ComponentProps<typeof ProgressPrimitive.Root>) {
	return (
		<ProgressPrimitive.Root
			className={cn(
				"relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
				getColor((value || 0) / 100),
				className,
			)}
			data-slot="progress"
			{...props}
		>
			<ProgressPrimitive.Indicator
				className="size-full flex-1 bg-current transition-transform ease-snappy"
				data-slot="progress-indicator"
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

export { Progress, getColor };
