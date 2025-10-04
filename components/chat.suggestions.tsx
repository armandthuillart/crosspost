"use client";

import { Suggestion, Suggestions } from "~/components/ai-elements/suggestion";

const suggestions = [
	{
		description: "sound more casual",
		id: "make-my-tweet",
		prompt:
			"I want you to help me make my content sound more casual and conversational. Start by asking me to share my tweet with you.",
		title: "Make my tweet",
	},
	{
		description: "about my new role",
		id: "help-me-post",
		prompt:
			"I want you to help me write a LinkedIn post about my new job. Start by asking me about my new role and company.",
		title: "Help me post",
	},
	{
		description: "to grow my account",
		id: "teach-me-how",
		prompt:
			"I want you to teach me how to grow my social media presence. Start by asking me what platform I want to grow and what my account is for.",
		title: "Teach me how",
	},
	{
		description: "from casual to formal",
		id: "switch-the-tone",
		prompt:
			"I want you to help me convert my content from casual to formal tone. Start by asking me to share my post with you and the platform it's for, then rewrite it appropriately.",
		title: "Switch the tone",
	},
];

interface ChatSuggestionsProps {
	onSubmit: (prompt: string) => void;
}

export function ChatSuggestions({ onSubmit }: ChatSuggestionsProps) {
	return (
		<Suggestions>
			{suggestions.map((suggestion) => (
				<Suggestion
					description={suggestion.description}
					key={suggestion.id}
					onClick={onSubmit}
					prompt={suggestion.prompt}
					title={suggestion.title}
				/>
			))}
		</Suggestions>
	);
}
