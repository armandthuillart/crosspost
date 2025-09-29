"use client";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export function WelcomeBack() {
	async function handleSignInWithGoogle() {
		await authClient.signIn.social({
			callbackURL: "/api/auth/proxy/oauth",
			provider: "google",
		});
	}

	return (
		<AlertDialog defaultOpen>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Welcome back</AlertDialogTitle>
					<AlertDialogDescription>
						Log in or sign up to post to your social media, for more messages,
						and more.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="flex flex-col gap-5">
					<div className="flex flex-col gap-3">
						<Button
							className="h-11 rounded-full"
							onClick={handleSignInWithGoogle}
							size="lg"
						>
							Log in
						</Button>

						<Button
							className="h-11 rounded-full"
							onClick={handleSignInWithGoogle}
							size="lg"
							variant="outline"
						>
							Sign up for free
						</Button>
					</div>

					<AlertDialogCancel asChild>
						<Button className="mx-auto w-fit" variant="link">
							Stay logged out
						</Button>
					</AlertDialogCancel>
				</div>
			</AlertDialogContent>
		</AlertDialog>
	);
}
