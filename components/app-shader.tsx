"use client";

import { Dithering } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useMounted } from "@/hooks/use-mounted";

export function AppShader({
	size,
	speed,

	pxSize,
	darkColor,
	lightColor,
}: {
	size: number;
	speed: number;

	pxSize: number;
	darkColor: string;
	lightColor: string;
}) {
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
			className="rounded-full"
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
		/>
	);
}
