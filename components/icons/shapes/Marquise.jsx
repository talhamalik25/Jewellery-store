import ShapeSvg from "./ShapeSvg";

export default function Marquise({ className, shimmer }) {
  return (
    <ShapeSvg className={className} shimmer={shimmer} shimmerId="marquise-sheen">
      <path d="M100 22c28 31 68 53 68 78s-40 47-68 78c-28-31-68-53-68-78s40-47 68-78Z" />
      <path d="m100 22-28 78 28 78 28-78-28-78Zm-68 78h136M72 100l-40-22m40 22-40 22m96-22 40-22m-40 22 40 22" />
    </ShapeSvg>
  );
}
