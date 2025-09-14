"use client";

import { Spiral } from "@paper-design/shaders-react";

export function ChatGreetings() {
	return (
		<div className="mx-auto size-20 max-md:my-auto">
			<Spiral
				className="rounded-full"
				colorBack="#ffffff"
				colorFront="#339cff"
				density={0.9}
				distortion={0}
				noise={0}
				noiseFrequency={0}
				offsetX={-0.3}
				offsetY={-0.6}
				rotation={208}
				scale={0.5}
				softness={0}
				speed={0.96}
				strokeCap={0}
				strokeTaper={0.13}
				strokeWidth={0.54}
				style={{ height: 80, width: 80 }}
			/>
		</div>
	);
}
