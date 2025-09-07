"use client";

import { AppShader } from "@/components/app-shader";

export function ChatGreetings() {
	return (
		<div className="mx-auto size-20 max-md:my-auto">
			<AppShader
				darkColor="rgb(1, 105, 204)"
				lightColor="rgb(51, 156, 255)"
				pxSize={1}
				size={80}
				speed={1}
			/>
		</div>
	);
}
