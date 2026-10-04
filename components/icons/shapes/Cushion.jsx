import ShapeSvg from "./ShapeSvg";

export default function Cushion({ className, shimmer }) {
  return (
    <ShapeSvg className={className} shimmer={shimmer} shimmerId="cushion-sheen">
      <path d="M68 28h64c22 0 40 18 40 40v64c0 22-18 40-40 40H68c-22 0-40-18-40-40V68c0-22 18-40 40-40Z" />
      <path d="M70 46h60c13 0 24 11 24 24v60c0 13-11 24-24 24H70c-13 0-24-11-24-24V70c0-13 11-24 24-24Z" />
      <path d="m68 28 2 18m60 0 2-18M28 68l18 2m0 60-18 2m144-64-18 2m0 60 18 2m-44-88v18m-60-18v18m0 96v-18m60 18v-18m-60-78 30 30 30-30m-60 60 30-30 30 30" />
    </ShapeSvg>
  );
}
