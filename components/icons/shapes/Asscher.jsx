import ShapeSvg from "./ShapeSvg";

export default function Asscher({ className, shimmer }) {
  return (
    <ShapeSvg className={className} shimmer={shimmer} shimmerId="asscher-sheen">
      <path d="M58 28h84l30 30v84l-30 30H58l-30-30V58l30-30Z" />
      <path d="M66 46h68l20 20v68l-20 20H66l-20-20V66l20-20Z" />
      <path d="M74 64h52l10 10v52l-10 10H74l-10-10V74l10-10Z" />
      <path d="M58 28v18L46 66m108 0-12-20V28m30 30h-18m18 84h-18m-120 0h18M28 58h18m20-12v18m68-18v18m0 88v-18m-68 18v-18" />
    </ShapeSvg>
  );
}
