"use client";

import { type SimplexNoiseProps, Swirl } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

interface AppShaderProps extends SimplexNoiseProps {
	size: number;
}

export function AppShader({
	size,
	speed,
	className,
	...props
}: AppShaderProps) {
	return (
		<Swirl
			bandCount={2}
			className={cn("rounded-full", className)}
			colorBack="rgb(255, 255, 255, 0)"
			noise={0}
			noiseFrequency={0}
			offsetX={-0.4}
			offsetY={1}
			rotation={0}
			scale={1}
			softness={3}
			speed={0.5}
			style={{ height: size, width: size }}
			twist={0.3}
			{...props}
		/>
	);
}
