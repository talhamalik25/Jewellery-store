"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

const shapes = [
  { name: "Oval", kind: "oval" },
  { name: "Cushion", kind: "cushion" },
  { name: "Round", kind: "round" },
  { name: "Princess", kind: "princess" },
  { name: "Pear", kind: "pear" },
];

function Diamond({ kind }) {
  const paths = {
    oval: <><path d="M50 7C35 22 24 38 24 52c0 18 12 34 26 41 14-7 26-23 26-41C76 38 65 22 50 7Z" /><path d="M50 7 37 40l13 53 13-53L50 7ZM24 52h52M37 40h26" /></>,
    cushion: <><path d="M25 12h50l13 13v50L75 88H25L12 75V25l13-13Z" /><path d="m25 12 5 17-18-4m63-13-5 17 18-4M88 75 71 70l4 18M12 75l17-5-4 18m5-59h40v42H30z" /></>,
    round: <><circle cx="50" cy="50" r="43" /><path d="M50 7v86M7 50h86M20 20l60 60m0-60L20 80M35 9l15 41 15-41M91 35 50 50l41 15M65 91 50 50 35 91M9 65l41-15L9 35" /></>,
    princess: <><path d="M25 9h50l16 16v50L75 91H25L9 75V25L25 9Z" /><path d="M25 9v17L9 25m66-16v17l16-1M91 75 75 74v17M9 75l16-1v17m0-66h50v50H25zM25 25l25 25 25-25M25 75l25-25 25 25" /></>,
    pear: <><path d="M50 7C42 22 19 42 19 62a31 31 0 0 0 62 0C81 42 58 22 50 7Z" /><path d="M50 7 38 42l12 51 12-51L50 7ZM19 62h62M38 42h24" /></>,
  };

  return <svg viewBox="0 0 100 100" className="size-[44%] overflow-visible" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" aria-hidden="true">{paths[kind]}</svg>;
}

export default function ShapeSelector() {
  const [selected, setSelected] = useState("Round");

  return (
    <section className="overflow-hidden bg-background py-16 text-text md:py-24" aria-labelledby="shape-selector-title">
      <Container>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-start">
          <div className="min-w-0">
            <h2 id="shape-selector-title" className="font-heading text-[clamp(2.75rem,8.4vw,7rem)] font-medium leading-[0.98] tracking-[-0.055em]">
              <span className="block">Shop Diamond</span>
              <span className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)] items-center gap-3 sm:gap-6">
                <span className="max-w-[15rem] font-sans text-[clamp(0.65rem,1vw,0.8rem)] font-normal leading-relaxed tracking-normal text-muted md:mt-2">
                  Explore the possibilities of tailored craftsmanship and unlimited capabilities
                </span>
                <span className="text-right">by Shape</span>
              </span>
            </h2>
          </div>
          <Button as={Link} href="/shop" variant="outline" size="md" className="justify-self-start md:mt-1 md:justify-self-end">
            <span className="grid size-8 place-items-center rounded-full bg-text text-background" aria-hidden="true">→</span>
            Try it now!
          </Button>
        </div>

        <div className="relative mt-16 md:mt-24">
          <div className="pointer-events-none absolute left-0 right-0 top-[43%] hidden h-px bg-border sm:block" aria-hidden="true" />
          <div className="pointer-events-none absolute left-0 right-0 top-[43%] hidden -translate-y-1/2 justify-between sm:flex" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-text" /><span className="size-1.5 rounded-full bg-text" />
          </div>
          <div className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="relative flex min-w-max items-end justify-between gap-6 sm:min-w-0 sm:gap-3 md:gap-6">
              {shapes.map(({ name, kind }) => {
                const active = selected === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelected(name)}
                    aria-pressed={active}
                    className="group relative z-10 flex w-28 shrink-0 flex-col items-center gap-4 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-soft focus-visible:outline-offset-4 sm:w-auto sm:flex-1 sm:gap-4"
                  >
                    <span className={`grid aspect-square w-28 place-items-center rounded-full border border-border bg-background text-text transition-[width,transform,opacity,border-color] duration-500 ease-editorial sm:w-[clamp(6.5rem,12vw,10rem)] ${active ? "scale-100 border-border opacity-100 sm:w-[clamp(8.5rem,16vw,13rem)]" : "scale-[0.88] opacity-45 group-hover:scale-95 group-hover:opacity-75"}`}>
                      <Diamond kind={kind} />
                    </span>
                    <span className={`font-heading text-xs transition-[color,opacity,transform] duration-500 ease-editorial sm:text-sm ${active ? "translate-y-0 text-text opacity-100" : "translate-y-1 text-muted opacity-55"}`}>
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
