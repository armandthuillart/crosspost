"use client";

import { useTranslations } from "next-intl";
import { Suggestion, Suggestions } from "~/components/ai-elements/suggestion";

interface ChatSuggestionsProps {
	onSubmit: (prompt: string) => void;
}

export function ChatSuggestions({ onSubmit }: ChatSuggestionsProps) {
	const t = useTranslations("ChatSuggestions");

	const suggestions = [
		{
			description: t("write.description"),
			id: "write",
			prompt: t("write.prompt"),
			title: t("write.title"),
		},
		{
			description: t("help.description"),
			id: "help",
			prompt: t("help.prompt"),
			title: t("help.title"),
		},
		{
			description: t("teach.description"),
			id: "teach",
			prompt: t("teach.prompt"),
			title: t("teach.title"),
		},
		{
			description: t("switch.description"),
			id: "switch",
			prompt: t("switch.prompt"),
			title: t("switch.title"),
		},
	];

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
