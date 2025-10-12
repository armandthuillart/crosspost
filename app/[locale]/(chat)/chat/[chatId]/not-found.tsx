import { useTranslations } from "next-intl";
import { Button } from "~/components/ui/button";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Link } from "~/i18n/navigation";

export default function ChatNotFound() {
	const t = useTranslations("NotFound");

	return (
		<main className="relative flex size-full flex-col items-center justify-center gap-4 text-center">
			<SidebarTrigger className="absolute top-2 left-2" />

			<div className="flex flex-col">
				<h2 className="font-semibold text-2xl leading-relaxed">
					{t("chat.title")}
				</h2>
				<p className="text-muted-foreground leading-normal">
					{t("chat.description")}
				</p>
			</div>

			<Button asChild className="rounded-full">
				<Link href="/">{t("chat.button")}</Link>
			</Button>
		</main>
	);
}
