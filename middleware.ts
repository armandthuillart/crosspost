import { geolocation } from "@vercel/functions";
import { type NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { city, region, country } = geolocation(request);
	const { next } = NextResponse;

	const headers = new Headers(request.headers);

	if (city && region && country) {
		headers.set("x-user-city", city);
		headers.set("x-user-region", region);
		headers.set("x-user-country", country);
	}

	return next({ request: { headers } });
}

export const config = {
	matcher: ["/", "/c/:path"],
};
