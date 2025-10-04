import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	devIndicators: {
		position: "bottom-right",
	},
	images: {
		remotePatterns: [
			{ hostname: "cdn.bsky.app" },
			{ hostname: "*.cdninstagram.com" },
		],
	},
	typedRoutes: true,
};

export default nextConfig;
