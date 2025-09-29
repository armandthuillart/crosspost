import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		browserDebugInfoInTerminal: true,
		turbopackPersistentCaching: true,
	},
	typedRoutes: true,
};

export default nextConfig;
