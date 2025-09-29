import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { MyMessage } from "~/lib/types";

interface DraftProps {
	part: MyMessage["parts"][number] & { type: "tool-draft" };
}

export function Draft({ part }: DraftProps) {
	if (!part.input?.versions) return null;

	return (
		<Tabs className="not-first:mt-4 mb-4 w-full">
			<TabsList>
				{Object.entries(part.input.versions).map(([platform, version]) => (
					<TabsTrigger key={platform} value={platform}>
						{platform}
					</TabsTrigger>
				))}
			</TabsList>
			<TabsContent value="threads">Threads</TabsContent>
			<TabsContent value="linkedin">Linkedin</TabsContent>
			<TabsContent value="bluesky">Bluesky</TabsContent>
			<TabsContent value="x">X</TabsContent>
		</Tabs>
	);
}
