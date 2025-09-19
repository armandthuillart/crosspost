import { cookies, headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { isDevelopment } from "@/lib/constants";

export async function GET(request: NextRequest) {
	const hs = await headers();
	const cookieStore = await cookies();
	const searchParams = request.nextUrl.searchParams;
	const threadId = searchParams.get("threadId");

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

	// Send the browser to "/" or "/c/{threadId}" after sign-in. 307 keeps semantics (GET stays GET).
	const response = NextResponse.redirect(
		`${protocol}://${host}/${threadId ? `c/${threadId}` : ""}`,
		307,
	);

	const setCookie = refresh.headers.get("set-cookie");

	if (setCookie) {
		// If cookies are present, attach them to our redirect.
		// Browsers apply Set-Cookie on redirects, so the client stores them before landing on "/".
		response.headers.set("set-cookie", setCookie);
	}

	cookieStore.delete("remember");

	return response;
}
