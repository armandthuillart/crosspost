import { useTranslations } from "next-intl";
import type { ComponentProps, SVGProps } from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

function Page({ children, className, ...props }: ComponentProps<"div">) {
	const t = useTranslations("Draft");

	return (
		<div
			className={cn(
				"relative mx-auto flex size-full max-w-150 flex-col [--header-height:--spacing(12.5)] md:pt-2",
				className,
			)}
			{...props}
		>
			<div className="sticky top-0 z-10 flex h-(--header-height) w-full grid-cols-2 items-center gap-1.25 border-b bg-background p-3.25 font-medium md:rounded-t md:border">
				<svg
					aria-hidden="true"
					className="hidden shrink-0 md:block"
					fill="currentColor"
					height="24"
					viewBox="0 -960 960 960"
					width="24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z" />
				</svg>

				<Icon className="md:hidden" />

				<span>{t("trending")}</span>
			</div>

			<div className="-mt-(--header-height) md:-mt-[calc(var(--header-height)+0.5rem)] flex size-full flex-col justify-end overflow-hidden">
				<div className="flex size-full h-[calc(100%-0.5rem*2)] flex-col justify-end overflow-hidden">
					<Placeholder />
				</div>
			</div>

			{children}

			<div className="flex size-full flex-col justify-start overflow-hidden">
				<div className="flex flex-col justify-end">
					<Placeholder hasImage />
				</div>
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
				"flex flex-col gap-x-2 border-b p-4 md:border-x",
				className,
			)}
		>
			<div className="flex w-full items-center justify-between gap-x-2.5 pb-2.5">
				<div className="flex w-full items-center gap-x-2.5">
					<Avatar className="size-11.5 rounded-sm">
						<AvatarFallback className="bg-accent text-accent-foreground">
							<svg
								aria-hidden="true"
								className="size-5"
								fill="currentColor"
								height="24"
								viewBox="0 -960 960 960"
								width="24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
							</svg>
						</AvatarFallback>
					</Avatar>

					<div className="flex w-full flex-col leading-5.5">
						<p className="font-semibold">{t("you")}</p>
						<p className="text-muted-foreground lowercase">@{t("you")}</p>
					</div>
				</div>

				<div className="flex size-10 shrink-0 gap-x-1 pl-1">
					<div className="flex h-5.5 items-center text-muted-foreground">
						<svg
							aria-hidden="true"
							className="size-3.75 shrink-0"
							fill="currentColor"
							height="24"
							viewBox="0 -960 960 960"
							width="24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-82v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" />
						</svg>
					</div>

					<p className="text-base text-muted-foreground leading-5.5">1m</p>
				</div>
			</div>

			<div className="pt-0.5">
				{children ? children : <p className="text-base leading-5">{content}</p>}
			</div>

			<div className="mt-4 flex gap-x-4.5 text-muted-foreground">
				<div className="flex-1">
					<svg
						aria-hidden="true"
						fill="currentColor"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M760-200v-160q0-50-35-85t-85-35H273l144 144-57 56-240-240 240-240 57 56-144 144h367q83 0 141.5 58.5T840-360v160h-80Z" />
					</svg>
				</div>

				<div className="flex-1">
					<svg
						aria-hidden="true"
						fill="currentColor"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z" />
					</svg>
				</div>

				<div className="flex-1">
					<svg
						aria-hidden="true"
						fill="currentColor"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="m354-287 126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z" />
					</svg>
				</div>

				<div className="flex-1">
					<svg
						aria-hidden="true"
						fill="currentColor"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Zm80-122 200-86 200 86v-518H280v518Zm0-518h400-400Z" />
					</svg>
				</div>

				<svg
					aria-hidden="true"
					fill="currentColor"
					height="24"
					viewBox="0 -960 960 960"
					width="24"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
				</svg>
			</div>
		</div>
	);
}

const Icon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="#5B49DF"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M7.65571 16.9875C9.25327 17.4732 11.0743 17.7454 13 17.7454C15.0842 17.7454 17.0449 17.4265 18.7321 16.864C20.7594 16.188 21.75 14.1698 21.75 12.2302V7.52349C21.75 5.1159 20.4451 2.6663 17.9222 1.99053C16.1521 1.51643 14.1351 1.25 12 1.25C9.8649 1.25 7.84787 1.51643 6.07784 1.99053C3.55492 2.6663 2.25 5.1159 2.25 7.52349V14.4961C2.25 16.6262 2.78486 18.2492 3.63438 19.47C4.4809 20.6865 5.60371 21.452 6.69946 21.9312C7.79153 22.4088 8.87254 22.6096 9.67232 22.6929C10.0743 22.7348 10.4108 22.7475 10.6496 22.7497C10.7691 22.7507 11.0198 22.7438 11.0198 22.7438C12.3609 22.7412 13.4405 22.474 14.1924 22.2023C14.5702 22.0657 15.0698 21.8534 15.4142 21.6252C15.6239 21.4863 15.75 21.2515 15.75 21V20C15.75 19.7594 15.6345 19.5334 15.4396 19.3923C15.2447 19.2514 14.9941 19.2124 14.7656 19.2876C14.6028 19.3295 14.1291 19.4507 13.8048 19.509C13.1561 19.6256 12.2007 19.7443 11 19.7443C9.77154 19.7443 9.02145 19.4845 8.56248 19.1717C8.11295 18.8652 7.87704 18.4635 7.75646 18.0397C7.65466 17.682 7.63685 17.3108 7.65571 16.9875ZM8 8C8 7.17157 8.67157 6.5 9.5 6.5C10.3284 6.5 11 7.17157 11 8V11.5C11 12.0523 11.4477 12.5 12 12.5C12.5523 12.5 13 12.0523 13 11.5V8C13 7.17157 13.6716 6.5 14.5 6.5C15.3284 6.5 16 7.17157 16 8V13.5C16 14.0523 16.4477 14.5 17 14.5C17.5523 14.5 18 14.0523 18 13.5V8C18 6.067 16.433 4.5 14.5 4.5C13.5207 4.5 12.6353 4.90223 12 5.55051C11.3647 4.90223 10.4793 4.5 9.5 4.5C7.567 4.5 6 6.067 6 8V13.5C6 14.0523 6.44772 14.5 7 14.5C7.55228 14.5 8 14.0523 8 13.5V8Z"
				fillRule="evenodd"
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
				"flex flex-col gap-x-2 border-b p-4 md:border-x",
				className,
			)}
		>
			<div className="flex w-full items-center justify-between gap-x-2.5 pb-2.5">
				<div className="flex w-full items-center gap-x-2.5">
					<Avatar className="size-11.5 rounded-sm">
						<AvatarFallback className="bg-accent/50 text-accent-foreground" />
					</Avatar>

					<div className="flex w-full flex-col gap-1.5">
						<div className="h-2.5 w-7 shrink-0 rounded-full bg-accent/50" />
						<div className="h-2.5 w-10 shrink-0 rounded-full bg-accent/50" />
					</div>
				</div>

				<div className="flex size-10 shrink-0 pl-1">
					<div className="flex h-fit items-center gap-x-1">
						<div className="size-3.75 shrink-0 rounded-full bg-accent/50" />
						<div className="h-2.5 w-5 shrink-0 rounded-full bg-accent/50" />
					</div>
				</div>
			</div>

			<div className="pt-0.5">
				{!hasImage && (
					<div className="flex flex-col gap-2">
						<span className="h-3 w-5/10 rounded-full bg-accent/50" />
						<span className="h-3 w-5/10 rounded-full bg-accent/50" />
					</div>
				)}

				{hasImage && (
					<div className="relative mt-2 mb-1 aspect-video rounded-lg bg-accent/50" />
				)}
			</div>

			<div className="mt-4 flex items-center gap-x-4.5 text-muted-foreground">
				<div className="flex h-6 flex-1 items-center">
					<div className="h-3 w-6 shrink-0 rounded-full bg-accent/50" />
				</div>

				<div className="flex h-6 flex-1 items-center">
					<div className="h-3 w-6 shrink-0 rounded-full bg-accent/50" />
				</div>

				<div className="flex h-6 flex-1 items-center">
					<div className="h-3 w-6 shrink-0 rounded-full bg-accent/50" />
				</div>

				<div className="flex h-6 flex-1 items-center">
					<div className="h-3 w-6 shrink-0 rounded-full bg-accent/50" />
				</div>

				<div className="h-3 w-6 shrink-0 rounded-full bg-accent/50" />
			</div>
		</div>
	);
}

export const Mastodon = Object.assign(Page, {
	Icon,
	Post,
});
