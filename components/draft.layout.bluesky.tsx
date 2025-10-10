"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ComponentProps, SVGProps } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

function Page({ children, className, ...props }: ComponentProps<"div">) {
	const t = useTranslations("Draft");

	return (
		<div
			className={cn(
				"bluesky flex h-full items-center justify-center px-4 [--header-height:--spacing(11.75)]",
				className,
			)}
			{...props}
		>
			<div className="absolute top-0 z-1 mx-auto grid h-(--header-height) w-full max-w-150 shrink-0 grid-cols-2 border border-t-0 bg-background">
				<div className="flex justify-center p-3.5 pb-0 hover:bg-accent">
					<div className="flex h-full flex-col items-center justify-between">
						<p className="font-semibold text-[15px] text-foreground leading-5">
							{t("discover")}
						</p>

						<span className="h-0.75 w-16" />
					</div>
				</div>

				<div className="flex justify-center p-3.5 pb-0 hover:bg-accent">
					<div className="flex h-full flex-col items-center justify-between">
						<p className="font-semibold text-[15px] text-foreground leading-5">
							{t("following")}
						</p>

						<span className="h-0.75 w-16 bg-selection-foreground" />
					</div>
				</div>
			</div>

			<div className="mx-auto flex size-full w-full max-w-150 flex-col overflow-hidden border-x">
				<div className="flex flex-col justify-end">
					<Placeholder />
				</div>

				<div className="w-full">{children}</div>

				<div className="flex flex-col">
					<Placeholder hasImage />
				</div>
			</div>
		</div>
	);
}

interface TweetProps extends ComponentProps<"div"> {
	content?: string;
}

function Tweet({ content, children, className }: TweetProps) {
	const t = useTranslations("Draft");

	return (
		<motion.div
			className={cn(
				"z-0 mx-auto flex w-full max-w-150 border-b p-2.5 pr-3.75 pb-2 hover:bg-muted/45",
				className,
			)}
		>
			<div className="flex flex-col pr-2.5 pl-2">
				<Avatar className="size-10">
					<AvatarIcon />
				</Avatar>
			</div>

			<div className="flex w-full flex-col">
				<div className="flex items-center pb-1">
					<span className="font-semibold leading-4.25">{t("you")}</span>
					&nbsp;
					<span className="text-muted-foreground lowercase leading-4.25">
						@{t("you")}.bsky.social
					</span>
					<span className="pl-1 text-muted-foreground leading-4.25">
						· {t("now")}
					</span>
				</div>

				<div className="w-full">
					{children ? (
						children
					) : (
						<p className="whitespace-pre-line text-foreground">{content}</p>
					)}

					<div className="grid grid-cols-5 pt-0.5">
						<div className="-ml-1.5">
							<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
								<div className="flex size-4.5 items-center justify-center">
									<svg
										aria-hidden="true"
										fill="currentColor"
										height="18"
										viewBox="0 0 24 24"
										width="18"
									>
										<path
											clipRule="evenodd"
											d="M20.002 7a2 2 0 0 0-2-2h-12a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v1.918l3.375-2.7a1 1 0 0 1 .625-.218h5a2 2 0 0 0 2-2V7Zm2 8a4 4 0 0 1-4 4h-4.648l-4.727 3.781A1.001 1.001 0 0 1 7.002 22v-3h-1a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v8Z"
											fillRule="evenodd"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
							<svg
								aria-hidden="true"
								fill="currentColor"
								height="18"
								viewBox="0 0 24 24"
								width="18"
							>
								<path
									clipRule="evenodd"
									d="M17.957 2.293a1 1 0 1 0-1.414 1.414L17.836 5H6a3 3 0 0 0-3 3v3a1 1 0 1 0 2 0V8a1 1 0 0 1 1-1h11.836l-1.293 1.293a1 1 0 0 0 1.414 1.414l2.47-2.47a1.75 1.75 0 0 0 0-2.474l-2.47-2.47ZM20 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H6.164l1.293 1.293a1 1 0 1 1-1.414 1.414l-2.47-2.47a1.75 1.75 0 0 1 0-2.474l2.47-2.47a1 1 0 0 1 1.414 1.414L6.164 17H18a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1Z"
									fillRule="evenodd"
								/>
							</svg>
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
							<svg
								aria-hidden="true"
								fill="currentColor"
								height="18"
								viewBox="0 0 24 24"
								width="18"
							>
								<path
									clipRule="evenodd"
									d="M16.734 5.091c-1.238-.276-2.708.047-4.022 1.38a1 1 0 0 1-1.424 0C9.974 5.137 8.504 4.814 7.266 5.09c-1.263.282-2.379 1.206-2.92 2.556C3.33 10.18 4.252 14.84 12 19.348c7.747-4.508 8.67-9.168 7.654-11.7-.541-1.351-1.657-2.275-2.92-2.557Zm4.777 1.812c1.604 4-.494 9.69-9.022 14.47a1 1 0 0 1-.978 0C2.983 16.592.885 10.902 2.49 6.902c.779-1.942 2.414-3.334 4.342-3.764 1.697-.378 3.552.003 5.169 1.286 1.617-1.283 3.472-1.664 5.17-1.286 1.927.43 3.562 1.822 4.34 3.764Z"
									fillRule="evenodd"
								/>
							</svg>
						</div>

						<div className="col-start-5 flex items-center justify-end gap-2">
							<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
								<svg
									aria-hidden="true"
									fill="currentColor"
									height="18"
									viewBox="0 0 24 24"
									width="18"
								>
									<path
										clipRule="evenodd"
										d="M9.7 16.895a4 4 0 0 1 4.6 0l3.7 2.6V6.5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v12.995l3.7-2.6Zm10.3 2.6c0 1.62-1.825 2.567-3.15 1.636l-3.7-2.6a2.001 2.001 0 0 0-2.3 0l-3.7 2.6C5.825 22.062 4 21.115 4 19.495V6.5a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v12.995Z"
										fillRule="evenodd"
									/>
								</svg>
							</div>

							<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
								<svg
									aria-hidden="true"
									fill="currentColor"
									height="18"
									viewBox="0 0 24 24"
									width="18"
								>
									<path
										clipRule="evenodd"
										d="M20 13.75a1 1 0 0 1 1 1V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3.25a1 1 0 1 1 2 0V18a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.25a1 1 0 0 1 1-1ZM12 3a1 1 0 0 1 .707.293l4.5 4.5a1 1 0 1 1-1.414 1.414L13 6.414v8.836a1 1 0 1 1-2 0V6.414L8.207 9.207a1 1 0 1 1-1.414-1.414l4.5-4.5A1 1 0 0 1 12 3Z"
										fillRule="evenodd"
									/>
								</svg>
							</div>

							<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground hover:bg-accent">
								<svg
									aria-hidden="true"
									fill="currentColor"
									height="18"
									viewBox="0 0 24 24"
									width="18"
								>
									<path
										clipRule="evenodd"
										d="M2 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm16 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0Zm-6-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
										fillRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function Placeholder({
	className,
	hasImage,
}: ComponentProps<"div"> & { hasImage?: boolean }) {
	return (
		<motion.div
			className={cn(
				"z-0 mx-auto flex w-full max-w-150 border-b p-2.5 pr-3.75 pb-2 hover:bg-muted/45",
				className,
			)}
		>
			<div className="flex flex-col pr-2.5 pl-2">
				<Avatar className="size-10">
					<AvatarFallback className="bg-accent" />
				</Avatar>
			</div>

			<div className="flex w-full flex-col">
				<div className="flex items-center gap-1 pb-1">
					<div className="flex h-4.25 items-center">
						<span className="h-2.5 w-29 rounded-full bg-accent" />
					</div>
				</div>

				<div className="w-full">
					{!hasImage && (
						<div className="flex flex-col gap-2 pt-1 pb-2">
							<span className="h-2.5 w-5/10 rounded-full bg-accent" />
							<span className="h-2.5 w-5/10 rounded-full bg-accent" />
						</div>
					)}

					{hasImage && (
						<div className="relative mt-2 mb-1 aspect-video rounded-lg bg-accent" />
					)}

					<div className="grid grid-cols-5 pt-0.5">
						<div className="-ml-1.5">
							<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground">
								<div className="flex h-4.25 items-center">
									<span className="h-2.5 w-12 rounded-full bg-accent" />
								</div>
							</div>
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground">
							<div className="flex h-4.25 items-center">
								<span className="h-2.5 w-12 rounded-full bg-accent" />
							</div>
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground">
							<div className="flex h-4.25 items-center">
								<span className="h-2.5 w-12 rounded-full bg-accent" />
							</div>
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground">
							<div className="flex h-4.25 items-center">
								<span className="h-2.5 w-6 rounded-full bg-accent" />
							</div>
						</div>

						<div className="flex w-fit items-center gap-1 rounded-full p-1.25 text-accent-foreground">
							<div className="flex h-4.25 items-center">
								<span className="h-2.5 w-6 rounded-full bg-accent" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

const Icon = ({ className, ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			className={cn("text-[#1181F6]", className)}
			fill="currentColor"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M12 11.4963C11.8936 11.2963 7.45492 3 3.50417 3C1.33647 3 2.00456 8 2.50443 10.5C2.70653 11.5108 3.50417 14.5 8.003 14C8.003 14 4.00404 14.5 4.00404 17C4.00404 18.5 6.50339 21 8.50287 21C10.4606 21 11.9391 16.6859 12 16.5058C12.0609 16.6859 13.5394 21 15.4971 21C17.4966 21 19.996 18.5 19.996 17C19.996 14.5 15.997 14 15.997 14C20.4958 14.5 21.2935 11.5108 21.4956 10.5C21.9954 8 22.6635 3 20.4958 3C16.5451 3 12.1064 11.2963 12 11.4963Z" />
		</svg>
	);
};

export const Bluesky = Object.assign(Page, {
	Icon,
	Tweet,
});

function AvatarIcon() {
	return (
		<svg
			aria-hidden="true"
			className="size-10"
			fill="none"
			height="80"
			stroke="none"
			viewBox="0 0 24 24"
			width="80"
		>
			<circle cx="12" cy="12" fill="#0070ff" r="12" />
			<circle cx="12" cy="9.5" fill="#fff" r="3.5" />
			<path
				d="M 12.058 22.784 C 9.422 22.784 7.007 21.836 5.137 20.262 C 5.667 17.988 8.534 16.25 11.99 16.25 C 15.494 16.25 18.391 18.036 18.864 20.357 C 17.01 21.874 14.64 22.784 12.058 22.784 Z"
				fill="#fff"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}
