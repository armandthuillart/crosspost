import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { isDevelopment } from "@/lib/constants";

export async function GET() {
	const hs = await headers();
	const host = hs.get("host");
	const cookie = hs.get("cookie") ?? "";
	const protocol = isDevelopment ? "http" : "https";
	const cookieStore = await cookies();

	const disconnect = await fetch(`${protocol}://${host}/api/auth/sign-out`, {
		headers: { cookie },
		method: "POST",
		redirect: "manual",
	});

	const response = NextResponse.redirect(
		`${protocol}://${host}/api/auth/proxy/anonymous`,
		307,
	);

	const setCookie = disconnect.headers.get("set-cookie");

	if (setCookie) {
		response.headers.set("set-cookie", setCookie);
	}

	cookieStore.delete("remember");

	return response;
}
