import { useId } from "react";

export default function ShapeSvg({ children, className = "size-full", shimmer = false, shimmerId = "shape-sheen" }) {
  const reactId = useId().replaceAll(":", "");
  const gradientId = `${shimmerId}-${reactId}`;

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" aria-hidden="true">
      {shimmer && (
        <defs>
          <linearGradient id={gradientId} x1="0" y1="100" x2="200" y2="100" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="43%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="57%" stopColor="currentColor" stopOpacity="0" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-200 0;200 0;-200 0"
              dur="9s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      )}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
      {shimmer && (
        <g fill="none" stroke={`url(#${gradientId})`} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          {children}
        </g>
      )}
    </svg>
  );
}
