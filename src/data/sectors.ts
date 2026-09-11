import { Heart, Users, BookOpen, Droplets, TreePine } from "lucide-react";
import type { Sector } from "@/types";

// Primary Blue from Logo: #1E4BB5
// Deep Black from Logo: #000000
export const SECTORS: Sector[] = [
    {
        id: "01",
        title: "Community Development",
        desc: "Inclusive welfare & grassroots engagement",
        icon: Users,
        color: "#1E4BB5",
    },
    {
        id: "02",
        title: "Education & Youth",
        desc: "Learning, leadership & youth empowerment",
        icon: BookOpen,
        color: "#2563EB",
    },
    {
        id: "03",
        title: "Health & WASH",
        desc: "Health awareness & sanitation support",
        icon: Droplets,
        color: "#1D4ED8",
    },
    {
        id: "04",
        title: "Livelihoods & Gender Equity",
        desc: "Women's empowerment & skills training",
        icon: Heart,
        color: "#1E3A8A",
    },
    {
        id: "05",
        title: "Climate & Humanitarian Action",
        desc: "Environment, resilience & emergency response",
        icon: TreePine,
        color: "#111827",
    },
];
