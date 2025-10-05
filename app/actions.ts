import { headers } from "next/headers";

export async function getLocation() {
	const headersList = await headers();

	return {
		city: headersList.get("x-user-city")
			? decodeURIComponent(headersList.get("x-user-city")!)
			: undefined,
		country: headersList.get("x-user-country")
			? decodeURIComponent(headersList.get("x-user-country")!)
			: undefined,
		region: headersList.get("x-user-region")
			? decodeURIComponent(headersList.get("x-user-region")!)
			: undefined,
	};
}
