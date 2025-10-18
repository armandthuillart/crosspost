"use client";

import { useTranslations } from "next-intl";
import type { ComponentProps, SVGProps } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

function Page({ children, className, ...props }: ComponentProps<"div">) {
	const t = useTranslations("Draft");

	return (
		<div
			className={cn(
				"relative mx-auto flex size-full max-w-149.5 flex-col md:border-x",
				className,
			)}
			{...props}
		>
			<div className="absolute top-0 z-1 grid h-13 w-full grid-cols-2 border-b bg-background/85 backdrop-blur-md">
				{[t("forYou"), t("following")].map((title, index) => (
					<div
						className="flex items-center justify-center px-4 transition-colors duration-200 hover:bg-accent"
						key={title}
					>
						<div className="flex flex-col">
							<p className="pt-4 pb-3 font-bold text-[0.9375rem] leading-5">
								{title}
							</p>

							{index === 0 && (
								<span className="h-1 w-14 bg-selection-foreground" />
							)}
						</div>
					</div>
				))}
			</div>

			<div className="flex size-full flex-col justify-end overflow-hidden">
				<div className="flex flex-col justify-end">
					<Placeholder />
				</div>
			</div>

			{children}

			<div className="size-full overflow-hidden">
				<Placeholder hasImage />
			</div>
		</div>
	);
}

interface PostProps extends ComponentProps<"div"> {
	content?: string;
}

function Post({ content, children, className }: PostProps) {
	const t = useTranslations("Draft");

	return (
		<div
			className={cn(
				"flex gap-x-2 border-b px-4 pt-3 transition-colors duration-200 hover:bg-muted",
				className,
			)}
		>
			<Avatar className="size-10">
				<svg
					aria-hidden="true"
					className="size-full"
					fill="none"
					height="48"
					viewBox="0 0 48 48"
					width="48"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect fill="#CCD6DD" height="48" width="48" />
					<ellipse cx="24" cy="50" fill="#657786" rx="15" ry="17" />
					<path
						d="M33 20.5C33 30 28.9706 30 24 30C19.0294 30 15 30 15 20.5C15 15.2533 19.0294 11 24 11C28.9706 11 33 15.2533 33 20.5Z"
						fill="#657786"
					/>
				</svg>
			</Avatar>

			<div className="flex w-full flex-col gap-y-3 pb-3">
				<div className="flex w-full flex-col">
					<div className="flex h-5 w-full items-center justify-between">
						<div className="flex h-full items-center gap-1 overflow-hidden">
							<div className="flex h-full items-center gap-0.5">
								<span className="truncate font-bold text-base">{t("you")}</span>
								<svg
									aria-hidden="true"
									className="size-[18.75px]"
									fill="var(--selection-foreground)"
									viewBox="0 0 22 22"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
								</svg>
							</div>

							<div className="flex gap-1 text-base text-muted-foreground">
								<span className="truncate lowercase">@{t("you")}</span>
								<span>•</span>
								<span className="truncate lowercase">{t("now")}</span>
							</div>
						</div>

						<div className="flex gap-2 text-muted-foreground">
							<svg
								aria-hidden="true"
								className="size-[18.75px]"
								fill="currentColor"
								viewBox="0 0 33 32"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M12.745 20.54l10.97-8.19c.539-.4 1.307-.244 1.564.38 1.349 3.288.746 7.241-1.938 9.955-2.683 2.714-6.417 3.31-9.83 1.954l-3.728 1.745c5.347 3.697 11.84 2.782 15.898-1.324 3.219-3.255 4.216-7.692 3.284-11.693l.008.009c-1.351-5.878.332-8.227 3.782-13.031L33 0l-4.54 4.59v-.014L12.743 20.544m-2.263 1.987c-3.837-3.707-3.175-9.446.1-12.755 2.42-2.449 6.388-3.448 9.852-1.979l3.72-1.737c-.67-.49-1.53-1.017-2.515-1.387-4.455-1.854-9.789-.931-13.41 2.728-3.483 3.523-4.579 8.94-2.697 13.561 1.405 3.454-.899 5.898-3.22 8.364C1.49 30.2.666 31.074 0 32l10.478-9.466" />
							</svg>
							<svg
								aria-hidden="true"
								className="size-[18.75px]"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
							</svg>
						</div>
					</div>

					{children ? (
						children
					) : (
						<p className="text-base leading-5">{content}</p>
					)}
				</div>

				<div className="flex items-center gap-1 text-muted-foreground">
					<div className="flex h-5 flex-1 items-center gap-1">
						<svg
							aria-hidden="true"
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z" />
						</svg>
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<svg
							aria-hidden="true"
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path>
						</svg>
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<svg
							aria-hidden="true"
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path>
						</svg>
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<svg
							aria-hidden="true"
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
						</svg>
					</div>

					<div className="flex items-center gap-2">
						<svg
							aria-hidden="true"
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z" />
						</svg>

						<svg
							aria-hidden="true"
							className="size-[18.75px]"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z" />
						</svg>
					</div>
				</div>
			</div>
		</div>
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
				d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

function Placeholder({
	className,
	hasImage,
}: ComponentProps<"div"> & { hasImage?: boolean }) {
	return (
		<div
			className={cn(
				"z-0 flex gap-x-2 border-b px-4 pt-3 transition-colors duration-200 hover:bg-muted",
				className,
			)}
		>
			<Avatar className="size-10">
				<AvatarFallback className="rounded-full bg-accent/50" />
			</Avatar>

			<div className="flex w-full flex-col gap-y-3 pb-3">
				<div className="flex w-full flex-col">
					<div className="flex h-5 w-full items-center justify-between">
						<span className="h-2.5 w-34 rounded-full bg-accent/50" />
						<span className="h-2.5 w-11 rounded-full bg-accent/50" />
					</div>

					{!hasImage && (
						<div className="flex flex-col gap-2">
							<span className="h-2.5 w-5/10 rounded-full bg-accent/50" />
							<span className="h-2.5 w-5/10 rounded-full bg-accent/50" />
						</div>
					)}

					{hasImage && (
						<div className="relative mt-2 mb-1 aspect-video rounded-lg bg-accent/50" />
					)}
				</div>

				<div className="flex items-center gap-1 text-muted-foreground">
					<div className="flex h-5 flex-1 items-center gap-1">
						<span className="h-2.5 w-5 rounded-full bg-accent/50" />
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<span className="h-2.5 w-5 rounded-full bg-accent/50" />
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<span className="h-2.5 w-5 rounded-full bg-accent/50" />
					</div>

					<div className="flex h-5 flex-1 items-center gap-1">
						<span className="h-2.5 w-5 rounded-full bg-accent/50" />
					</div>

					<div className="flex items-center gap-2">
						<span className="h-2.5 w-11 rounded-full bg-accent/50" />
					</div>
				</div>
			</div>
		</div>
	);
}

export const X = Object.assign(Page, {
	Icon,
	Post,
});
