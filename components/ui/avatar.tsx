"use client";

import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "~/lib/utils";

function Avatar({ className, ...props }: AvatarPrimitive.AvatarProps) {
	return (
		<AvatarPrimitive.Root
			className={cn(
				"relative flex size-7 shrink-0 overflow-hidden rounded-full",
				className,
			)}
			data-slot="avatar"
			{...props}
		/>
	);
}

function AvatarImage({
	className,
	...props
}: AvatarPrimitive.AvatarImageProps) {
	return (
		<AvatarPrimitive.Image
			className={cn("aspect-square size-full", className)}
			data-slot="avatar-image"
			{...props}
		/>
	);
}

function AvatarFallback({
	className,
	...props
}: AvatarPrimitive.AvatarFallbackProps) {
	return (
		<AvatarPrimitive.Fallback
			className={cn(
				"flex size-full items-center justify-center bg-avatar font-semibold text-avatar-foreground text-sm",
				className,
			)}
			data-slot="avatar-fallback"
			{...props}
		/>
	);
}

export { Avatar, AvatarImage, AvatarFallback };
