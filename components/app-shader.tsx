"use client";

import { Swirl, type SwirlProps } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

export function AppShader({ className, ...props }: SwirlProps) {
	return (
		<Swirl
			className={cn("rounded-full", className)}
			colorBack="rgb(255, 255, 255, 0)"
			colors={["rgb(51, 150, 255)"]}
			noise={0}
			noiseFrequency={0}
			offsetX={-0.4}
			offsetY={1}
			rotation={0}
			scale={1}
			softness={3}
			speed={0.5}
			twist={0.3}
			{...props}
		/>
	);
}
