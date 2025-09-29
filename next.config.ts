import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},
	experimental: {
		browserDebugInfoInTerminal: true,
		turbopackPersistentCaching: true,
	},
	typedRoutes: true,
};

export default nextConfig;
