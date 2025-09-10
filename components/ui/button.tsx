import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { LoaderIcon } from "@/components/ui/icons";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none outline-none transition-[color,opacity,background-color] duration-500 ease-[cubic-bezier(.32,.72,0,1)] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		compoundVariants: [
			{
				className: "h-9 px-4",
				size: "default",
				variant: ["ghost", "default", "outline", "secondary", "destructive"],
			},
		],
		defaultVariants: {
			size: "default",
			variant: "default",
		},
		variants: {
			loading: {
				true: "!text-transparent has-[>svg:is(.loading)]:[&_svg]:not-first:opacity-0",
			},
			size: {
				default: "",
				icon: "size-9",
				lg: "h-10 px-8",
				sm: "h-8 gap-1.5 px-3",
			},
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive-foreground text-white shadow-xs hover:bg-destructive-foreground/90",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "rounded-xs text-primary underline-offset-4 hover:underline",
				outline: "border border-input bg-background hover:bg-accent",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
			},
		},
	},
);

export interface ButtonProps
	extends ComponentProps<"button">,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	isLoading?: boolean;
}

function Button({
	size,
	asChild = false,
	variant,
	disabled,
	children,
	className,
	isLoading = false,
	...props
}: ButtonProps) {
	const Component = asChild ? SlotPrimitive.Root : "button";

	return (
		<Component
			className={cn(
				buttonVariants({ className, loading: isLoading, size, variant }),
			)}
			data-slot="button"
			disabled={disabled || isLoading}
			{...props}
		>
			{isLoading && (
				<LoaderIcon
					className={cn(
						"loading absolute size-4 animate-spin text-primary-foreground",
						variant === "outline" && "text-muted-foreground",
						variant === "link" && "text-current",
					)}
				/>
			)}
			<SlotPrimitive.Slottable>{children}</SlotPrimitive.Slottable>
		</Component>
	);
}

export { Button, buttonVariants };
