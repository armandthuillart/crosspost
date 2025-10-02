import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { MyMessage } from "~/lib/types";

interface DraftProps {
	part: MyMessage["parts"][number] & { type: "tool-get-draft" };
}

export function Draft({ part }: DraftProps) {
	const { state, input } = part;

	if (state === "output-available") {
		if (!input?.versions) {
			return null;
		}

		return (
			<Tabs className="not-first:mt-4 mb-4 w-full">
				<TabsList>
					{Object.entries(part.input.versions).map(([platform]) => (
						<TabsTrigger disabled key={platform} value={platform}>
							{platform}
						</TabsTrigger>
					))}
				</TabsList>
				{Object.entries(part.input.versions).map(([platform]) => (
					<TabsContent key={platform} value={platform}>
						{part.input.versions[platform as keyof typeof part.input.versions]}
					</TabsContent>
				))}
			</Tabs>
		);
	}

	return state === "input-available" ? (
		<Tabs className="not-first:mt-4 mb-4 w-full">
			<div>{input.title}</div>

			<TabsList>
				{Object.entries(input.versions).map(([platform]) => (
					<TabsTrigger key={platform} value={platform}>
						{platform}
					</TabsTrigger>
				))}
			</TabsList>

			{Object.entries(input.versions).map(([platform]) => (
				<TabsContent key={platform} value={platform}>
					{input.versions[platform as keyof typeof input.versions]}
				</TabsContent>
			))}
		</Tabs>
	) : null;
}
