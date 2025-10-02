import { useSmoothText } from "@convex-dev/agent/react";
import {
	ChainOfThought,
	ChainOfThoughtContent,
	ChainOfThoughtHeader,
	ChainOfThoughtStep,
} from "~/components/ai-elements/chain-of-thought";
import { Response } from "~/components/ai-elements/response";
import type { MyMessage } from "~/lib/types";

type ReasoningPart = Extract<MyMessage["parts"][number], { type: "reasoning" }>;

interface ThinkingProps {
	parts: ReasoningPart[];
	isStreaming: boolean;
}

interface ChainOfThoughtStepViewProps {
	part: ReasoningPart;
	index: number;
	isStreaming: boolean;
}

const STEP_LABEL_MAX_LENGTH = 80;

const boldHeadingRegex = /^\s*\*\*(.+?)\*\*(?:\s*\n+|\s*)/;
const markdownHeadingRegex = /^\s*#{1,6}\s+(.+?)(?:\n+|$)/;

const sanitizeLabel = (label: string) => label.replace(/[`*_]+/g, "").trim();

const reasoningPartKeys = new WeakMap<ReasoningPart, string>();
let reasoningPartKeyCounter = 0;

const getReasoningPartKey = (part: ReasoningPart) => {
	const existing = reasoningPartKeys.get(part);
	if (existing) return existing;
	reasoningPartKeyCounter += 1;
	const key = `reasoning-${reasoningPartKeyCounter}`;
	reasoningPartKeys.set(part, key);
	return key;
};

const extractLabelAndBody = (text: string, fallback: string) => {
	const trimmed = text.trim();
	if (!trimmed) {
		return { body: "", label: fallback };
	}

	const boldMatch = trimmed.match(boldHeadingRegex);
	if (boldMatch?.[1]) {
		const body = trimmed.slice(boldMatch[0].length).trim();
		return { body, label: sanitizeLabel(boldMatch[1]) };
	}

	const headingMatch = trimmed.match(markdownHeadingRegex);
	if (headingMatch?.[1]) {
		const body = trimmed.slice(headingMatch[0].length).trim();
		return { body, label: sanitizeLabel(headingMatch[1]) };
	}

	const newlineIndex = trimmed.indexOf("\n");
	if (newlineIndex !== -1) {
		const firstLine = trimmed.slice(0, newlineIndex).trim();
		if (firstLine.length > 0 && firstLine.length <= STEP_LABEL_MAX_LENGTH) {
			const body = trimmed.slice(newlineIndex + 1).trim();
			return { body, label: sanitizeLabel(firstLine) };
		}
	}

	if (trimmed.length <= STEP_LABEL_MAX_LENGTH) {
		return { body: "", label: sanitizeLabel(trimmed) };
	}

	return { body: trimmed, label: fallback };
};

function ChainOfThoughtStepView({
	part,
	index,
	isStreaming,
}: ChainOfThoughtStepViewProps) {
	const [visibleText] = useSmoothText(part.text ?? "", {
		startStreaming: isStreaming,
	});

	const { label, body } = extractLabelAndBody(
		visibleText,
		`Thought ${index + 1}`,
	);

	return (
		<ChainOfThoughtStep label={label}>
			{body && <Response>{body}</Response>}
		</ChainOfThoughtStep>
	);
}

export function Thinking({ parts, isStreaming }: ThinkingProps) {
	const reasoningParts = parts.filter((part) => part.text?.trim().length);

	if (reasoningParts.length === 0) {
		return null;
	}

	return (
		<ChainOfThought
			className="w-full"
			defaultOpen={isStreaming}
			{...(isStreaming ? { open: true } : {})}
		>
			<ChainOfThoughtHeader>Reasoning</ChainOfThoughtHeader>
			<ChainOfThoughtContent>
				<div className="space-y-4">
					{reasoningParts.map((part, index) => (
						<ChainOfThoughtStepView
							index={index}
							isStreaming={isStreaming && index === reasoningParts.length - 1}
							key={getReasoningPartKey(part)}
							part={part}
						/>
					))}
				</div>
			</ChainOfThoughtContent>
		</ChainOfThought>
	);
}
