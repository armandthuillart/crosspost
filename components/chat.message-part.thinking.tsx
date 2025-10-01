import { useSmoothText } from "@convex-dev/agent/react";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "~/components/ai-elements/reasoning";
import type { MyMessage } from "~/lib/types";

interface ThinkingProps {
	part: MyMessage["parts"][number] & { type: "reasoning" };
	isStreaming: boolean;
}

export function Thinking({ part, isStreaming }: ThinkingProps) {
	const [reasoningText] = useSmoothText(part.text, {
		startStreaming: isStreaming,
	});

	return (
		<Reasoning className="w-full" isStreaming={false}>
			<ReasoningTrigger />
			<ReasoningContent>{reasoningText}</ReasoningContent>
		</Reasoning>
	);
}
