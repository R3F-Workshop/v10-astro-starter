/** The Poimandres block mark — fill follows `currentColor` */
export function PmndrsMark({ className }: { className?: string }) {
  return (
    <svg viewBox="600 600 800 800" fill="currentColor" className={className} aria-hidden="true">
      <rect x="880" y="1160" width="240" height="240" />
      <rect x="880" y="880" width="240" height="240" />
      <rect x="600" y="880" width="240" height="240" />
      <path fillRule="evenodd" clipRule="evenodd" d="M1160 600H880V840H1160V1120H1400V600H1160Z" />
    </svg>
  )
}
