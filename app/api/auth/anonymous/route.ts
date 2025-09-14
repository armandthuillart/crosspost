export async function GET(request: Request) {
	const url = new URL(request.url);

	// Try to refresh Convex JWT from existing Better Auth session first
	const rawCookie = request.headers.get("cookie") ?? "";
	const refreshEndpoint = new URL("/api/auth/convex/token", url.origin);

	const refresh = await fetch(refreshEndpoint, {
		headers: {
			Accept: "application/json",
			Cookie: rawCookie,
		},
		method: "GET",
		redirect: "manual",
	});

	if (refresh.ok) {
		// Forward refreshed convex_jwt cookie and go home
		const headers = new Headers();
		for (const cookie of refresh.headers.getSetCookie() ?? []) {
			headers.append("Set-Cookie", cookie);
		}
		headers.set("Location", "/");
		return new Response(null, { headers, status: 302 });
	}

	// No valid session to refresh → create anonymous session
	const endpoint = new URL("/api/auth/sign-in/anonymous", url.origin);
	const response = await fetch(endpoint, {
		body: JSON.stringify({}),
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		method: "POST",
	});

	if (!response.ok) {
		return new Response("Failed to create anonymous session", { status: 500 });
	}

	const headers = new Headers();
	for (const cookie of response.headers.getSetCookie() ?? []) {
		headers.append("Set-Cookie", cookie);
	}
	headers.set("Location", "/");

	return new Response(null, {
		headers,
		status: 302,
	});
}
