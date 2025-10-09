"use client";

import type { SVGProps } from "react";

export const AppIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M11.75 1C5.84523 1 1 5.58838 1 11.3167C1 14.0644 2.11972 16.5565 3.93451 18.3994C4.20227 18.6713 4.28937 18.95 4.25088 19.1552C4.10863 19.9013 3.78697 20.5945 3.31917 21.1699C3.15224 21.3752 3.10586 21.6533 3.19713 21.9017C3.2884 22.15 3.50381 22.3319 3.76396 22.3803C5.37504 22.68 7.04542 22.41 8.47714 21.6486C8.6463 21.5318 9.12309 21.3268 9.67698 21.4416C10.3603 21.5699 11.0541 21.6343 11.75 21.6334C17.6548 21.6334 22.5 17.045 22.5 11.3167C22.5 5.58838 17.6548 1 11.75 1ZM9.5 12.5V12.75C9.5 13.9926 8.49264 15 7.25 15C6.83579 15 6.5 15.3358 6.5 15.75C6.5 16.1642 6.83579 16.5 7.25 16.5C9.32107 16.5 11 14.8211 11 12.75V8.75C11 7.7835 10.2165 7 9.25 7H7.25C6.2835 7 5.5 7.7835 5.5 8.75V10.75C5.5 11.7165 6.2835 12.5 7.25 12.5H9.5ZM16.5 12.5V12.75C16.5 13.9926 15.4926 15 14.25 15C13.8358 15 13.5 15.3358 13.5 15.75C13.5 16.1642 13.8358 16.5 14.25 16.5C16.3211 16.5 18 14.8211 18 12.75V8.75C18 7.7835 17.2165 7 16.25 7H14.25C13.2835 7 12.5 7.7835 12.5 8.75V10.75C12.5 11.7165 13.2835 12.5 14.25 12.5H16.5Z"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const SendIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M10.7999 19.2V7.69693L6.84834 11.6485C6.3797 12.1172 5.62009 12.1172 5.15146 11.6485C4.68283 11.1799 4.68283 10.4202 5.15146 9.95162L11.1515 3.95162L11.2429 3.86959C11.7142 3.48517 12.4089 3.51228 12.8484 3.95162L18.8484 9.95162L18.9303 10.043C19.3148 10.5144 19.2877 11.2092 18.8484 11.6485C18.4089 12.0879 17.7141 12.115 17.2429 11.7305L17.1515 11.6485L13.1999 7.69693V19.2C13.1999 19.8628 12.6626 20.4 11.9999 20.4C11.3372 20.4 10.7999 19.8628 10.7999 19.2Z" />
		</svg>
	);
};

export const LoaderIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M12 2C12.5523 2 13 2.44772 13 3V6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6V3C11 2.44772 11.4477 2 12 2Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M12 17C12.5523 17 13 17.4477 13 18V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V18C11 17.4477 11.4477 17 12 17Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M17 12C17 11.4477 17.4477 11 18 11L21 11C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H18C17.4477 13 17 12.5523 17 12Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M2 12C2 11.4477 2.44772 11 3 11L6 11C6.55228 11 7 11.4477 7 12C7 12.5523 6.55228 13 6 13H3C2.44772 13 2 12.5523 2 12Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M19.0706 4.92961C19.4611 5.32014 19.4611 5.9533 19.0706 6.34383L16.9493 8.46515C16.5588 8.85567 15.9256 8.85567 15.5351 8.46515C15.1446 8.07462 15.1446 7.44146 15.5351 7.05093L17.6564 4.92961C18.0469 4.53909 18.6801 4.53909 19.0706 4.92961Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M8.46515 15.5351C8.85567 15.9256 8.85567 16.5588 8.46515 16.9493L6.34383 19.0706C5.9533 19.4611 5.32014 19.4611 4.92961 19.0706C4.53909 18.6801 4.53909 18.0469 4.92961 17.6564L7.05093 15.5351C7.44146 15.1446 8.07462 15.1446 8.46515 15.5351Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M15.5351 15.5351C15.9256 15.1446 16.5588 15.1446 16.9493 15.5351L19.0706 17.6564C19.4611 18.0469 19.4611 18.6801 19.0706 19.0706C18.6801 19.4611 18.0469 19.4611 17.6564 19.0706L15.5351 16.9493C15.1446 16.5588 15.1446 15.9256 15.5351 15.5351Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M4.92961 4.92961C5.32014 4.53909 5.9533 4.53909 6.34383 4.92961L8.46515 7.05093C8.85567 7.44146 8.85567 8.07462 8.46515 8.46515C8.07462 8.85567 7.44146 8.85567 7.05093 8.46515L4.92961 6.34383C4.53909 5.9533 4.53909 5.32014 4.92961 4.92961Z"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const MenuIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M3 9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9C21 9.55229 20.5523 10 20 10H4C3.44772 10 3 9.55228 3 9Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M3 15C3 14.4477 3.44772 14 4 14H14C14.5523 14 15 14.4477 15 15C15 15.5523 14.5523 16 14 16H4C3.44772 16 3 15.5523 3 15Z"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const SearchIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C13.125 20 15.078 19.2635 16.6177 18.0319L20.2929 21.7071C20.6834 22.0976 21.3166 22.0976 21.7071 21.7071C22.0976 21.3166 22.0976 20.6834 21.7071 20.2929L18.0319 16.6177C19.2635 15.078 20 13.125 20 11C20 6.02944 15.9706 2 11 2ZM4 11C4 7.13401 7.13401 4 11 4C14.866 4 18 7.13401 18 11C18 14.866 14.866 18 11 18C7.13401 18 4 14.866 4 11Z"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const ScrollIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M13.2001 4.8L13.2001 16.3031L17.1517 12.3515C17.6203 11.8828 18.3799 11.8828 18.8485 12.3515C19.3172 12.8201 19.3172 13.5798 18.8485 14.0484L12.8485 20.0484L12.7571 20.1304C12.2858 20.5148 11.5911 20.4877 11.1516 20.0484L5.1516 14.0484L5.0697 13.957C4.6852 13.4856 4.7123 12.7908 5.1516 12.3515C5.5911 11.9121 6.2859 11.885 6.7571 12.2695L6.8485 12.3515L10.8001 16.3031L10.8001 4.8C10.8001 4.1372 11.3374 3.6 12.0001 3.6C12.6628 3.6 13.2001 4.1372 13.2001 4.8Z" />
		</svg>
	);
};

export const StopIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M12.0436 3.25C13.6463 3.24999 14.9086 3.24998 15.913 3.35586C16.9399 3.4641 17.7833 3.68971 18.5113 4.19945C19.0129 4.55072 19.4493 4.98706 19.8005 5.48872C20.3103 6.21671 20.5359 7.06008 20.6441 8.08697C20.75 9.0914 20.75 10.3537 20.75 11.9564V12.0436C20.75 13.6463 20.75 14.9086 20.6441 15.913C20.5359 16.9399 20.3103 17.7833 19.8005 18.5113C19.4493 19.0129 19.0129 19.4493 18.5113 19.8005C17.7833 20.3103 16.9399 20.5359 15.913 20.6441C14.9086 20.75 13.6463 20.75 12.0436 20.75H11.9564C10.3537 20.75 9.0914 20.75 8.08697 20.6441C7.06008 20.5359 6.21671 20.3103 5.48872 19.8005C4.98706 19.4493 4.55072 19.0129 4.19945 18.5113C3.68971 17.7833 3.4641 16.9399 3.35586 15.913C3.24998 14.9086 3.24999 13.6463 3.25 12.0436V11.9564C3.24999 10.3537 3.24998 9.0914 3.35586 8.08697C3.4641 7.06008 3.68971 6.21671 4.19945 5.48872C4.55072 4.98706 4.98706 4.55072 5.48872 4.19945C6.21671 3.68971 7.06008 3.4641 8.08697 3.35586C9.0914 3.24998 10.3537 3.24999 11.9564 3.25H12.0436Z"></path>
		</svg>
	);
};

export const CopyIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M9 15C9 12.1716 9 10.7574 9.87868 9.87868C10.7574 9 12.1716 9 15 9L16 9C18.8284 9 20.2426 9 21.1213 9.87868C22 10.7574 22 12.1716 22 15V16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H15C12.1716 22 10.7574 22 9.87868 21.1213C9 20.2426 9 18.8284 9 16L9 15Z"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M16.9999 9C16.9975 6.04291 16.9528 4.51121 16.092 3.46243C15.9258 3.25989 15.7401 3.07418 15.5376 2.90796C14.4312 2 12.7875 2 9.5 2C6.21252 2 4.56878 2 3.46243 2.90796C3.25989 3.07417 3.07418 3.25989 2.90796 3.46243C2 4.56878 2 6.21252 2 9.5C2 12.7875 2 14.4312 2.90796 15.5376C3.07417 15.7401 3.25989 15.9258 3.46243 16.092C4.51121 16.9528 6.04291 16.9975 9 16.9999"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const TickIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M19.9378 5.65241C20.1299 6.1702 19.8659 6.7457 19.3481 6.93782C18.2893 7.33068 17.1276 8.14841 15.9516 9.22885C14.7868 10.299 13.6643 11.574 12.6796 12.8107C11.6968 14.0449 10.8633 15.2254 10.2753 16.0981C9.98166 16.5339 9.75008 16.8917 9.59261 17.1394C9.51389 17.2632 9.45374 17.3594 9.41368 17.424L9.36885 17.4966L9.35809 17.5142L9.35569 17.5182C9.16686 17.8294 8.82329 18.0143 8.45951 17.9994C8.09567 17.9846 7.76866 17.7732 7.60581 17.4475C6.92848 16.0928 6.15935 15.3411 5.59956 14.934C5.31727 14.7287 5.08223 14.6067 4.93004 14.5391C4.85386 14.5052 4.79837 14.485 4.76806 14.4747C4.75528 14.4703 4.74701 14.4678 4.74357 14.4668C4.2162 14.3269 3.89733 13.7888 4.03009 13.2577C4.16404 12.7219 4.70698 12.3962 5.24277 12.5301C5.26751 12.5366 5.24397 12.5304 5.24397 12.5304L5.24521 12.5307L5.24783 12.5314L5.25365 12.5329L5.26751 12.5366C5.27773 12.5394 5.28991 12.5428 5.30396 12.5469C5.33206 12.5551 5.36767 12.5662 5.41014 12.5805C5.49507 12.6093 5.60755 12.6516 5.74231 12.7115C6.01199 12.8313 6.37071 13.0218 6.77591 13.3165C7.31867 13.7113 7.93487 14.2857 8.52893 15.1112C8.55757 15.0684 8.58683 15.0249 8.6167 14.9805C9.22537 14.0772 10.0905 12.8515 11.115 11.5648C12.1376 10.2807 13.3313 8.92028 14.5985 7.75607C15.8545 6.60213 17.2406 5.58653 18.6524 5.06272C19.1702 4.87061 19.7457 5.13462 19.9378 5.65241Z"
				fill="currentColor"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const ExternalLinkIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M8 5C7.44772 5 7 5.44772 7 6C7 6.55228 7.44772 7 8 7H15.5858L5.29289 17.2929C4.90237 17.6834 4.90237 18.3166 5.29289 18.7071C5.68342 19.0976 6.31658 19.0976 6.70711 18.7071L17 8.41421V16C17 16.5523 17.4477 17 18 17C18.5523 17 19 16.5523 19 16V6C19 5.44772 18.5523 5 18 5H8Z"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const CloseIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M17.293 5.29289C17.6835 4.90237 18.3165 4.90237 18.707 5.29289C19.0975 5.68342 19.0975 6.31643 18.707 6.70696L13.4131 11.9999L18.706 17.2929L18.7754 17.369C19.0954 17.7618 19.072 18.3409 18.706 18.7069C18.3399 19.073 17.7609 19.0957 17.3681 18.7753L17.292 18.7069L11.999 13.4139L6.70802 18.7059C6.3175 19.0965 5.68449 19.0964 5.29396 18.7059C4.90344 18.3154 4.90344 17.6824 5.29396 17.2919L10.5849 11.9999L5.29298 6.70793L5.22462 6.63176C4.90423 6.23901 4.92691 5.66001 5.29298 5.29387C5.65897 4.92788 6.23811 4.90454 6.63087 5.22453L6.70705 5.29387L11.999 10.5858L17.293 5.29289Z"
				fill="currentColor"
			/>
		</svg>
	);
};

export const LogOutIcon = ({ ...props }: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M7.00003 3C6.07006 3 5.60507 3 5.22357 3.10222C4.1883 3.37962 3.37966 4.18827 3.10225 5.22354C3.00003 5.60504 3.00003 6.07003 3.00003 7L3.00003 17C3.00003 17.93 3.00003 18.395 3.10225 18.7765C3.37965 19.8117 4.1883 20.6204 5.22357 20.8978C5.60507 21 6.07006 21 7.00003 21"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M16.5001 16.5C16.5001 16.5 21 13.1858 21 12C21 10.8141 16.5 7.5 16.5 7.5M20 12L8.00003 12"
				stroke="currentColor"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const XIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				className="stroke-black dark:stroke-white"
				d="M3 21L10.5484 13.4516M21 3L13.4516 10.5484M13.4516 10.5484L8 3H3L10.5484 13.4516M13.4516 10.5484L21 21H16L10.5484 13.4516"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const ThreadsIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				className="stroke-black dark:stroke-white"
				d="M19.25 8.50488C17.6729 2.63804 12.25 3.00452 12.25 3.00452C12.25 3.00452 4.75 2.50512 4.75 12C4.75 21.4949 12.25 20.9955 12.25 20.9955C12.25 20.9955 16.7077 21.2924 18.75 17.0782C19.4167 15.2204 19.25 11.5049 12.75 11.5049C12.75 11.5049 9.75 11.5049 9.75 14.0049C9.75 14.9812 10.75 16.0049 12.25 16.0049C13.75 16.0049 15.4212 14.9777 15.75 13.0049C16.75 7.00488 11.25 6.50488 9.75 9.00488"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const BlueskyIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="#1181F6"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M12 11.4963C11.8936 11.2963 7.45492 3 3.50417 3C1.33647 3 2.00456 8 2.50443 10.5C2.70653 11.5108 3.50417 14.5 8.003 14C8.003 14 4.00404 14.5 4.00404 17C4.00404 18.5 6.50339 21 8.50287 21C10.4606 21 11.9391 16.6859 12 16.5058C12.0609 16.6859 13.5394 21 15.4971 21C17.4966 21 19.996 18.5 19.996 17C19.996 14.5 15.997 14 15.997 14C20.4958 14.5 21.2935 11.5108 21.4956 10.5C21.9954 8 22.6635 3 20.4958 3C16.5451 3 12.1064 11.2963 12 11.4963Z" />
		</svg>
	);
};

export const LinkedInIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			height="24"
			viewBox="0 0 24 24"
			width="24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M4.41667 21.75H19.5833C20.78 21.75 21.75 20.78 21.75 19.5833V4.41667C21.75 3.22005 20.78 2.25 19.5833 2.25H4.41667C3.22005 2.25 2.25 3.22005 2.25 4.41667V19.5833C2.25 20.78 3.22005 21.75 4.41667 21.75Z"
				fill="#007EBB"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M17.75 17.75H15.3357V13.638C15.3357 12.5106 14.9074 11.8805 14.015 11.8805C13.0443 11.8805 12.5371 12.5362 12.5371 13.638V17.75H10.2104V9.91667H12.5371V10.9718C12.5371 10.9718 13.2367 9.67735 14.8989 9.67735C16.5605 9.67735 17.75 10.692 17.75 12.7904V17.75ZM7.43471 8.89096C6.6422 8.89096 6 8.24372 6 7.44548C6 6.64723 6.6422 6 7.43471 6C8.22722 6 8.86903 6.64723 8.86903 7.44548C8.86903 8.24372 8.22722 8.89096 7.43471 8.89096ZM6.23332 17.75H8.65943V9.91667H6.23332V17.75Z"
				fill="white"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const StarIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path d="M12 2.25C12.4142 2.25 12.75 2.58579 12.75 3C12.75 5.00608 13.7606 7.07493 15.3428 8.65717C16.9251 10.2394 18.9939 11.25 21 11.25C21.4142 11.25 21.75 11.5858 21.75 12C21.75 12.4142 21.4142 12.75 21 12.75C18.9939 12.75 16.9251 13.7606 15.3428 15.3428C13.7606 16.9251 12.75 18.9939 12.75 21C12.75 21.4142 12.4142 21.75 12 21.75C11.5858 21.75 11.25 21.4142 11.25 21C11.25 18.9939 10.2394 16.9251 8.65717 15.3428C7.07493 13.7606 5.00608 12.75 3 12.75C2.58579 12.75 2.25 12.4142 2.25 12C2.25 11.5858 2.58579 11.25 3 11.25C5.00608 11.25 7.07493 10.2394 8.65717 8.65717C10.2394 7.07493 11.25 5.00608 11.25 3C11.25 2.58579 11.5858 2.25 12 2.25Z" />
		</svg>
	);
};

export const MoreIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				clipRule="evenodd"
				d="M10.4922 12C10.4922 11.1716 11.1638 10.5 11.9922 10.5H12.0012C12.8296 10.5 13.5012 11.1716 13.5012 12C13.5012 12.8284 12.8296 13.5 12.0012 13.5H11.9922C11.1638 13.5 10.4922 12.8284 10.4922 12Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M16.492 12C16.492 11.1716 17.1636 10.5 17.992 10.5H18.001C18.8294 10.5 19.501 11.1716 19.501 12C19.501 12.8284 18.8294 13.5 18.001 13.5H17.992C17.1636 13.5 16.492 12.8284 16.492 12Z"
				fillRule="evenodd"
			/>
			<path
				clipRule="evenodd"
				d="M4.49982 12C4.49982 11.1716 5.17139 10.5 5.99982 10.5H6.0088C6.83723 10.5 7.5088 11.1716 7.5088 12C7.5088 12.8284 6.83723 13.5 6.0088 13.5H5.99982C5.17139 13.5 4.49982 12.8284 4.49982 12Z"
				fillRule="evenodd"
			/>
		</svg>
	);
};

export const PlusIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M12 4V20M20 12H4"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const TrashIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M19.5 5.5L18.6139 20.121C18.5499 21.1766 17.6751 22 16.6175 22H7.38246C6.32488 22 5.4501 21.1766 5.38612 20.121L4.5 5.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M3 5.5H8M21 5.5H16M16 5.5L14.7597 2.60608C14.6022 2.2384 14.2406 2 13.8406 2H10.1594C9.75937 2 9.39783 2.2384 9.24025 2.60608L8 5.5M16 5.5H8"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M9.5 16.5L9.5 10.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M14.5 16.5L14.5 10.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const AssistantsIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M5.44505 14.7749C5.60832 14.4695 5.88358 14.2462 6.22227 14.1851C6.56095 14.124 6.89427 14.2375 7.14978 14.4674M11.2356 17.7768C10.909 18.3876 10.3585 18.8342 9.68113 18.9564C9.00377 19.0786 8.33713 18.8516 7.82611 18.3919M10.5592 13.8523C10.7225 13.5469 10.9978 13.3235 11.3365 13.2624C11.6751 13.2013 12.0085 13.3149 12.264 13.5447M13.0697 7.64205C11.9191 8.7281 10.171 9.59181 8.13072 9.95991C6.09043 10.328 4.15906 10.1281 2.7148 9.51019C2.62237 9.47065 2.52281 9.45715 2.42629 9.47456C2.14172 9.5259 1.95507 9.82308 2.0094 10.1383L2.94728 15.5805C3.64672 19.6391 7.04654 21.5881 8.62355 22.2854C9.14604 22.5165 9.72177 22.546 10.2823 22.4449C10.8429 22.3437 11.374 22.1145 11.7877 21.7146C13.0366 20.5074 15.5798 17.4863 14.8804 13.4276L13.9425 7.98545C13.8882 7.6702 13.6135 7.45627 13.3289 7.50761C13.2324 7.52502 13.1433 7.57255 13.0697 7.64205Z"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M14.3157 17.5C14.6792 17.4998 15.039 17.4347 15.3764 17.2854C16.9535 16.5881 20.3533 14.6391 21.0527 10.5805L21.9906 5.13832C22.0449 4.82308 21.8583 4.5259 21.5737 4.47456C21.4772 4.45715 21.3776 4.47065 21.2852 4.51019C19.8409 5.1281 17.9096 5.328 15.8693 4.95991C13.829 4.59181 12.0809 3.7281 10.9303 2.64205C10.8567 2.57255 10.7676 2.52502 10.6711 2.50761C10.3865 2.45627 10.1118 2.6702 10.0575 2.98545L9.1196 8.42763C9.0374 8.90465 8.99998 9.36734 9 9.81444"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const LifeBuoyIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="2"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle cx="12" cy="12" r="10" />
			<path d="m4.93 4.93 4.24 4.24" />
			<path d="m14.83 9.17 4.24-4.24" />
			<path d="m14.83 14.83 4.24 4.24" />
			<path d="m9.17 14.83-4.24 4.24" />
			<circle cx="12" cy="12" r="4" />
		</svg>
	);
};

export const SignatureIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M22 12.6344C18 16.1465 17.4279 10.621 15.3496 11.0165C13 11.4637 11.5 16.4445 13 16.4445C14.5 16.4445 12.5 10.5 10.5 12.5556C8.5 14.6111 7.85936 17.2946 6.23526 15.3025C-1.5 5.81446 4.99998 -1.14994 8.16322 3.45685C10.1653 6.37256 6.5 16.9769 2 22"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M9 21H19"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const KeyboardKeyIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M8.12901 11.5977L12.128 6.20791C12.4407 5.78638 13.027 6.04874 13.027 6.61024V10.7819C13.027 11.1183 13.2569 11.391 13.5405 11.391H15.4855C15.9273 11.391 16.1629 12.0089 15.871 12.4023L11.872 17.7921C11.5593 18.2136 10.973 17.9513 10.973 17.3897V13.2181C10.973 12.8817 10.7431 12.609 10.4595 12.609H8.51449C8.07263 12.609 7.83711 11.9911 8.12901 11.5977Z"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="1.5"
			/>
			<path
				d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const ChevronRightIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M9.00005 6L15 12L9 18"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeMiterlimit="16"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const ShareIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M9.39583 4.5H8.35417C5.40789 4.5 3.93475 4.5 3.01946 5.37868C2.10417 6.25736 2.10417 7.67157 2.10417 10.5V14.5C2.10417 17.3284 2.10417 18.7426 3.01946 19.6213C3.93475 20.5 5.40789 20.5 8.35417 20.5H12.5608C15.5071 20.5 16.9802 20.5 17.8955 19.6213C18.4885 19.052 18.6973 18.2579 18.7708 17"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M16.1667 7V3.85355C16.1667 3.65829 16.3316 3.5 16.535 3.5C16.6326 3.5 16.7263 3.53725 16.7954 3.60355L21.5275 8.14645C21.7634 8.37282 21.8958 8.67986 21.8958 9C21.8958 9.32014 21.7634 9.62718 21.5275 9.85355L16.7954 14.3964C16.7263 14.4628 16.6326 14.5 16.535 14.5C16.3316 14.5 16.1667 14.3417 16.1667 14.1464V11H13.1157C8.875 11 7.3125 14.5 7.3125 14.5V12C7.3125 9.23858 9.64435 7 12.5208 7H16.1667Z"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const RedoIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M20.9991 3V4.27816C20.9991 6.47004 20.9991 7.56599 20.2918 8.16512C19.5846 8.76425 18.5036 8.58408 16.3415 8.22373L14.9991 8"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C15.3313 3 18.2398 4.80989 19.796 7.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const UndoIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C8.66873 3 5.76018 4.80989 4.20404 7.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M3 3V4.27816C3 6.47004 3 7.56599 3.70725 8.16512C4.4145 8.76425 5.49553 8.58408 7.6576 8.22373L9 8"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const LanguageIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
			<path
				d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M21 15H3"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M21 9H3"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const AppearanceIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12Z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M11.9982 2V4M11.9982 20V22M18.9981 5.00098L17.499 6.5M6.5 17.5L5 19M22 12H20M4 12H2M19 19.001L17.5 17.501M6.49902 6.5L5 5.00098"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const PaintBrushIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M5 14V12.7296C5 11.9754 5.42422 11.2854 6.09717 10.945L8.84085 9.55694C9.5139 9.21645 9.93814 8.52627 9.93802 7.772L9.93726 3.00016C9.93717 2.44781 10.3849 2 10.9373 2H13.9455C14.4978 2 14.9456 2.44781 14.9455 3.00016L14.9447 7.75902C14.9446 8.52006 15.3764 9.21521 16.0587 9.55236L18.886 10.9495C19.5682 11.2866 20 11.9816 20 12.7425L20 14C20 14.5523 19.5523 15 19 15H6C5.44772 15 5 14.5523 5 14Z"
				stroke="currentColor"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M6 15C6 16 6 18.8 4 22C9 22 13 22 15.5 18V21C15.5 21.5523 15.9477 22 16.5 22H19C19.5523 22 20.002 21.5518 19.9972 20.9995C19.9803 19.0494 19.8596 17.5789 19 15"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const SettingsIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M3 7H6"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M3 17H9"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M18 17L21 17"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M15 7L21 7"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M6 7C6 6.06812 6 5.60218 6.15224 5.23463C6.35523 4.74458 6.74458 4.35523 7.23463 4.15224C7.60218 4 8.06812 4 9 4C9.93188 4 10.3978 4 10.7654 4.15224C11.2554 4.35523 11.6448 4.74458 11.8478 5.23463C12 5.60218 12 6.06812 12 7C12 7.93188 12 8.39782 11.8478 8.76537C11.6448 9.25542 11.2554 9.64477 10.7654 9.84776C10.3978 10 9.93188 10 9 10C8.06812 10 7.60218 10 7.23463 9.84776C6.74458 9.64477 6.35523 9.25542 6.15224 8.76537C6 8.39782 6 7.93188 6 7Z"
				strokeWidth="2"
			/>
			<path
				d="M12 17C12 16.0681 12 15.6022 12.1522 15.2346C12.3552 14.7446 12.7446 14.3552 13.2346 14.1522C13.6022 14 14.0681 14 15 14C15.9319 14 16.3978 14 16.7654 14.1522C17.2554 14.3552 17.6448 14.7446 17.8478 15.2346C18 15.6022 18 16.0681 18 17C18 17.9319 18 18.3978 17.8478 18.7654C17.6448 19.2554 17.2554 19.6448 16.7654 19.8478C16.3978 20 15.9319 20 15 20C14.0681 20 13.6022 20 13.2346 19.8478C12.7446 19.6448 12.3552 19.2554 12.1522 18.7654C12 18.3978 12 17.9319 12 17Z"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const HelpIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle
				cx="12"
				cy="12"
				r="10"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M9.5 9.5C9.5 8.11929 10.6193 7 12 7C13.3807 7 14.5 8.11929 14.5 9.5C14.5 10.3569 14.0689 11.1131 13.4117 11.5636C12.7283 12.0319 12 12.6716 12 13.5"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M12.0001 17H12.009"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const PrintIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M7.35396 18C5.23084 18 4.16928 18 3.41349 17.5468C2.91953 17.2506 2.52158 16.8271 2.26475 16.3242C1.87179 15.5547 1.97742 14.5373 2.18868 12.5025C2.36503 10.8039 2.45321 9.95455 2.88684 9.33081C3.17153 8.92129 3.55659 8.58564 4.00797 8.35353C4.69548 8 5.58164 8 7.35396 8H16.646C18.4184 8 19.3045 8 19.992 8.35353C20.4434 8.58564 20.8285 8.92129 21.1132 9.33081C21.5468 9.95455 21.635 10.8039 21.8113 12.5025C22.0226 14.5373 22.1282 15.5547 21.7352 16.3242C21.4784 16.8271 21.0805 17.2506 20.5865 17.5468C19.8307 18 18.7692 18 16.646 18"
				strokeWidth="2"
			/>
			<path
				d="M17 8V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V8"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M13.9887 16L10.0113 16C9.32602 16 8.98337 16 8.69183 16.1089C8.30311 16.254 7.97026 16.536 7.7462 16.9099C7.57815 17.1904 7.49505 17.5511 7.32884 18.2724C7.06913 19.3995 6.93928 19.963 7.02759 20.4149C7.14535 21.0174 7.51237 21.5274 8.02252 21.7974C8.40513 22 8.94052 22 10.0113 22L13.9887 22C15.0595 22 15.5949 22 15.9775 21.7974C16.4876 21.5274 16.8547 21.0174 16.9724 20.4149C17.0607 19.963 16.9309 19.3995 16.6712 18.2724C16.505 17.5511 16.4218 17.1904 16.2538 16.9099C16.0297 16.536 15.6969 16.254 15.3082 16.1089C15.0166 16 14.674 16 13.9887 16Z"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M18 12H18.009"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const MailIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M2 6L8.91302 9.91697C11.4616 11.361 12.5384 11.361 15.087 9.91697L22 6"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M2.01577 13.4756C2.08114 16.5412 2.11383 18.0739 3.24496 19.2094C4.37608 20.3448 5.95033 20.3843 9.09883 20.4634C11.0393 20.5122 12.9607 20.5122 14.9012 20.4634C18.0497 20.3843 19.6239 20.3448 20.7551 19.2094C21.8862 18.0739 21.9189 16.5412 21.9842 13.4756C22.0053 12.4899 22.0053 11.5101 21.9842 10.5244C21.9189 7.45886 21.8862 5.92609 20.7551 4.79066C19.6239 3.65523 18.0497 3.61568 14.9012 3.53657C12.9607 3.48781 11.0393 3.48781 9.09882 3.53656C5.95033 3.61566 4.37608 3.65521 3.24495 4.79065C2.11382 5.92608 2.08114 7.45885 2.01576 10.5244C1.99474 11.5101 1.99475 12.4899 2.01577 13.4756Z"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};

export const SquareLinkIcon = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			aria-hidden="true"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<path
				d="M11.0991 3.00012C7.45013 3.00669 5.53932 3.09629 4.31817 4.31764C3.00034 5.63568 3.00034 7.75704 3.00034 11.9997C3.00034 16.2424 3.00034 18.3638 4.31817 19.6818C5.63599 20.9999 7.75701 20.9999 11.9991 20.9999C16.241 20.9999 18.3621 20.9999 19.6799 19.6818C20.901 18.4605 20.9906 16.5493 20.9972 12.8998"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
			<path
				d="M20.556 3.49612L11.0487 13.0586M20.556 3.49612C20.062 3.00151 16.7343 3.04761 16.0308 3.05762M20.556 3.49612C21.05 3.99074 21.0039 7.32273 20.9939 8.02714"
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth="2"
			/>
		</svg>
	);
};
