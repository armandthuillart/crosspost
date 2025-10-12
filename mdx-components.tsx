import type { MDXComponents } from "mdx/types";
import type { Route } from "next";
import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowUpRightIcon } from "~/components/ui/icons";

export function getMDXComponents(): MDXComponents {
	return {
		a: ({ href, children, ...props }: ComponentProps<"a">) => (
			<Link
				className="inline cursor-pointer align-baseline underline decoration-1 decoration-foreground/50 decoration-dotted underline-offset-4 transition-none"
				href={href as Route}
				rel="noreferrer"
				target="_blank"
				{...props}
			>
				{children}
				<span className="mb-1 ml-px inline-block size-3 align-middle">
					<ArrowUpRightIcon className="scale-125" strokeWidth={1.75} />
				</span>
			</Link>
		),
		h1: ({ children, ...props }: ComponentProps<"h1">) => (
			<h1 className="mt-4 mb-2 font-semibold text-2xl" {...props}>
				{children}
			</h1>
		),
		h2: ({ children, ...props }: ComponentProps<"h2">) => (
			<h2 className="mt-4 mb-1 font-semibold text-xl" {...props}>
				{children}
			</h2>
		),
		h3: ({ children, ...props }: ComponentProps<"h3">) => (
			<h3 className="mt-4 mb-1 font-semibold text-lg" {...props}>
				{children}
			</h3>
		),
		h4: ({ children, ...props }: ComponentProps<"h4">) => (
			<h4 className="mt-4 mb-1 font-semibold text-base" {...props}>
				{children}
			</h4>
		),
		h5: ({ children, ...props }: ComponentProps<"h5">) => (
			<h5 className="mt-4 mb-1 font-semibold text-sm" {...props}>
				{children}
			</h5>
		),
		h6: ({ children, ...props }: ComponentProps<"h6">) => (
			<h6 className="mt-4 mb-1 font-semibold text-xs" {...props}>
				{children}
			</h6>
		),
		hr: ({ children, ...props }: ComponentProps<"hr">) => (
			<hr className="my-7 border-border" {...props} />
		),
		li: ({ children, ...props }: ComponentProps<"li">) => (
			<li
				className="list-item pl-1.5 leading-7 marker:font-semibold"
				{...props}
			>
				{children}
			</li>
		),
		ol: ({ children, ...props }: ComponentProps<"ol">) => (
			<ol className="list-decimal pl-7" {...props}>
				{children}
			</ol>
		),
		p: ({ children, ...props }: ComponentProps<"p">) => (
			<p className="mt-2 text-base leading-7 [p+p]:my-4 [p]:mb-1" {...props}>
				{children}
			</p>
		),
		table: ({ children, ...props }: ComponentProps<"table">) => (
			<table className="max-w-(--chat-content-max-width)" {...props}>
				{children}
			</table>
		),
		td: ({ children, ...props }: ComponentProps<"td">) => (
			<td
				className="py-2.5 not-last:pr-6 not-first:pl-2 align-baseline text-sm/6"
				{...props}
			>
				{children}
			</td>
		),
		th: ({ children, ...props }: ComponentProps<"th">) => (
			<th
				className="min-w-[calc(var(--chat-content-max-width)*4/24)] max-w-[calc(var(--chat-content-max-width)*6/24)] whitespace-nowrap py-2 not-last:pr-6 not-first:pl-2 text-left text-sm/4 [&>strong]:font-semibold"
				{...props}
			>
				{children}
			</th>
		),
		tr: ({ children, ...props }: ComponentProps<"tr">) => (
			<tr
				className="border-border/70 not-last:border-b last:[&>td]:pb-6"
				{...props}
			>
				{children}
			</tr>
		),
		ul: ({ children, ...props }: ComponentProps<"ul">) => (
			<ul className="list-disc pl-7" {...props}>
				{children}
			</ul>
		),
	};
}
