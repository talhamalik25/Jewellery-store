import ShapeSvg from "./ShapeSvg";

export default function Princess({ className, shimmer }) {
  return (
    <ShapeSvg className={className} shimmer={shimmer} shimmerId="princess-sheen">
      <path d="M62 30h76l32 32v76l-32 32H62l-32-32V62l32-32Z" />
      <path d="M62 30v32H30m108-32v32h32M170 138h-32v32M30 138h32v32M62 62h76v76H62V62Z" />
      <path d="m62 62 38 38 38-38m-76 76 38-38 38 38M30 62l70 38 70-38M30 138l70-38 70 38" />
    </ShapeSvg>
  );
}
