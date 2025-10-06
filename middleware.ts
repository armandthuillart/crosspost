import { geolocation } from "@vercel/functions";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "~/i18n/routing";

const i18nMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
	const { city, region, country } = geolocation(request);

	if (city && region && country) {
		request.headers.set("x-user-city", encodeURIComponent(city));
		request.headers.set("x-user-region", encodeURIComponent(region));
		request.headers.set("x-user-country", encodeURIComponent(country));
	}

	return i18nMiddleware(request);
}

export const config = {
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
