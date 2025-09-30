import { Suggestion, Suggestions } from "~/components/ai-elements/suggestion";

export function ChatSuggestions() {
	return (
		<Suggestions className="mx-auto">
			<Suggestion
				description="sound more casual"
				prompt="I want you to help me make my content sound more casual and conversational. Start by asking me to share my tweet with you."
				title="Make my tweet"
			/>
			<Suggestion
				description="about my new role"
				prompt="I want you to help me write a LinkedIn post about my new job. Start by asking me about my new role and company."
				title="Help me post"
			/>
			<Suggestion
				description="to grow my account"
				prompt="I want you to teach me how to grow my social media presence. Start by asking me what platform I want to grow and what my account is for."
				title="Teach me how"
			/>
			<Suggestion
				description="from casual to formal"
				prompt="I want you to help me convert my content from casual to formal tone. Start by asking me to share my post with you and the platform it's for, then rewrite it appropriately."
				title="Switch the tone"
			/>
		</Suggestions>
	);
}
