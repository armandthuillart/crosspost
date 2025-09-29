import { cronJobs } from "convex/server";
import { internal } from "~/convex/betterAuth/generated/api";

const crons = cronJobs();

crons.interval(
	"Tidy up anonymous users",
	{ hours: 24 },
	internal.auth.tidyUpAnonymousUsers,
	{},
);

export default crons;
