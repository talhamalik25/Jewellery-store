import ShapeSvg from "./ShapeSvg";

export default function Emerald({ className, shimmer }) {
  return (
    <ShapeSvg className={className} shimmer={shimmer} shimmerId="emerald-sheen">
      <path d="M65 24h70l26 26v100l-26 26H65l-26-26V50l26-26Z" />
      <path d="M65 40h70l20 20v80l-20 20H65l-20-20V60l20-20Z" />
      <path d="M65 24v16L45 60m110 0-20-20V24m20 126-20-10v20m-90-10 20-10v20M45 60h110M45 140h110M65 40v120m70-120v120" />
    </ShapeSvg>
  );
}
