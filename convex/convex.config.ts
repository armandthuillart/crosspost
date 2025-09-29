import agent from "@convex-dev/agent/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import { defineApp } from "convex/server";
import betterAuth from "~/convex/betterAuth/convex.config";

const app = defineApp();
app.use(agent);
app.use(betterAuth);
app.use(rateLimiter);

export default app;
