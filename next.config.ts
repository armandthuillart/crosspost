import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	devIndicators: { position: "top-right" },
	reactCompiler: true,
	typedRoutes: true,
};

const withNextIntl = createNextIntlPlugin();
const withMDX = createMDX();

export default withNextIntl(withMDX(nextConfig));
