import type { LucideIcon } from "lucide-react";

export interface Sector {
    id: string;
    title: string;
    desc: string;
    icon: LucideIcon;
    color: string;
}

export interface Position {
    x: number;
    y: number;
}

export interface MagneticButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary";
}

export interface LogoArcIconProps {
    className?: string;
}

export interface NavbarProps {
    onMenuOpen: () => void;
}

export interface MenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface SectorCardProps {
    sector: Sector;
}

export interface ContactInfoProps {
    label: string;
    value: string;
    icon: LucideIcon;
}
