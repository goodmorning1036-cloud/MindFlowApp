import React from 'react';

// Supercar — High-fidelity rear 3/4 perspective
// Matches the reference image: low profile, wide stance, signature cyan/pink neon brackets
export const CarIcon = ({ color = "#00E5FF", width = 240, height = 150 }: { color?: string; width?: number; height?: number }) => (
    <svg width={width} height={height} viewBox="0 0 300 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="carBodyGrad" x1="150" y1="20" x2="150" y2="140" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4A5260" />
                <stop offset="50%" stopColor="#2D323C" />
                <stop offset="100%" stopColor="#1A1D24" />
            </linearGradient>
            <linearGradient id="roofHighlight" x1="100" y1="30" x2="200" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="neonGlowEffect" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="carShadowEffect" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" />
            </filter>
        </defs>

        {/* Soft ground shadow */}
        <ellipse cx="150" cy="145" rx="110" ry="10" fill="rgba(0,0,0,0.6)" filter="url(#carShadowEffect)" />

        {/* Tires - Subtle, tucked under body */}
        <path d="M45 120 Q40 120 40 135 L60 140 L65 125 Z" fill="#0A0C10" />
        <path d="M235 120 Q240 120 240 135 L220 140 L215 125 Z" fill="#0A0C10" />

        {/* Main Body Shell - Sharper, more aggressive supercar silhouette */}
        <path d="
            M40 140
            L20 120
            L30 80
            L80 40
            L220 40
            L270 80
            L280 120
            L260 140
            Z
        " fill="url(#carBodyGrad)" />

        {/* Roof / Windshield - Low profile and angular */}
        <path d="
            M90 70
            L110 45
            L190 45
            L210 70
            Z
        " fill="#0F1218" />
        <path d="M115 50 L185 50" stroke="url(#roofHighlight)" strokeWidth="1.5" opacity="0.6" />

        {/* Rear Lights Panel - Integrated and sharper */}
        <path d="M50 95 L250 95 L255 130 L45 130 Z" fill="#0A0C10" />

        {/* SIGNATURE NEON LIGHTS (Sharp Cyan Brackets) */}
        <g filter="url(#neonGlowEffect)">
            {/* Left Bracket - Sharpened angles */}
            <path d="M105 102 L65 102 L60 115 L65 128 L105 128" 
                stroke={color} strokeWidth="3" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
            <path d="M85 110 L75 115 L85 120" 
                stroke="#FF3CCA" strokeWidth="2.5" fill="none" strokeLinecap="square" strokeLinejoin="miter" />

            {/* Right Bracket - Sharpened angles */}
            <path d="M195 102 L235 102 L240 115 L235 128 L195 128" 
                stroke={color} strokeWidth="3" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
            <path d="M215 110 L225 115 L215 120" 
                stroke="#FF3CCA" strokeWidth="2.5" fill="none" strokeLinecap="square" strokeLinejoin="miter" />
            
            {/* Connecting center bar */}
            <path d="M130 115 L170 115" 
                stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="butt" />
        </g>

        {/* Body creases for 3D depth */}
        <path d="M30 80 L80 40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <path d="M270 80 L220 40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        <path d="M40 140 L260 140" stroke="rgba(0,0,0,0.5)" strokeWidth="1.5" />


        {/* Aero lines / Diffuser details */}
        <path d="M130 135 L170 135" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <path d="M40 100 Q150 110 260 100" stroke="rgba(0,0,0,0.3)" strokeWidth="2" fill="none" />
    </svg>
);

// Ghost: Spectral Entity — wispy silhouette moving away with a trailing energy tail
export const GhostIcon = ({ opacity = 0.9 }: { opacity?: number }) => (
    <svg width="70" height="110" viewBox="0 0 70 110" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
        <defs>
            <radialGradient id="ghostSoul" cx="50%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#E0FBFF" />
                <stop offset="100%" stopColor="#00E5FF" />
            </radialGradient>
            <filter id="ghostAuraGlow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="12" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>

        {/* Outer spectral aura */}
        <ellipse cx="35" cy="55" rx="30" ry="45" fill="rgba(0, 229, 255, 0.25)" filter="url(#ghostAuraGlow)" />

        {/* Main Spirit Body - Elongated with flowing, trailing energy base */}
        <path d="
            M35 10 
            C15 10 10 35 10 55 
            C10 75 18 85 15 105 
            L28 95 L35 105 L42 95 L55 105 
            C52 85 60 75 60 55 
            C60 35 55 10 35 10 Z
        " fill="url(#ghostSoul)" filter="url(#ghostAuraGlow)" />

        {/* Floating energy wisps / spectral trails */}
        <path d="M18 40 Q8 60 15 85" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4">
            <animate attributeName="d" values="M18 40 Q8 60 15 85;M18 40 Q2 60 15 85;M18 40 Q8 60 15 85" dur="2.5s" repeatCount="indefinite" />
        </path>
        <path d="M52 40 Q62 60 55 85" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4">
            <animate attributeName="d" values="M52 40 Q62 60 55 85;M52 40 Q68 60 55 85;M52 40 Q62 60 55 85" dur="2.8s" repeatCount="indefinite" />
        </path>

        {/* Internal core glow highlight */}
        <ellipse cx="35" cy="40" rx="12" ry="20" fill="rgba(255, 255, 255, 0.5)" filter="url(#ghostAuraGlow)" />

        {/* Highlight sheen for 3D depth */}
        <path d="M22 16 C19 25 18 36 19 46 C21 42 24 36 25 28 Z" fill="rgba(255, 255, 255, 0.7)" />

        {/* Ground shadow */}
        <ellipse cx="35" cy="104" rx="16" ry="4" fill="rgba(0,0,0,0.5)" />
    </svg>
);

export const TreeIcon = () => (
    <svg width="40" height="60" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2L38 28H2L20 2Z" stroke="#00E5FF" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d="M20 22L38 48H2L20 22Z" stroke="#00E5FF" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <path d="M18 48H22V58H18V48Z" stroke="#00E5FF" strokeWidth="1.5" />
        <circle cx="20" cy="15" r="2" fill="#00E5FF" />
        <circle cx="20" cy="35" r="2" fill="#00E5FF" />
    </svg>
);

export const SparkIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="white" />
    </svg>
);

// Geometric Holographic Tree - Premium High-Detail Version
export const GhostlyTreeIcon = ({ color = "#00E5FF" }: { color?: string }) => {
    const gradientId = `treeGradient_${color.replace('#', '')}`;
    return (
        <svg width="80" height="100" viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id={gradientId} x1="40" y1="10" x2="40" y2="60" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" stopOpacity="0.8" />
                    <stop offset="1" stopColor={color} stopOpacity="0.2" />
                </linearGradient>
                <filter id="ultraGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <g filter="url(#ultraGlow)">
                <ellipse cx="40" cy="90" rx="20" ry="6" stroke="#00E5FF" strokeWidth="2" opacity="0.8">
                    <animate attributeName="rx" values="18;22;18" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="40" cy="90" rx="12" ry="4" stroke="white" strokeWidth="1" opacity="0.4" />
                <path d="M40 90V55" stroke={`url(#${gradientId})`} strokeWidth="3" strokeLinecap="round" />
                <path d="M40 10L60 35L40 60L20 35L40 10Z" fill="rgba(255, 255, 255, 0.1)" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="M40 10L75 40L40 60L5 40L40 10Z" stroke="white" strokeWidth="0.8" strokeLinejoin="round" opacity="0.4" />
                <path d="M40 10V35M20 35H60M40 35L60 35M40 35L20 35M40 60V35" stroke="white" strokeWidth="0.5" opacity="0.3" />
                <path d="M40 10L20 35L40 60M40 10L60 35L40 60" stroke={color} strokeWidth="1" opacity="0.5" />
                <circle cx="40" cy="10" r="1.5" fill="white" />
                <circle cx="60" cy="35" r="1" fill="white" />
                <circle cx="20" cy="35" r="1" fill="white" />
                <circle cx="40" cy="60" r="1" fill="white" />
            </g>
        </svg>
    );
};

// Mile Marker / Signpost - Premium Neon Design
export const MileMarkerAsset = ({ label }: { label: string }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '80px',
        height: '50px',
        background: 'rgba(0, 229, 255, 0.05)',
        backdropFilter: 'blur(4px)',
        border: '2px solid #00E5FF',
        borderRadius: '8px',
        color: '#00E5FF',
        fontFamily: "'Inter', var(--font-mono)",
        fontSize: '14px',
        fontWeight: '800',
        letterSpacing: '0.05em',
        textShadow: '0 0 10px rgba(0, 229, 255, 0.8)',
        boxShadow: '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.2)',
        padding: '6px',
        textAlign: 'center',
        position: 'relative',
    }}>
        <div style={{ fontSize: '9px', opacity: 0.6, fontWeight: '400', letterSpacing: '0.2em' }}>MILESTONE</div>
        <div>{label}</div>
        <div style={{ position: 'absolute', left: '-2px', top: '10px', bottom: '10px', width: '2px', background: 'white', boxShadow: '0 0 10px white' }} />
        <div style={{ position: 'absolute', right: '-2px', top: '10px', bottom: '10px', width: '2px', background: 'white', boxShadow: '0 0 10px white' }} />
        <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '4px',
            height: '30px',
            background: 'linear-gradient(to bottom, #00E5FF, transparent)',
            boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
        }} />
    </div>
);
