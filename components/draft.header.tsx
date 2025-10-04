"use client";

import { Button } from "~/components/ui/button";
import { CardHeader } from "~/components/ui/card";
import { ExternalLinkIcon, RedoIcon, UndoIcon } from "~/components/ui/icons";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";

interface DraftHeaderProps {
	title: string;
	onPublish: () => void;
}

export function DraftHeader({ onPublish }: DraftHeaderProps) {
	return (
		<CardHeader className="absolute top-0 z-2 flex w-full flex-row items-center justify-between p-3">
			<div className="flex">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="size-8 rounded-full"
								size="icon"
								variant="ghost"
							>
								<UndoIcon className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent sideOffset={12}>Undo</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								className="size-8 rounded-full"
								size="icon"
								variant="ghost"
							>
								<RedoIcon className="size-4" />
							</Button>
						</TooltipTrigger>
						<TooltipContent sideOffset={12}>Redo</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
			<div className="flex items-center gap-3">
				<Button className="size-8 rounded-full" onClick={onPublish} size="icon">
					<ExternalLinkIcon className="size-5" />
				</Button>
			</div>
		</CardHeader>
	);
}
