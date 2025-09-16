import { fetchMutation } from "convex/nextjs";
import { Effect } from "effect";
import { redirect } from "next/navigation";
import { ChatSDKError } from "@/lib/errors";
import { api } from "../../../../convex/_generated/api";
import { getToken } from "../../../../lib/auth-server";

export async function GET() {
	return Effect.runPromise(
		Effect.gen(function* () {
			const token = yield* Effect.tryPromise(() => getToken());

			if (!token) {
				const result = yield* Effect.promise(() =>
					fetchMutation(api.auth.signInAnonymous, {}, { token }),
				);

				if (!result) {
					console.log("no result", result);
					throw new ChatSDKError(
						"bad_request:auth",
						"Failed to sign in anonymously",
					);
				}

				console.log("created anonymous user", result);
			}

			console.log("redirecting to /");
			return redirect("/");
		}),
	);
}
