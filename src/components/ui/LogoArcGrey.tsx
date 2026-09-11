import Image from "next/image";
import type { LogoArcIconProps } from "@/types";

export const LogoArcGrey: React.FC<LogoArcIconProps> = ({ className }) => (
    <Image
        src="/logoArcGrey.svg"
        alt="APUN Arc Logo"
        width={200}
        height={100}
        className={className}
    />
);
