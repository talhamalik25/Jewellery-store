"use client";
import { ReactLenis } from "lenis/react";

export default function LenisProvider({ children }) {
  return (
    <ReactLenis root options={{ autoRaf: true, anchors: true, lerp: 0.1, respectReducedMotion: true }}>
      {children}
    </ReactLenis>
  );
}

