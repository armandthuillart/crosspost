"use client";

import { Dithering } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ChatGreetings() {
	return (
		<div className="mx-auto size-20">
			<Shader />
		</div>
	);
}

function Shader() {
	const { resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const themeReady =
		mounted && (resolvedTheme === "light" || resolvedTheme === "dark");

	if (!themeReady) {
		return null;
	}

	const isDark = resolvedTheme === "dark";
	const colorBack = isDark ? "rgb(33, 33, 33)" : "rgb(255, 255, 255)";
	const colorFront = isDark ? "rgb(1, 105, 204)" : "rgb(51, 156, 255)";

	return (
		<Dithering
			className="rounded-full"
			colorBack={colorBack}
			colorFront={colorFront}
			offsetX={0}
			offsetY={0}
			pxSize={1}
			rotation={0}
			scale={1}
			shape="sphere"
			speed={1}
			style={{ height: 80, width: 80 }}
			type="4x4"
		/>
	);
}
