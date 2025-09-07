import { NextResponse } from "next/server";

export async function GET(request: Request) {
	// 1. Make a POST request to the sign-in/anonymous endpoint.
	const url = new URL("/api/auth/sign-in/anonymous", request.url);

	const response = await fetch(url, {
		method: "POST",
		redirect: "manual",
	});

	// 2. Redirect to "/".
	const output = NextResponse.redirect(new URL("/", request.url), 307);

	// 3. Forward cookies to the browser.
	const setCookie = response.headers.get("set-cookie");

	if (setCookie) {
		output.headers.append("set-cookie", setCookie);
	}

	// 4. Return the response, including the cookies.
	return output;
}
