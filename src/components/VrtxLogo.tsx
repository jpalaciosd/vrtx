"use client";

interface VrtxLogoProps {
  size?: number;
  animated?: boolean;
  className?: string;
}

export default function VrtxLogo({ size = 120, animated = true, className = "" }: VrtxLogoProps) {
  const h = size * 0.866;
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={h}
        viewBox={`0 0 ${size} ${h}`}
        className={animated ? "animate-breathe" : ""}
        style={{ filter: "drop-shadow(0 0 20px rgba(var(--accent-rgb), 0.5))" }}
      >
        <polygon
          points={`${size / 2},0 ${size},${h} 0,${h}`}
          fill="rgba(var(--accent-rgb), 0.08)"
          stroke="var(--accent)"
          strokeWidth="2"
        />
        <line
          x1={size / 2}
          y1={h * 0.15}
          x2={size / 2}
          y2={h * 0.85}
          stroke="var(--accent)"
          strokeWidth="0.5"
          opacity="0.4"
        />
        <circle cx={size / 2} cy={h * 0.55} r={size * 0.025} fill="var(--accent)" />
      </svg>
    </div>
  );
}
