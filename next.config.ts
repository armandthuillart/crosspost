import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		browserDebugInfoInTerminal: true,
	},
	reactStrictMode: false,
	typedRoutes: true,
};

export default nextConfig;
