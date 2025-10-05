import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},
	experimental: {
		reactCompiler: true,
	},
	images: {
		remotePatterns: [
			{ hostname: "cdn.bsky.app" },
			{ hostname: "static.licdn.com" },
			{ hostname: "*.cdninstagram.com" },
		],
	},
	typedRoutes: true,
};

export default nextConfig;
