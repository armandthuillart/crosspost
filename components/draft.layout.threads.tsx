"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps, SVGProps } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface PageProps extends ComponentProps<"div"> {
	avatar?: string;
}

function Page({ children, className, avatar, ...props }: PageProps) {
	const t = useTranslations("Draft");

	return (
		<div
			className={cn(
				"flex size-full items-center justify-center md:px-5",
				className,
			)}
			{...props}
		>
			<div className="flex size-full max-w-160 flex-col [--header-height:--spacing(15)]">
				<div className="z-1 hidden h-(--header-height) w-full shrink-0 items-center justify-center md:flex">
					<div className="flex items-center gap-4">
						<h1 className="font-semibold text-[0.9375rem] leading-5.25">
							{t("forYou")}
						</h1>

						<div className="flex size-6 items-center justify-center rounded-full border border-input bg-card">
							<svg
								aria-hidden="true"
								className="size-3"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 13 12"
							>
								<path
									d="m2.5 4.2 4 4 4-4"
									stroke="currentColor"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="1.5"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div className="h-full overflow-hidden rounded-t-3xl border-b-0 bg-card shadow-lg md:border">
					<div className="flex size-full flex-col">
						<div className="md:-mt-(--header-height) flex size-full flex-col justify-end overflow-hidden">
							<Placeholder />
						</div>

						{children}

						<div className="flex size-full flex-col overflow-hidden">
							<Placeholder />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

interface PostProps extends ComponentProps<"div"> {
	content?: string;
}

function Post({ content, children, className, ...props }: PostProps) {
	const t = useTranslations("Draft");

	return (
		<div
			className={cn("flex gap-3 border-b px-6 pt-3 pb-2", className)}
			{...props}
		>
			<Avatar className="relative mt-1 size-9 shrink-0 overflow-visible">
				<div className="overflow-hidden rounded-full">
					<svg
						aria-hidden="true"
						className="size-full"
						fill="none"
						height="24"
						viewBox="0 0 24 24"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect fill="#F4F5F7" height="24" width="24" />
						<circle cx="12" cy="26" fill="#828894" r="10" />
						<circle cx="12" cy="10" fill="#828894" r="5" />
					</svg>
				</div>

				<div className="-right-0.5 -bottom-px absolute flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground outline-2 outline-card">
					<svg
						aria-hidden="true"
						className="size-2.5"
						fill="currentColor"
						viewBox="0 0 10 9"
					>
						<path d="M4.99512 8.66895C4.64355 8.66895 4.35059 8.36621 4.35059 8.03418V5.12891H1.50391C1.17188 5.12891 0.864258 4.83594 0.864258 4.47949C0.864258 4.12793 1.17188 3.83008 1.50391 3.83008H4.35059V0.924805C4.35059 0.583008 4.64355 0.290039 4.99512 0.290039C5.35156 0.290039 5.64453 0.583008 5.64453 0.924805V3.83008H8.49121C8.83301 3.83008 9.13086 4.12793 9.13086 4.47949C9.13086 4.83594 8.83301 5.12891 8.49121 5.12891H5.64453V8.03418C5.64453 8.36621 5.35156 8.66895 4.99512 8.66895Z" />
					</svg>
				</div>
			</Avatar>

			<div className="flex w-full flex-col">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-1.5">
						<div className="flex items-center gap-1">
							<span className="font-semibold leading-5.25">{t("you")}</span>
							<Badge />
						</div>

						<span className="text-muted-foreground leading-5.25">
							{t("now")}
						</span>
					</div>

					<svg
						aria-hidden="true"
						className="size-5 text-muted-foreground"
						fill="currentColor"
						viewBox="0 0 24 24"
					>
						<circle cx="12" cy="12" r="1.5" />
						<circle cx="6" cy="12" r="1.5" />
						<circle cx="18" cy="12" r="1.5" />
					</svg>
				</div>

				<div className="mt-0.75 flex flex-col items-start gap-1.5 text-left">
					{children ? children : <p>{content}</p>}

					<div className="-ml-3 flex">
						<Button className="gap-1 rounded-full px-3" variant="ghost">
							<svg
								aria-hidden="true"
								className="size-[18.75px]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 18 18"
							>
								<path
									d="M1.34375 7.53125L1.34375 7.54043C1.34374 8.04211 1.34372 8.76295 1.6611 9.65585C1.9795 10.5516 2.60026 11.5779 3.77681 12.7544C5.59273 14.5704 7.58105 16.0215 8.33387 16.5497C8.73525 16.8313 9.26573 16.8313 9.66705 16.5496C10.4197 16.0213 12.4074 14.5703 14.2232 12.7544C15.3997 11.5779 16.0205 10.5516 16.3389 9.65585C16.6563 8.76296 16.6563 8.04211 16.6562 7.54043V7.53125C16.6562 5.23466 15.0849 3.25 12.6562 3.25C11.5214 3.25 10.6433 3.78244 9.99228 4.45476C9.59009 4.87012 9.26356 5.3491 9 5.81533C8.73645 5.3491 8.40991 4.87012 8.00772 4.45476C7.35672 3.78244 6.47861 3.25 5.34375 3.25C2.9151 3.25 1.34375 5.23466 1.34375 7.53125Z"
									strokeWidth="1.25"
								/>
							</svg>
						</Button>

						<Button className="gap-1 rounded-full px-3" variant="ghost">
							<svg
								aria-hidden="true"
								className="size-[18.75px]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 18 18"
							>
								<path
									d="M15.376 13.2177L16.2861 16.7955L12.7106 15.8848C12.6781 15.8848 12.6131 15.8848 12.5806 15.8848C11.3779 16.5678 9.94767 16.8931 8.41995 16.7955C4.94194 16.5353 2.08152 13.7381 1.72397 10.2578C1.2689 5.63919 5.13697 1.76863 9.75264 2.22399C13.2307 2.58177 16.0261 5.41151 16.2861 8.92429C16.4161 10.453 16.0586 11.8841 15.376 13.0876C15.376 13.1526 15.376 13.1852 15.376 13.2177Z"
									strokeLinejoin="round"
									strokeWidth="1.25"
								/>
							</svg>
						</Button>

						<Button className="gap-1 rounded-full px-3" variant="ghost">
							<svg
								aria-hidden="true"
								className="size-[18.75px]"
								fill="currentColor"
								viewBox="0 0 18 18"
							>
								<path d="M6.41256 1.23531C6.6349 0.971277 7.02918 0.937481 7.29321 1.15982L9.96509 3.40982C10.1022 3.52528 10.1831 3.69404 10.1873 3.87324C10.1915 4.05243 10.1186 4.2248 9.98706 4.34656L7.31518 6.81971C7.06186 7.05419 6.66643 7.03892 6.43196 6.7856C6.19748 6.53228 6.21275 6.13685 6.46607 5.90237L7.9672 4.51289H5.20312C3.68434 4.51289 2.45312 5.74411 2.45312 7.26289V9.51289V11.7629C2.45312 13.2817 3.68434 14.5129 5.20312 14.5129C5.5483 14.5129 5.82812 14.7927 5.82812 15.1379C5.82812 15.4831 5.5483 15.7629 5.20312 15.7629C2.99399 15.7629 1.20312 13.972 1.20312 11.7629V9.51289V7.26289C1.20312 5.05375 2.99399 3.26289 5.20312 3.26289H7.85002L6.48804 2.11596C6.22401 1.89362 6.19021 1.49934 6.41256 1.23531Z" />
								<path d="M11.5874 17.7904C11.3651 18.0545 10.9708 18.0883 10.7068 17.8659L8.03491 15.6159C7.89781 15.5005 7.81687 15.3317 7.81267 15.1525C7.80847 14.9733 7.8814 14.801 8.01294 14.6792L10.6848 12.206C10.9381 11.9716 11.3336 11.9868 11.568 12.2402C11.8025 12.4935 11.7872 12.8889 11.5339 13.1234L10.0328 14.5129H12.7969C14.3157 14.5129 15.5469 13.2816 15.5469 11.7629V9.51286V7.26286C15.5469 5.74408 14.3157 4.51286 12.7969 4.51286C12.4517 4.51286 12.1719 4.23304 12.1719 3.88786C12.1719 3.54269 12.4517 3.26286 12.7969 3.26286C15.006 3.26286 16.7969 5.05373 16.7969 7.26286V9.51286V11.7629C16.7969 13.972 15.006 15.7629 12.7969 15.7629H10.15L11.512 16.9098C11.776 17.1321 11.8098 17.5264 11.5874 17.7904Z" />
							</svg>
						</Button>

						<Button className="rounded-full" size="icon" variant="ghost">
							<svg
								aria-hidden="true"
								className="size-[18.75px]"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 18 18"
							>
								<path
									d="M15.6097 4.09082L6.65039 9.11104"
									strokeLinejoin="round"
									strokeWidth="1.25"
								/>
								<path
									d="M7.79128 14.439C8.00463 15.3275 8.11131 15.7718 8.33426 15.932C8.52764 16.071 8.77617 16.1081 9.00173 16.0318C9.26179 15.9438 9.49373 15.5501 9.95761 14.7628L15.5444 5.2809C15.8883 4.69727 16.0603 4.40546 16.0365 4.16566C16.0159 3.95653 15.9071 3.76612 15.7374 3.64215C15.5428 3.5 15.2041 3.5 14.5267 3.5H3.71404C2.81451 3.5 2.36474 3.5 2.15744 3.67754C1.97758 3.83158 1.88253 4.06254 1.90186 4.29856C1.92415 4.57059 2.24363 4.88716 2.88259 5.52032L6.11593 8.7243C6.26394 8.87097 6.33795 8.94431 6.39784 9.02755C6.451 9.10144 6.4958 9.18101 6.53142 9.26479C6.57153 9.35916 6.59586 9.46047 6.64451 9.66309L7.79128 14.439Z"
									strokeLinejoin="round"
									strokeWidth="1.25"
								/>
							</svg>
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

function Badge() {
	return (
		<svg
			aria-hidden="true"
			className="size-3 fill-[#0095F6]"
			viewBox="0 0 40 40"
		>
			<path d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"></path>
		</svg>
	);
}

const Icon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			className={cn("text-black dark:text-white", className)}
			fill="none"
			height="24"
			stroke="currentColor"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M19.25 8.50488C17.6729 2.63804 12.25 3.00452 12.25 3.00452C12.25 3.00452 4.75 2.50512 4.75 12C4.75 21.4949 12.25 20.9955 12.25 20.9955C12.25 20.9955 16.7077 21.2924 18.75 17.0782C19.4167 15.2204 19.25 11.5049 12.75 11.5049C12.75 11.5049 9.75 11.5049 9.75 14.0049C9.75 14.9812 10.75 16.0049 12.25 16.0049C13.75 16.0049 15.4212 14.9777 15.75 13.0049C16.75 7.00488 11.25 6.50488 9.75 9.00488"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

function Placeholder({ children, className, ...props }: ComponentProps<"div">) {
	return (
		<div
			className={cn("flex gap-3 border-b px-6 pt-3 pb-2", className)}
			{...props}
		>
			<Avatar className="relative mt-1 size-9 shrink-0 overflow-visible">
				<AvatarFallback className="rounded-full bg-muted" />
			</Avatar>

			<div className="flex w-full flex-col">
				<div className="flex h-5.25 items-center justify-between">
					<span className="h-2.5 w-21 rounded-full bg-accent" />

					<div className="flex size-5 items-center justify-center">
						<span className="h-2.5 w-4 rounded-full bg-accent" />
					</div>
				</div>

				<div className="mt-0.75 flex flex-col items-start gap-1.5 text-left">
					<div className="flex w-full flex-col gap-2 pt-2">
						<span className="h-2.5 w-5/10 rounded-full bg-accent" />
						<span className="h-2.5 w-5/10 rounded-full bg-accent" />
					</div>

					<div className="-ml-3 flex">
						<div className="flex h-9 items-center px-3">
							<span className="h-2.5 w-5 rounded-full bg-accent" />
						</div>

						<div className="flex h-9 items-center px-3">
							<span className="h-2.5 w-5 rounded-full bg-accent" />
						</div>

						<div className="flex h-9 items-center px-3">
							<span className="h-2.5 w-5 rounded-full bg-accent" />
						</div>

						<div className="flex size-9 items-center justify-center">
							<span className="h-2.5 w-4 rounded-full bg-accent" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export const Threads = Object.assign(Page, {
	Icon,
	Post,
});
