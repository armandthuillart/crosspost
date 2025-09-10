export async function GET(request: Request) {
	const url = new URL(request.url);
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
