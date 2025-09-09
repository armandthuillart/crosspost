// TODO: This works, but isn't fast enough.
export async function GET() {
	const convexSiteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
	if (!convexSiteUrl) {
		throw new Error("NEXT_PUBLIC_CONVEX_SITE_URL is not set");
	}

	const response = await fetch(`${convexSiteUrl}/api/auth/sign-in/anonymous`, {
		body: JSON.stringify({}),
		headers: { "Content-Type": "application/json" },
		method: "POST",
	});

	if (!response.ok) {
		throw new Error("Failed to create anonymous session");
	}

	// Forward cookies from the auth response
	const cookies = response.headers.getSetCookie();
	const headers = new Headers();

	cookies.forEach((cookie) => {
		headers.append("Set-Cookie", cookie);
	});

	return new Response(null, {
		headers: {
			Location: "/",
			...Object.fromEntries(headers.entries()),
		},
		status: 302,
	});
}
