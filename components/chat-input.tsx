"use client";

import {
	type KeyboardEvent,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import {
	PromptInput,
	PromptInputTextarea,
	PurePromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { useAutoFocus } from "@/hooks/use-auto-focus";
import { useTypewriter } from "@/hooks/use-typewriter";

export function ChatInput() {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const [prompt, setPrompt] = useState("");
	const [threshold, setThreshold] = useState<number | null>(null);
	const [isExpanded, setIsExpanded] = useState(false);

	const resetHeight = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.style.height = "auto";
			inputRef.current.style.height = "24px";
		}
	}, []);

	useLayoutEffect(() => {
		if (!inputRef.current) {
			return;
		}

		let height = inputRef.current.style.height;
		const scrollHeight = inputRef.current.scrollHeight;

		if (height !== `${scrollHeight}px`) {
			height = `${scrollHeight}px`;

			const shouldExpand = scrollHeight > 24;

			if (shouldExpand !== isExpanded) {
				setIsExpanded(shouldExpand);
			}

			if (shouldExpand && !threshold) {
				setThreshold(prompt.length);
			}
		}

		if (threshold && prompt.length >= threshold) {
			height = "24px";
			setIsExpanded(false);
			setThreshold(null);
		}
	});

	const handleChange = useCallback(
		(event: React.ChangeEvent<HTMLTextAreaElement>) => {
			setPrompt(event.currentTarget.value);
		},
		[],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent<HTMLTextAreaElement>) => {
			const isEnter = event.key === "Enter";
			const isShiftKey = event.shiftKey;
			const isComposing = event.nativeEvent.isComposing;

			if (isEnter && !isShiftKey && !isComposing) {
				event.preventDefault();

				if (prompt.length > 0) {
					const form = event.currentTarget.form;
					if (form) form.requestSubmit();
				}
			}
		},
		[prompt.length],
	);

	useAutoFocus({
		onValueChange: setPrompt,
		targetRef: inputRef,
		value: prompt,
	});

	const typewriter = useTypewriter({
		enabled: true,
		loop: true,
		pauseDuration: 2000,
		texts: [
			"yourself...",
			"your app...",
			"anything...",
			"your day...",
			"your week...",
			"your work...",
			"your goals...",
			"your thoughts...",
		],
		typingSpeed: 100,
	});

	const placeholder = `Ask to post about ${typewriter}`;

	return (
		<PromptInput data-state={isExpanded ? "expanded" : "collapsed"}>
			<PromptInputTextarea
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				ref={inputRef}
				value={prompt}
			/>
			<PurePromptInputSubmit disabled={prompt.length === 0} />
		</PromptInput>
	);
}
