"use client";

import { Dithering, type DitheringProps } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

interface AppShaderProps extends DitheringProps {
	size: number;
	darkColor: string;
	lightColor: string;
}

export function AppShader({
	size,
	speed,
	pxSize,
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
		<Dithering
			className={cn("rounded-full", className)}
			colorBack="rgb(0, 0, 0, 0)"
			colorFront={colorFront}
			offsetX={0}
			offsetY={0}
			pxSize={pxSize}
			rotation={0}
			scale={1}
			shape="sphere"
			speed={speed}
			style={{ height: size, width: size }}
			type="4x4"
			{...props}
		/>
	);
}
