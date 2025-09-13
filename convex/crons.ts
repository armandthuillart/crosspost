import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
	"Delete inactive anonymous users",
	{ hourUTC: 0, minuteUTC: 0 },
	internal.users.deleteAnonymousUsers,
	{},
);

export default crons;
