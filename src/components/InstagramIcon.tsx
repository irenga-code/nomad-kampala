import { useId } from "react";

// Instagram glyph in the brand gradient (original colours).
export default function InstagramIcon({ size = 22 }: { size?: number }) {
  const id = "ig" + useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEDA75" />
          <stop offset="28%" stopColor="#FA7E1E" />
          <stop offset="55%" stopColor="#D62976" />
          <stop offset="80%" stopColor="#962FBF" />
          <stop offset="100%" stopColor="#4F5BD5" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke={`url(#${id})`} strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke={`url(#${id})`} strokeWidth="2" />
      <circle cx="17.3" cy="6.7" r="1.2" fill={`url(#${id})`} />
    </svg>
  );
}
