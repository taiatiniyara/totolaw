export function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Gradient Definitions */}
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.3 }} />
            <stop offset="50%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.4 }} />
          </linearGradient>
          
          <linearGradient id="grad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.25 }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.1 }} />
          </linearGradient>

          <radialGradient id="radialGrad1" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.4 }} />
            <stop offset="50%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0 }} />
          </radialGradient>

          <radialGradient id="radialGrad2" cx="70%" cy="70%">
            <stop offset="0%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.35 }} />
            <stop offset="50%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: "hsl(var(--primary))", stopOpacity: 0 }} />
          </radialGradient>

          {/* Pattern for texture */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="hsl(var(--primary))" opacity="0.3" />
          </pattern>

          {/* Noise filter for subtle texture */}
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
            <feBlend mode="multiply" in="SourceGraphic"/>
          </filter>
        </defs>

        {/* Base gradient background */}
        <rect width="100%" height="100%" fill="url(#grad1)" />

        {/* Large flowing shapes */}
        <path
          d="M0,100 Q250,50 500,100 T1000,100 L1000,0 L0,0 Z"
          fill="url(#grad2)"
          opacity="0.3"
        />
        
        <path
          d="M0,300 Q350,200 700,300 T1400,300 L1400,0 L0,0 Z"
          fill="url(#radialGrad1)"
          opacity="0.2"
        />

        {/* Circular accents */}
        <circle cx="10%" cy="20%" r="300" fill="url(#radialGrad1)" opacity="0.4" />
        <circle cx="85%" cy="15%" r="250" fill="url(#radialGrad2)" opacity="0.35" />
        <circle cx="50%" cy="80%" r="200" fill="url(#radialGrad1)" opacity="0.25" />

        {/* Abstract geometric shapes representing justice/law */}
        <g opacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2" fill="none">
          {/* Scales of justice abstract */}
          <path d="M100,150 L200,150 M150,100 L150,200" strokeWidth="3" />
          <circle cx="100" cy="170" r="20" />
          <circle cx="200" cy="170" r="20" />
          
          {/* Gavel abstract */}
          <rect x="800" y="200" width="80" height="20" rx="5" transform="rotate(-45 840 210)" />
          <rect x="850" y="240" width="40" height="60" rx="5" />
          
          {/* Document abstract */}
          <rect x="1200" y="400" width="120" height="160" rx="8" />
          <line x1="1220" y1="430" x2="1300" y2="430" />
          <line x1="1220" y1="460" x2="1300" y2="460" />
          <line x1="1220" y1="490" x2="1280" y2="490" />
        </g>

        {/* Flowing lines for movement/speed (representing "Totolo") */}
        <g opacity="0.25" stroke="hsl(var(--primary))" strokeWidth="2" fill="none">
          <path d="M0,250 Q200,200 400,250 T800,250" strokeDasharray="5,10" />
          <path d="M200,350 Q400,300 600,350 T1000,350" strokeDasharray="5,10" />
          <path d="M100,450 Q300,400 500,450 T900,450" strokeDasharray="5,10" />
          <path d="M-100,150 Q100,100 300,150 T700,150" strokeDasharray="5,10" />
        </g>

        {/* Grid pattern overlay for texture */}
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />

        {/* Pacific wave motif - More visible */}
        <g opacity="0.35" stroke="hsl(var(--primary))" strokeWidth="3" fill="none">
          <path d="M0,600 Q150,550 300,600 T600,600 T900,600 T1200,600 T1500,600" />
          <path d="M0,630 Q150,580 300,630 T600,630 T900,630 T1200,630 T1500,630" />
          <path d="M0,660 Q150,610 300,660 T600,660 T900,660 T1200,660 T1500,660" />
          <path d="M0,690 Q150,640 300,690 T600,690 T900,690 T1200,690 T1500,690" />
        </g>

        {/* Starburst accents */}
        <g opacity="0.3">
          <circle cx="90%" cy="25%" r="2" fill="hsl(var(--primary))" />
          <circle cx="92%" cy="23%" r="1.5" fill="hsl(var(--primary))" />
          <circle cx="88%" cy="27%" r="1.5" fill="hsl(var(--primary))" />
          
          <circle cx="15%" cy="70%" r="2" fill="hsl(var(--primary))" />
          <circle cx="17%" cy="68%" r="1.5" fill="hsl(var(--primary))" />
          <circle cx="13%" cy="72%" r="1.5" fill="hsl(var(--primary))" />
          
          <circle cx="75%" cy="85%" r="2" fill="hsl(var(--primary))" />
          <circle cx="77%" cy="83%" r="1.5" fill="hsl(var(--primary))" />
          <circle cx="73%" cy="87%" r="1.5" fill="hsl(var(--primary))" />
        </g>

        {/* Animated elements (subtle pulse) */}
        <g>
          <circle cx="30%" cy="40%" r="8" fill="hsl(var(--primary))" opacity="0.3">
            <animate attributeName="r" values="8;12;8" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="70%" cy="60%" r="10" fill="hsl(var(--primary))" opacity="0.25">
            <animate attributeName="r" values="10;15;10" dur="5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.25;0.4;0.25" dur="5s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="50%" cy="30%" r="6" fill="hsl(var(--primary))" opacity="0.35">
            <animate attributeName="r" values="6;10;6" dur="3.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.5;0.35" dur="3.5s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}
