import { fetchQuery } from "convex/nextjs";
import type { ReactNode } from "react";
import { ConvexClientProvider } from "~/app/convex-client-provider";
import { getToken } from "~/lib/auth-server";
import type { Session } from "~/lib/types";
import { api } from "../convex/_generated/api";

export async function ConvexSSRClientProvider({
	children,
}: {
	children: ReactNode;
}) {
	const token = await getToken();

	let session: Session = null;

	if (token) {
		session = await fetchQuery(api.auth.getSession, {}, { token });
	}

	return (
		<ConvexClientProvider initialSession={session}>
			{children}
		</ConvexClientProvider>
	);
}
