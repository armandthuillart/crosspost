"use client";

import { Button } from "~/components/ui/button";
import { StarIcon } from "~/components/ui/icons";
import { checkout } from "~/lib/auth-client";

export function CTA() {
	async function handleCheckout() {
		await checkout({ slug: "pro" });
	}

	return (
		<div className="-translate-x-1/2 absolute start-1/2">
			<Button
				className="gap-1.5 rounded-full px-3"
				onClick={handleCheckout}
				variant="selection"
			>
				<StarIcon className="size-3.5" />
				Upgrade
			</Button>
		</div>
	);
}
