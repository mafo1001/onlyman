import React, { useId } from 'react';

export default function DemonLogo({ size = 48, glow = true, className = '' }) {
  const reactId = useId();
  const id = `om-${reactId.replace(/:/g, '')}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        filter: glow
          ? 'drop-shadow(0 0 14px rgba(0,255,102,0.6)) drop-shadow(0 0 36px rgba(0,255,102,0.25))'
          : 'none',
      }}
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00ffaa" />
          <stop offset="30%" stopColor="#39ff14" />
          <stop offset="60%" stopColor="#00ff66" />
          <stop offset="100%" stopColor="#00cc52" />
        </linearGradient>
      </defs>
      <text
        x="70"
        y="60"
        textAnchor="middle"
        fontFamily="Inter, Arial Black, sans-serif"
        fontWeight="900"
        fontSize="68"
        letterSpacing="-3"
        fill={`url(#${id}-grad)`}
      >
        OM
      </text>
    </svg>
  );
}

export function OnlyManWordmark({ height = 28, className = '' }) {
  return (
    <span className={className} style={{
      fontFamily: 'Inter, sans-serif',
      fontWeight: 900,
      fontSize: height,
      letterSpacing: '-1.5px',
      background: 'linear-gradient(135deg, #00ffaa 0%, #39ff14 30%, #00ff66 60%, #00cc52 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: 'none',
      display: 'inline-block',
      userSelect: 'none',
      filter: 'drop-shadow(0 0 12px rgba(0,255,102,0.5)) drop-shadow(0 0 24px rgba(57,255,20,0.25))',
    }}>
      ONLYMAN
    </span>
  );
}
