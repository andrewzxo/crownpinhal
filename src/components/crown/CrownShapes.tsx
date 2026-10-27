/**
 * Formatos exclusivos da identidade visual CROWN.
 * A silhueta de picos de coroa é a assinatura da marca em todo o site.
 */

/** Divisor em zigue-zague — picos de coroa entre seções. */
export function CrownEdge({
  fill = "#0c0c0e",
  stroke,
  height = 24,
  flip = false,
  peaks = 36,
  className = "",
}: {
  fill?: string;
  stroke?: string;
  height?: number;
  flip?: boolean;
  peaks?: number;
  className?: string;
}) {
  const W = 1440;
  const step = W / peaks;
  let d = `M0 ${height}`;
  for (let i = 0; i < peaks; i++) {
    const x1 = (i * step + step / 2).toFixed(2);
    const x2 = ((i + 1) * step).toFixed(2);
    d += ` L${x1} 0 L${x2} ${height}`;
  }
  d += " Z";
  const line = d.replace(" Z", "");

  return (
    <svg
      viewBox={`0 0 ${W} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
      className={`block w-full ${className}`}
      style={{ height, transform: flip ? "scaleY(-1)" : undefined }}
    >
      <path d={d} fill={fill} />
      {stroke && (
        <path
          d={line}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

/** Glifo mínimo de coroa (3 picos) — usado como assinatura nos títulos. */
export function CrownGlyph({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 14" fill="none" aria-hidden className={className}>
      <path
        d="M2 12 L12 2 L22 12 L32 2 L42 12 L52 2 L62 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="square"
      />
    </svg>
  );
}
