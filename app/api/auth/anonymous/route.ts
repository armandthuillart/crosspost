import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isDevelopment } from "@/lib/constants";

// POST proxy that forwards cookies, then redirects to "/".
export async function GET() {
	const hs = await headers();

	// Build same-origin URL so cookies are scoped correctly.
	const host = hs.get("host");
	const protocol = isDevelopment ? "http" : "https";
	const url = `${protocol}://${host}/api/auth/sign-in/anonymous`;

	// Forward the client's cookies so upstream sees an existing Better Auth session (if any).
	const cookie = hs.get("cookie") ?? "";

	// First, try to mint a fresh Convex JWT from the existing session (no new user creation).
	const refresh = await fetch(`${protocol}://${host}/api/auth/convex/token`, {
		headers: { cookie },
		method: "GET",
		redirect: "manual",
	});

	// If refresh fails (no session), fall back to create an anonymous session.
	const upstream = refresh.ok
		? refresh
		: await fetch(url, { method: "POST", redirect: "manual" });

	// Send the browser to "/" after sign-in. 307 keeps semantics (GET stays GET).
	const response = NextResponse.redirect(`${protocol}://${host}/`, 307);

	// Capture Set-Cookie so Better Auth sets the session cookie and the Convex plugin sets "convex_jwt".
	// We only need "convex_jwt" for SSR token reads, but forward whatever is present.
	const setCookie = upstream.headers.get("set-cookie");

	if (setCookie) {
		// If cookies are present, attach them to our redirect.
		// Browsers apply Set-Cookie on redirects, so the client stores them before landing on "/".
		response.headers.set("set-cookie", setCookie);
	}

	return response;
}
