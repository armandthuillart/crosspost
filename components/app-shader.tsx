"use client";

import { type SimplexNoiseProps, Swirl } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

interface AppShaderProps extends SimplexNoiseProps {
	size: number;
	darkColor: string;
	lightColor: string;
}

export function AppShader({
	size,
	speed,
	darkColor,
	className,
	lightColor,
	...props
}: AppShaderProps) {
	const { resolvedTheme } = useTheme();
	const mounted = useMounted();

	const themeReady =
		mounted && (resolvedTheme === "light" || resolvedTheme === "dark");

	if (!themeReady) {
		return null;
	}

	const isDark = resolvedTheme === "dark";
	const colorFront = isDark ? darkColor : lightColor;

	return (
		<Swirl
			bandCount={2}
			className={cn("rounded-full", className)}
			colorBack="rgb(255, 255, 255, 0)"
			colors={[colorFront]}
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
