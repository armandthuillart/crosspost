import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
	"Delete anonymous users",
	{ hourUTC: 0, minuteUTC: 0 },
	internal.auth.deleteInactiveAnonymousUsers,
	{},
);

export default crons;
