/**
 * Formatos exclusivos da identidade visual CROWN.
 * A silhueta de picos de coroa é a assinatura da marca em todo o site.
 */

/** Divisor em zigue-zague — picos de coroa entre seções. */
export function CrownEdge({
  fill = "#070707",
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

/** Coroa grande em traço — marca d'água de fundo. */
export function CrownWatermark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" fill="none" aria-hidden className={className}>
      <path
        d="M8 74 L8 26 L36 48 L60 12 L84 48 L112 26 L112 74 Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M8 84 L112 84" stroke="currentColor" strokeWidth="2" />
      <circle cx="8" cy="19" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="60" cy="5" r="3.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="112" cy="19" r="3.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
