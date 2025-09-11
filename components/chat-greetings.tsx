"use client";

import { motion } from "motion/react";
import { AppShader } from "@/components/app-shader";

export function ChatGreetings() {
	return (
		<motion.div
			className="mx-auto size-20 max-md:my-auto"
			layout="position"
			layoutId="app-shader"
		>
			<AppShader colors={["rgb(51, 156, 255)"]} size={80} speed={1} />
		</motion.div>
	);
}
