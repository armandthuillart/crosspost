import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	experimental: {
		browserDebugInfoInTerminal: true,
	},
	// Streaming doesn't play well with applying deltas right now.
	// https://discord.com/channels/1019350475847499849/1369043426561233018/1414823892702335078
	reactStrictMode: false,
	typedRoutes: true,
};

export default nextConfig;
