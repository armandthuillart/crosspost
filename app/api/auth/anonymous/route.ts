export async function GET(request: Request) {
	const url = new URL(request.url);

	// If we already have a convex JWT, don't create another anonymous session
	const rawCookie = request.headers.get("cookie") ?? "";
	const hasJwt = rawCookie
		.split(";")
		.map((c) => c.trim().toLowerCase())
		.some(
			(c) =>
				c.startsWith("better-auth.convex_jwt=") ||
				c.startsWith("__secure-better-auth.convex_jwt="),
		);
	if (hasJwt) {
		return new Response(null, {
			headers: new Headers({ Location: "/" }),
			status: 302,
		});
	}

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
