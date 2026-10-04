import ShapeSvg from "./ShapeSvg";

export default function Pear({ className, shimmer }) {
  return (
    <ShapeSvg className={className} shimmer={shimmer} shimmerId="pear-sheen">
      <path d="M100 24c-14 28-64 62-64 100a64 64 0 0 0 128 0c0-38-50-72-64-100Z" />
      <path d="m100 24-28 72 28 92 28-92-28-72Zm-64 100h128M72 96h56m-92 28 64-28 64 28m-128 0 64 92 64-92" />
    </ShapeSvg>
  );
}
