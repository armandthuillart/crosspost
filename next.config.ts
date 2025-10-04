import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
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
