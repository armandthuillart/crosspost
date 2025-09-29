"use client";

import { Spiral } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";

export function ChatGreetings() {
	const { resolvedTheme } = useTheme();
	return (
		<div className="mx-auto size-20 max-md:my-auto">
			<Spiral
				className="rounded-full"
				colorBack="rgb(255, 255, 255, 0)"
				colorFront={resolvedTheme === "dark" ? "#FFFFFF" : "#339CFF"}
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
