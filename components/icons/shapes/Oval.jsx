import ShapeSvg from "./ShapeSvg";

export default function Oval({ className, shimmer }) {
  return (
    <ShapeSvg className={className} shimmer={shimmer} shimmerId="oval-sheen">
      <path d="M100 24c38 0 68 34 68 76s-30 76-68 76-68-34-68-76 30-76 68-76Z" />
      <path d="M100 40c29 0 52 27 52 60s-23 60-52 60-52-27-52-60 23-60 52-60Z" />
      <path d="m100 24-22 76 22 76 22-76-22-76Zm-68 76h136M48 40l52 60 52-60m-104 120 52-60 52 60" />
    </ShapeSvg>
  );
}
