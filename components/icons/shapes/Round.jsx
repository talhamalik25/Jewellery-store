import ShapeSvg from "./ShapeSvg";

export default function Round({ className, shimmer }) {
  return (
    <ShapeSvg className={className} shimmer={shimmer} shimmerId="round-sheen">
      <circle cx="100" cy="100" r="68" />
      <path d="m100 32 31 10 25 27 12 31-12 31-25 27-31 10-31-10-25-27-12-31 12-31 25-27 31-10Z" />
      <path d="m100 32 0 68-31-58m31 58 31-58m25 27-56 31 56 31m-12 31-44-62-44 62m-12-31 56-31-56-31m12-31 44 62 44-62" />
    </ShapeSvg>
  );
}
