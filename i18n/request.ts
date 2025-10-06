import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "~/i18n/routing";

export default getRequestConfig(async ({ requestLocale }) => {
	const requestedLocale = await requestLocale;

	const currentLocale = hasLocale(routing.locales, requestedLocale)
		? requestedLocale
		: routing.defaultLocale;

	return {
		locale: currentLocale,
		messages: (await import(`../messages/${currentLocale}.json`)).default,
	};
});
