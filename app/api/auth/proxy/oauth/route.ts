import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { isDevelopment } from "@/lib/constants";

export async function GET() {
	const hs = await headers();
	const cookieStore = await cookies();

	// Build same-origin URL so cookies are scoped correctly.
	const host = hs.get("host");
	const protocol = isDevelopment ? "http" : "https";

	// Forward the client's cookies so upstream sees an existing Better Auth session (if any).
	const cookie = hs.get("cookie") ?? "";

	// Mint a fresh convex_jwt from the established Better Auth session.
	const refresh = await fetch(`${protocol}://${host}/api/auth/convex/token`, {
		headers: { cookie },
		method: "GET",
		redirect: "manual",
	});

	// Send the browser to "/" after sign-in. 307 keeps semantics (GET stays GET).
	const response = NextResponse.redirect(`${protocol}://${host}/`, 307);

	const setCookie = refresh.headers.get("set-cookie");

	if (setCookie) {
		// If cookies are present, attach them to our redirect.
		// Browsers apply Set-Cookie on redirects, so the client stores them before landing on "/".
		response.headers.set("set-cookie", setCookie);
	}

	cookieStore.delete("remember");

	return response;
}
