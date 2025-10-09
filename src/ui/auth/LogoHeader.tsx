import Image from "next/image";
import Link from "next/link";

export function LogoHeader() {
	return (
		<div className="mb-8 flex justify-center items-center -translate-x-5 translate-y-3">
			<Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition">
				<Image
					src="/calavera.svg"
					alt="Gbones Logo"
					width={140}
					height={140}
					className="h-32 w-32 md:h-36 md:w-36 drop-shadow-lg"
				/>
				<span className="text-xl md:text-2xl font-brand tracking-wide text-white drop-shadow-md -ml-5">
					Gbones
				</span>
			</Link>
		</div>
	);
}
