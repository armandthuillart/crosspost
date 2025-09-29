"use client";

import { AlertDialog as AlertDialogPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

function AlertDialog({ ...props }: AlertDialogPrimitive.AlertDialogProps) {
	return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({
	...props
}: AlertDialogPrimitive.AlertDialogTriggerProps) {
	return (
		<AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
	);
}

function AlertDialogPortal({
	...props
}: AlertDialogPrimitive.AlertDialogPortalProps) {
	return (
		<AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
	);
}

function AlertDialogOverlay({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogOverlayProps) {
	return (
		<AlertDialogPrimitive.Overlay
			className={cn(
				"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-neutral-200/50 backdrop-blur-[1px] duration-200 ease-snappy data-[state=closed]:animate-out data-[state=open]:animate-in dark:bg-black/50",
				className,
			)}
			data-slot="alert-dialog-overlay"
			{...props}
		/>
	);
}

function AlertDialogContent({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogContentProps) {
	return (
		<AlertDialogPortal>
			<AlertDialogOverlay />
			<AlertDialogPrimitive.Content
				className={cn(
					"-translate-x-1/2 data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 -translate-y-1/2 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] gap-6 rounded-2xl border border-input bg-background px-6 py-8 shadow-lg outline-none duration-200 ease-snappy data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-100 sm:p-10",
					className,
				)}
				data-slot="alert-dialog-content"
				{...props}
			/>
		</AlertDialogPortal>
	);
}

function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex flex-col justify-center gap-1 text-center",
				className,
			)}
			data-slot="alert-dialog-header"
			{...props}
		/>
	);
}

function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				className,
			)}
			data-slot="alert-dialog-footer"
			{...props}
		/>
	);
}

function AlertDialogTitle({
	className,
	...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
	return (
		<AlertDialogPrimitive.Title
			className={cn("font-semibold text-2xl", className)}
			data-slot="alert-dialog-title"
			{...props}
		/>
	);
}

function AlertDialogDescription({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogDescriptionProps) {
	return (
		<AlertDialogPrimitive.Description
			className={cn("text-lg text-muted-foreground", className)}
			data-slot="alert-dialog-description"
			{...props}
		/>
	);
}

function AlertDialogAction({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogActionProps) {
	return (
		<AlertDialogPrimitive.Action
			className={cn(buttonVariants({ variant: "destructive" }), className)}
			{...props}
		/>
	);
}

function AlertDialogCancel({
	className,
	...props
}: AlertDialogPrimitive.AlertDialogCancelProps) {
	return <AlertDialogPrimitive.Cancel {...props} />;
}

export {
	AlertDialog,
	AlertDialogPortal,
	AlertDialogOverlay,
	AlertDialogTrigger,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogTitle,
	AlertDialogDescription,
	AlertDialogAction,
	AlertDialogCancel,
};
