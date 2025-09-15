import { fetchMutation } from "convex/nextjs";
import { Effect } from "effect";
import { redirect } from "next/navigation";
import { ChatSDKError } from "@/lib/errors";
import { api } from "../../../../convex/betterAuth/_generated/api";
import { getToken } from "../../../../lib/auth-server";

export async function GET() {
	return Effect.runPromise(
		Effect.gen(function* () {
			const token = yield* Effect.promise(() => getToken());

			if (!token) {
				throw new ChatSDKError(
					"bad_request:auth",
					"Failed to get token",
				).toResponse();
			}

			const result = yield* Effect.promise(() =>
				fetchMutation(api.auth.signInAnonymous, {}, { token }),
			);

			if (!result) {
				throw new ChatSDKError(
					"bad_request:auth",
					"Failed to sign in anonymously",
				).toResponse();
			}

			return redirect("/");
		}),
	);
}
