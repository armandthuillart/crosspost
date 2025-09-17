"use client";

import { motion } from "motion/react";

export function ShiningText({ text }: { text: string }) {
	return (
		<motion.p
			animate={{ backgroundPosition: "-200% 0" }}
			className="w-fit bg-[length:200%_100%] bg-[linear-gradient(110deg,var(--color-foreground),35%,var(--color-background),50%,var(--color-foreground),75%,var(--color-foreground))] bg-clip-text font-regular text-base text-transparent"
			initial={{ backgroundPosition: "200% 0" }}
			transition={{ duration: 2, ease: "linear", repeat: Infinity }}
		>
			{text}
		</motion.p>
	);
}
