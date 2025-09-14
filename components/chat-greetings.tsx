"use client";

import { Swirl } from "@paper-design/shaders-react";

export function ChatGreetings() {
	return (
		<div className="mx-auto size-20 max-md:my-auto">
			<Swirl
				bandCount={1}
				className="rounded-full"
				colorBack="#339CFF"
				colors={["#FFFFFF"]}
				noise={0}
				noiseFrequency={0}
				offsetX={-0.3}
				offsetY={-0.5}
				rotation={0}
				scale={1}
				softness={0}
				speed={0.5}
				style={{ height: 80, width: 80 }}
				twist={0.3}
			/>
		</div>
	);
}
