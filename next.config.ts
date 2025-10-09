import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
