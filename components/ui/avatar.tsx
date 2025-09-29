"use client";

import { Avatar as BaseAvatar } from "@base-ui-components/react/avatar";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

function Avatar({
	className,
	...props
}: ComponentProps<typeof BaseAvatar.Root>) {
	return (
		<BaseAvatar.Root
			className={cn(
				"relative flex size-7 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			{...props}
		/>
	);
}

function AvatarImage({
	className,
	...props
}: ComponentProps<typeof BaseAvatar.Image>) {
	return (
		<BaseAvatar.Image
			className={cn("aspect-square size-full", className)}
			{...props}
		/>
	);
}

function AvatarFallback({
	className,
	...props
}: ComponentProps<typeof BaseAvatar.Fallback>) {
	return (
		<BaseAvatar.Fallback
			className={cn(
				"flex size-full items-center justify-center bg-avatar font-semibold text-avatar-foreground text-sm",
				className,
			)}
			{...props}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
