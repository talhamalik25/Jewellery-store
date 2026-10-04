import { shapes } from "./shapes";

const productStyles = [
  {
    id: "solitaire",
    name: "Solitaire Ring",
    priceOffset: 0,
    image: "/images/works/roseline-ring.webp",
    imageAlt: "Gold ring worn on a hand",
  },
  {
    id: "halo",
    name: "Halo Ring",
    priceOffset: 280,
    image: "/images/works/hibiscus-ring.webp",
    imageAlt: "Hands adorned with gold rings",
  },
  {
    id: "classic",
    name: "Classic Diamond Ring",
    priceOffset: 520,
    image: "/images/categories/rings.webp",
    imageAlt: "Diamond rings on a dark surface",
  },
  {
    id: "heirloom",
    name: "Heirloom Setting",
    priceOffset: 760,
    image: "/images/categories/wedding.webp",
    imageAlt: "Gold diamond ring against a black background",
  },
] as const;

export const products = shapes.flatMap((shape) =>
  productStyles.map((style) => ({
    id: `${shape.id}-${style.id}`,
    shapeId: shape.id,
    name: `${shape.name} ${style.name}`,
    price: shape.fromPrice + style.priceOffset,
    image: style.image,
    imageAlt: style.imageAlt,
  })),
);
