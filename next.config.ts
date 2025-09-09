import { withBotId } from "botid/next/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	typedRoutes: true,
};

export default withBotId(nextConfig);
