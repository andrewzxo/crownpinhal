"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { CrownGlyph } from "./CrownShapes";

export default function Reveal({
  children,
  delay = 0,
  className,
  y = 36,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.21, 0.65, 0.35, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const [pre, post] = (() => {
    if (!highlight) return [title, ""];
    const idx = title.indexOf(highlight);
    if (idx === -1) return [title, ""];
    return [title.slice(0, idx), title.slice(idx + highlight.length)];
  })();

  return (
    <Reveal className={align === "center" ? "text-center" : "text-left"}>
      <p className="font-heading uppercase tracking-[0.35em] text-xs text-zinc-400 flex items-center gap-3 justify-center data-[align=left]:justify-start" data-align={align}>
        <span className="w-8 h-px bg-zinc-600" />
        {eyebrow}
        <span className="w-8 h-px bg-zinc-600" />
      </p>
      <h2 className="mt-4 font-display uppercase text-4xl sm:text-5xl lg:text-6xl leading-[0.95]">
        {pre}
        {highlight && <span className="text-[#d9a441]">{highlight}</span>}
        {post}
      </h2>
      <CrownGlyph
        className={`mt-5 w-16 h-4 text-[#d9a441] ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {subtitle && (
        <p className={`mt-4 text-muted-foreground max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
