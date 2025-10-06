"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import {
	type ComponentProps,
	type CSSProperties,
	createContext,
	type MouseEvent,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";
import { Button, type ButtonProps } from "~/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from "~/components/ui/drawer";
import { MenuIcon } from "~/components/ui/icons";
import { useIsMobile } from "~/hooks/use-mobile";
import { SHORTCUTS, useShortcut } from "~/hooks/use-shortcuts";
import { cn } from "~/lib/utils";

const SIDEBAR_COOKIE_NAME = "sidebar";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "16.25rem";
const SIDEBAR_WIDTH_ICON = "3rem";

type SidebarContextProps = {
	state: "expanded" | "collapsed";
	isOpen: boolean;
	isMobile: boolean;
	setIsOpen: (isOpen: boolean) => void;
	isOpenMobile: boolean;
	defaultHidden: boolean;
	toggleSidebar: () => void;
	setIsOpenMobile: (isOpenMobile: boolean) => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

function useSidebar() {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider.");
	}

	return context;
}

function SidebarProvider({
	defaultHidden = false,
	defaultOpen = true,
	open: openProp,
	onOpenChange: setOpenProp,
	className,
	style,
	children,
	...props
}: ComponentProps<"div"> & {
	defaultHidden?: boolean;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = useState(false);

	const [_open, _setOpen] = useState(defaultOpen);
	const open = openProp ?? _open;

	const setOpen = useCallback(
		(value: boolean | ((value: boolean) => boolean)) => {
			const openState = typeof value === "function" ? value(open) : value;
			if (setOpenProp) {
				setOpenProp(openState);
			} else {
				_setOpen(openState);
			}

			// biome-ignore lint/suspicious/noDocumentCookie: it's okay
			document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
		},
		[setOpenProp, open],
	);

	const toggleSidebar = useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [isMobile, setOpen]);

	useShortcut(SHORTCUTS.TOGGLE_SIDEBAR, () => {
		toggleSidebar();
	});

	const state = open ? "expanded" : "collapsed";

	const contextValue = useMemo<SidebarContextProps>(
		() => ({
			defaultHidden,
			isMobile,
			isOpen: open,
			isOpenMobile: openMobile,
			setIsOpen: setOpen,
			setIsOpenMobile: setOpenMobile,
			state,
			toggleSidebar,
		}),
		[state, open, setOpen, isMobile, openMobile, toggleSidebar, defaultHidden],
	);

	return (
		<SidebarContext.Provider value={contextValue}>
			<div
				className={cn("group/sidebar-wrapper flex h-dvh w-full", className)}
				data-slot="sidebar-wrapper"
				style={
					{
						"--sidebar-width": SIDEBAR_WIDTH,
						"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
						...style,
					} as CSSProperties
				}
				{...props}
			>
				{children}
			</div>
		</SidebarContext.Provider>
	);
}

function Sidebar({
	side = "left",
	variant = "sidebar",
	children,
	className,
	collapsible = "offcanvas",
	...props
}: ComponentProps<"div"> & {
	side?: "left" | "right";
	variant?: "sidebar" | "floating" | "inset";
	collapsible?: "offcanvas" | "icon" | "none";
}) {
	const { isMobile, state, isOpenMobile, setIsOpenMobile } = useSidebar();

	if (collapsible === "none") {
		return (
			<div
				className={cn(
					"flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
					className,
				)}
				data-slot="sidebar"
				{...props}
			>
				{children}
			</div>
		);
	}

	if (isMobile) {
		return (
			<Drawer
				direction="left"
				onOpenChange={setIsOpenMobile}
				open={isOpenMobile}
			>
				<DrawerContent
					className="bg-sidebar p-0 text-sidebar-foreground data-[vaul-drawer-direction=left]:w-(--sidebar-width) [&>button]:hidden"
					data-mobile="true"
					data-sidebar="sidebar"
					data-slot="sidebar"
					style={
						{
							"--initial-transform": "calc(100% + 8px)",
							"--sidebar-width": SIDEBAR_WIDTH_MOBILE,
						} as CSSProperties
					}
				>
					<DrawerHeader className="sr-only">
						<DrawerTitle>Sidebar</DrawerTitle>
						<DrawerDescription>Displays the mobile sidebar.</DrawerDescription>
					</DrawerHeader>
					<div className="flex h-full w-full flex-col">{children}</div>
				</DrawerContent>
			</Drawer>
		);
	}

	return (
		<div
			className="group peer hidden text-sidebar-foreground md:block"
			data-collapsible={state === "collapsed" ? collapsible : ""}
			data-side={side}
			data-slot="sidebar"
			data-state={state}
			data-variant={variant}
		>
			<div
				className="relative w-(--sidebar-width) bg-transparent transition-[width] duration-500 ease-snappy group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[collapsible=offcanvas]:w-0"
				data-slot="sidebar-gap"
			/>
			<div
				className={cn(
					"fixed inset-y-0 left-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,width] duration-500 ease-snappy group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] group-data-[collapsible=icon]:w-(--sidebar-width-icon) md:flex",
					className,
				)}
				data-slot="sidebar-container"
				{...props}
			>
				<div
					className="flex size-full flex-col bg-sidebar"
					data-sidebar="sidebar"
					data-slot="sidebar-inner"
				>
					{children}
				</div>
			</div>
		</div>
	);
}

function SidebarContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",
				className,
			)}
			data-sidebar="content"
			data-slot="sidebar-content"
			{...props}
		/>
	);
}

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex justify-between gap-2 px-3 pt-2 pb-0", className)}
			data-sidebar="header"
			data-slot="sidebar-header"
			{...props}
		/>
	);
}

function SidebarTrigger({ className, onClick, ...props }: ButtonProps) {
	const { toggleSidebar } = useSidebar();

	function handleClick(event: MouseEvent<HTMLButtonElement>) {
		onClick?.(event);
		toggleSidebar();
	}

	return (
		<Button
			className={cn(className)}
			data-sidebar="trigger"
			data-slot="sidebar-trigger"
			onClick={handleClick}
			size="icon"
			variant="ghost"
			{...props}
		>
			<MenuIcon className="size-5" />
		</Button>
	);
}

function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("relative flex w-full min-w-0 flex-col p-3", className)}
			data-sidebar="group"
			data-slot="sidebar-group"
			{...props}
		/>
	);
}

function SidebarGroupContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("w-full text-sm", className)}
			data-sidebar="group-content"
			data-slot="sidebar-group-content"
			{...props}
		/>
	);
}

function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
	return (
		<ul
			className={cn("flex w-full min-w-0 flex-col gap-1", className)}
			data-sidebar="menu"
			data-slot="sidebar-menu"
			{...props}
		/>
	);
}

function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
	return (
		<li
			className={cn("group/menu-item relative", className)}
			data-sidebar="menu-item"
			data-slot="sidebar-menu-item"
			{...props}
		/>
	);
}

const sidebarMenuButtonVariants = cva(
	"peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 px-2.5 text-left text-sm outline-hidden ring-sidebar-ring/50 hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground focus-visible:ring-3 active:bg-sidebar-accent/70 active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent/70 data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:shrink-0",
	{
		defaultVariants: {
			size: "default",
			variant: "default",
		},
		variants: {
			size: {
				default: "h-9 text-sm",
				lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
				sm: "h-7 text-xs",
			},
			variant: {
				default:
					"hover:bg-sidebar-accent/70 hover:text-sidebar-accent-foreground",
				outline:
					"bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
			},
		},
	},
);

function SidebarMenuButton({
	size = "default",
	asChild = false,
	variant = "default",
	isActive = false,
	className,
	...props
}: ComponentProps<"button"> & {
	asChild?: boolean;
	isActive?: boolean;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
	const Comp = asChild ? SlotPrimitive.Root : "button";

	return (
		<Comp
			className={cn(sidebarMenuButtonVariants({ size, variant }), className)}
			data-active={isActive}
			data-sidebar="menu-button"
			data-size={size}
			data-slot="sidebar-menu-button"
			{...props}
		/>
	);
}

function SidebarGroupLabel({
	className,
	asChild = false,
	...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
	const Comp = asChild ? SlotPrimitive.Root : "div";
	return (
		<Comp
			className={cn(
				"flex shrink-0 items-center rounded-md px-2.5 py-2 text-muted-foreground text-sm outline-hidden ring-sidebar-ring focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
				"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
				className,
			)}
			data-sidebar="group-label"
			data-slot="sidebar-group-label"
			{...props}
		/>
	);
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col gap-2 p-3", className)}
			data-sidebar="footer"
			data-slot="sidebar-footer"
			{...props}
		/>
	);
}

export {
	Sidebar,
	useSidebar,
	SidebarMenu,
	SidebarGroup,
	SidebarHeader,
	SidebarFooter,
	SidebarContent,
	SidebarTrigger,
	SidebarMenuItem,
	SidebarProvider,
	SidebarGroupLabel,
	SidebarMenuButton,
	SidebarGroupContent,
};
