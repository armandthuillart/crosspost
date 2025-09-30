"use client";

import type { Route } from "next";
import Link from "next/link";
import { memo } from "react";
import { Streamdown, type StreamdownProps } from "streamdown";
import { ExternalLinkIcon } from "~/components/ui/icons";
import { cn } from "~/lib/utils";

const components: StreamdownProps["components"] = {
	a: ({ href, node, children, ...props }) => (
		<Link
			className="inline cursor-pointer align-baseline text-primary underline decoration-2 decoration-muted-foreground decoration-dotted underline-offset-2"
			href={href as Route}
			rel="noreferrer"
			target="_blank"
			{...props}
		>
			{children}
			<ExternalLinkIcon className="ms-0.5 inline-block size-3 align-middle" />
		</Link>
	),
	h1: ({ node, children, ...props }) => (
		<h1 className="mt-4 mb-2 font-semibold text-2xl" {...props}>
			{children}
		</h1>
	),
	h2: ({ node, children, ...props }) => (
		<h2 className="mt-4 mb-1 font-semibold text-xl" {...props}>
			{children}
		</h2>
	),
	h3: ({ node, children, ...props }) => (
		<h3 className="mt-4 mb-1 font-semibold text-lg" {...props}>
			{children}
		</h3>
	),
	h4: ({ node, children, ...props }) => (
		<h4 className="mt-4 mb-1 font-semibold text-base" {...props}>
			{children}
		</h4>
	),
	h5: ({ node, children, ...props }) => (
		<h5 className="mt-4 mb-1 font-semibold text-sm" {...props}>
			{children}
		</h5>
	),
	h6: ({ node, children, ...props }) => (
		<h6 className="mt-4 mb-1 font-semibold text-xs" {...props}>
			{children}
		</h6>
	),
	hr: ({ node, children, ...props }) => (
		<hr className="my-7 border-border" {...props} />
	),
	li: ({ node, children, ...props }) => (
		<li className="list-item pl-1.5 leading-7 marker:font-semibold" {...props}>
			{children}
		</li>
	),
	ol: ({ node, children, ...props }) => (
		<ol className="list-decimal pl-7" {...props}>
			{children}
		</ol>
	),
	p: ({ node, children, ...props }) => (
		<p className="mt-2 mb-1 text-base leading-7" {...props}>
			{children}
		</p>
	),
	ul: ({ node, children, ...props }) => (
		<ul className="list-disc pl-7" {...props}>
			{children}
		</ul>
	),
};

function PureResponse({ className, ...props }: StreamdownProps) {
	return (
		<Streamdown
			className={cn(
				"size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
				className,
			)}
			components={components}
			{...props}
		/>
	);
}

export const Response = memo(PureResponse);
