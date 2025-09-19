import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isDevelopment } from "@/lib/constants";

// Anonymous sign-in proxy that ensures Convex JWT is minted before redirect.
export async function GET() {
	const hs = await headers();
	const host = hs.get("host");
	const protocol = isDevelopment ? "http" : "https";
	const url = `${protocol}://${host}/api/auth/sign-in/anonymous`;

	const cookie = hs.get("cookie") ?? "";

	// Try to refresh existing Convex JWT first.
	const refresh = await fetch(`${protocol}://${host}/api/auth/convex/token`, {
		headers: { cookie },
		method: "GET",
		redirect: "manual",
	});

	let upstream: Response;
	const cookiesToSet: string[] = [];

	if (refresh.ok) {
		// Use existing session.
		upstream = refresh;

		const refreshCookie = refresh.headers.get("set-cookie");

		if (refreshCookie) {
			cookiesToSet.push(refreshCookie);
		}
	} else {
		// Create new anonymous session.
		upstream = await fetch(url, { method: "POST", redirect: "manual" });

		if (upstream.ok) {
			const session = upstream.headers.get("set-cookie");

			if (session) {
				cookiesToSet.push(session);
			}

			// Mint Convex JWT after session creation.
			const mint = await fetch(`${protocol}://${host}/api/auth/convex/token`, {
				headers: { cookie: session ?? cookie },
				method: "GET",
				redirect: "manual",
			});

			if (mint.ok) {
				const token = mint.headers.get("set-cookie");

				if (token) {
					cookiesToSet.push(token);
				}
			}
		}
	}

	const response = NextResponse.redirect(`${protocol}://${host}/`, 307);

	cookiesToSet.forEach((cookie) => {
		response.headers.append("set-cookie", cookie);
	});

	return response;
}
