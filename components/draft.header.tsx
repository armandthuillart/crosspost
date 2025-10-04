"use client";

import { Button } from "~/components/ui/button";
import { CardHeader } from "~/components/ui/card";
import { ExternalLinkIcon } from "~/components/ui/icons";
import { Separator } from "~/components/ui/separator";

interface DraftHeaderProps {
	title: string;
	onPublish: () => void;
}

export function DraftHeader({ title, onPublish }: DraftHeaderProps) {
	return (
		<CardHeader className="absolute top-0 z-2 flex w-full flex-row items-center justify-between border-b bg-background p-3">
			<div className="flex items-center gap-1.5">
				<p className="mx-2 font-medium">{title}</p>
				<Separator
					className="data-[orientation=vertical]:h-5"
					orientation="vertical"
				/>
			</div>
			<Button className="size-8 rounded-full" onClick={onPublish} size="icon">
				<ExternalLinkIcon className="size-5" />
			</Button>
		</CardHeader>
	);
}
