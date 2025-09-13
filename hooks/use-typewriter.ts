"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
	loop?: boolean;
	texts: string[];
	enabled?: boolean;
	typingSpeed?: number;
	pauseDuration?: number;
}

export function useTypewriter({
	texts,
	enabled = true,
	typingSpeed = 100,
	pauseDuration = 2000,
	loop = true,
}: UseTypewriterOptions) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [displayText, setDisplayText] = useState("");
	const [currentIndex, setCurrentIndex] = useState(0);
	const [currentTextIndex, setCurrentTextIndex] = useState(0);

	useEffect(() => {
		if (!enabled) return;

		let timeout: NodeJS.Timeout;

		const currentText = texts[currentTextIndex];

		const startTyping = () => {
			if (isDeleting) {
				if (displayText === "") {
					setIsDeleting(false);
					if (currentTextIndex === texts.length - 1 && !loop) {
						return;
					}
					setCurrentTextIndex((prev) => (prev + 1) % texts.length);
					setCurrentIndex(0);
					timeout = setTimeout(() => {}, pauseDuration);
				} else {
					timeout = setTimeout(() => {
						setDisplayText((prev) => prev.slice(0, -1));
					}, typingSpeed);
				}
			} else {
				if (currentIndex < currentText.length) {
					timeout = setTimeout(() => {
						setDisplayText((prev) => prev + currentText[currentIndex]);
						setCurrentIndex((prev) => prev + 1);
					}, typingSpeed);
				} else if (texts.length > 1) {
					timeout = setTimeout(() => {
						setIsDeleting(true);
					}, pauseDuration);
				}
			}
		};

		if (currentIndex === 0 && !isDeleting && displayText === "") {
			timeout = setTimeout(startTyping, 0);
		} else {
			startTyping();
		}

		return () => clearTimeout(timeout);
	}, [
		loop,
		texts,
		enabled,
		isDeleting,
		displayText,
		typingSpeed,
		currentIndex,
		pauseDuration,
		currentTextIndex,
	]);

	return displayText;
}
