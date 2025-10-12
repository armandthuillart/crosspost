"use client";

import { Streamdown, type StreamdownProps } from "streamdown";

import { cn } from "~/lib/utils";
import { getMDXComponents } from "~/mdx-components";

export function Response({ className, ...props }: StreamdownProps) {
	return (
		<Streamdown
			className={cn(
				"size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
				className,
			)}
			// @ts-expect-error - it's alright
			components={getMDXComponents()}
			{...props}
		/>
	);
}
