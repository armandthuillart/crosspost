"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { type ReactNode, useEffect, useState } from "react";
import { convex, useSession } from "~/lib/auth-client";
import type { Session } from "~/lib/types";

const convexClient = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string,
	{
		expectAuth: true,
		verbose: false,
	},
);

export function ConvexClientProvider({
	children,
	initialSession,
}: {
	children: ReactNode;
	initialSession: Session;
}) {
	const [session, setSession] = useState<Session>(initialSession);

	const { data: clientSession, isPending: isSessionPending } = useSession();

	useEffect(() => {
		if (clientSession !== undefined) {
			setSession(clientSession);
		}
	}, [clientSession]);

	async function fetchAccessToken() {
		const { data, error } = await convex.token();

		if (error || !data.token) {
			return null;
		}

		return data.token;
	}

	const useAuth = () => ({
		fetchAccessToken,
		isAuthenticated: session !== null,
		isLoading: isSessionPending,
	});

	return (
		<ConvexProviderWithAuth client={convexClient} useAuth={useAuth}>
			{children}
		</ConvexProviderWithAuth>
	);
}
