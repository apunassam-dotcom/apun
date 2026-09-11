export const GrainTexture: React.FC = () => (
    <>
        {/* Film grain */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] mix-blend-overlay">
            <svg className="w-full h-full">
                <filter id="noise">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.85"
                        numOctaves="4"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
        </div>

        {/* Subtle gradient overlay */}
        <div className="fixed inset-0 pointer-events-none z-[99] bg-gradient-to-br from-[#1E4BB5]/[0.02] via-transparent to-[#06B6D4]/[0.02]" />
    </>
);
