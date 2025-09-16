import { fetchMutation } from "convex/nextjs";
import { redirect } from "next/navigation";
import { ChatSDKError } from "@/lib/errors";
import { api } from "../../../../convex/_generated/api";
import { getToken } from "../../../../lib/auth-server";

export async function GET() {
	const token = await getToken();

	if (!token) {
		const result = await fetchMutation(api.auth.signInAnonymous, {}, { token });

		if (!result) {
			throw new ChatSDKError("bad_request:auth");
		}
	}

	return redirect("/");
}
