"use client";

import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { type ReactNode, useEffect, useState } from "react";
import { authClient, useSession } from "~/lib/auth-client";
import type { Session } from "~/lib/types";

const convex = new ConvexReactClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string,
	{ expectAuth: true, verbose: false },
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
		if (clientSession) {
			setSession(clientSession);
		}
	}, [clientSession]);

	async function fetchAccessToken() {
		const { data, error } = await authClient.convex.token();
		return error ? null : data?.token || null;
	}

	const useAuth = () => ({
		fetchAccessToken,
		isAuthenticated: initialSession !== null,
		isLoading: isSessionPending && !session,
	});

	return (
		<ConvexProviderWithAuth client={convex} useAuth={useAuth}>
			{children}
		</ConvexProviderWithAuth>
	);
}
