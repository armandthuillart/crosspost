import { Polar } from "@polar-sh/sdk";
import { isProduction } from "./constants";

export const polarClient = new Polar({
	accessToken: process.env.POLAR_ACCESS_TOKEN,
	server: isProduction ? "production" : "sandbox",
});
