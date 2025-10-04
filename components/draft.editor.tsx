"use client";

import { LinkNode } from "@lexical/link";
import { OverflowNode } from "@lexical/overflow";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CharacterLimitPlugin } from "@lexical/react/LexicalCharacterLimitPlugin";
import {
	type InitialConfigType,
	LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { EditorState } from "lexical";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "~/components/ui/button";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "~/components/ui/hover-card";
import { getColor, Progress } from "~/components/ui/progress";

interface DraftEditorProps {
	maxLength: number;
	content: string;
}

function PopulateEditorPlugin({ content }: { content: string }) {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		if (content) {
			editor.update(() => {
				const root = $getRoot();
				root.clear();
				const paragraphNode = $createParagraphNode();
				const textNode = $createTextNode(content);
				paragraphNode.append(textNode);
				root.append(paragraphNode);
			});
		}
	}, [editor, content]);

	return null;
}

function renderProgress(maxLength: number) {
	return ({ remainingCharacters }: { remainingCharacters: number }) => {
		const usedLength = maxLength - remainingCharacters;
		const progress = Math.min(usedLength / maxLength, 1);

		const circumference = 2 * Math.PI * 10; // radius = 10
		const strokeDashoffset = circumference - progress * circumference;

		const parent = document.querySelector('[data-slot="card"]');

		const element = (
			<HoverCard>
				<HoverCardTrigger asChild>
					<Button
						className="absolute right-3 bottom-3 rounded-full transition-colors ease-snappy"
						size="icon"
						variant="ghost"
					>
						<svg
							aria-label="Character usage"
							className={getColor(progress)}
							height="20"
							role="img"
							viewBox="0 0 24 24"
							width="20"
						>
							<circle
								cx="12"
								cy="12"
								fill="none"
								opacity="0.25"
								r="10"
								stroke="currentColor"
								strokeWidth="2"
							/>
							<circle
								cx="12"
								cy="12"
								fill="none"
								opacity="0.7"
								r="10"
								stroke="currentColor"
								strokeDasharray={`${circumference} ${circumference}`}
								strokeDashoffset={strokeDashoffset}
								strokeLinecap="round"
								strokeWidth="2"
								style={{
									transform: "rotate(-90deg)",
									transformOrigin: "center center",
								}}
							/>
						</svg>
					</Button>
				</HoverCardTrigger>
				<HoverCardContent
					className="flex w-64 flex-col gap-2 p-3"
					sideOffset={12}
				>
					<div className="flex items-center justify-between gap-3 text-xs">
						<p>{(progress * 100).toFixed(2)}%</p>
						<p className="font-mono text-muted-foreground">
							{usedLength} / {maxLength} chars
						</p>
					</div>
					<Progress value={progress * 100} />
				</HoverCardContent>
			</HoverCard>
		);

		return createPortal(element, parent as Element);
	};
}

export function DraftEditor({ content, maxLength }: DraftEditorProps) {
	const initialConfig: InitialConfigType = {
		namespace: "MyEditor",
		nodes: [LinkNode, OverflowNode],
		onError: (e: unknown) => {
			console.error(e);
			throw e;
		},
		theme: {
			link: "inline cursor-pointer align-baseline text-primary underline decoration-2 decoration-muted-foreground decoration-dotted underline-offset-2",
			paragraph: "text-base",
		},
	};

	const handleChange = (editorState: EditorState) => {
		console.log(editorState);
	};

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<RichTextPlugin
				contentEditable={<ContentEditable className="outline-none" />}
				ErrorBoundary={LexicalErrorBoundary}
				placeholder={<Placeholder />}
			/>
			<PopulateEditorPlugin content={content} />
			<LinkPlugin />
			<HistoryPlugin />
			<OnChangePlugin onChange={handleChange} />
			<AutoFocusPlugin />
			<CharacterLimitPlugin
				charset="UTF-8"
				maxLength={maxLength}
				renderer={renderProgress(maxLength)}
			/>
		</LexicalComposer>
	);
}

function Placeholder() {
	return (
		<span className="pointer-events-none absolute top-7 left-8 mt-px size-full text-muted-foreground">
			Write something...
		</span>
	);
}
