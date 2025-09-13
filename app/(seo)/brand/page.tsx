import { Dithering } from "@paper-design/shaders-react";

export default function Page() {
	return (
		<div className="h-dvh">
			<Hero />
			<Demo />
		</div>
	);
}

function Hero() {
	return (
		<div className="gap-4 px-6 pt-20 pb-4 md:px-12 md:pt-38 md:pb-18">
			<div className="mx-auto flex w-full max-w-5xl flex-col items-end md:flex-row md:justify-between">
				<h1 className="font-medium text-4xl leading-snug tracking-tight md:text-5xl">
					Branding
				</h1>
				<p className="text-muted-foreground text-xl leading-normal tracking-tight">
					Assets, examples, and guides.
				</p>
			</div>
		</div>
	);
}

function Demo() {
	return (
		<div className="px-5 max-md:py-12 md:px-12">
			<div className="mx-auto grid h-52.5 w-full max-w-5xl gap-6 md:h-100 md:grid-cols-[2fr_1fr] md:grid-rows-[1fr_1fr]">
				<div className="flex items-center justify-center gap-4 rounded-lg bg-primary p-16 md:row-span-2">
					<Dithering
						className="rounded-full"
						colorBack="rgb(255, 255, 255, 0)"
						colorFront="rgb(255, 255, 255)"
						offsetX={0}
						offsetY={0}
						pxSize={1}
						rotation={0}
						scale={1}
						shape="sphere"
						speed={1}
						style={{ height: 100, width: 100 }}
						type="8x8"
					/>
					<p className="font-medium text-7xl text-primary-foreground tracking-tighter">
						Alcove
					</p>
				</div>
				<div className="rounded-lg"></div>
				<div className="rounded-lg border"></div>
			</div>
		</div>
	);
}
