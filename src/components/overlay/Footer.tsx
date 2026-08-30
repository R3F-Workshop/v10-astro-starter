import { PmndrsMark } from './PmndrsMark'

export function Footer() {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-between px-6 py-4">
      <p className="font-mono text-[11px] text-zinc-600">
        fiber v10 · drei v11 · leva · three
      </p>

      <a
        href="https://pmnd.rs"
        target="_blank"
        rel="noreferrer"
        title="Poimandres"
        className="pointer-events-auto text-zinc-500 transition-colors hover:text-zinc-50"
      >
        <PmndrsMark className="size-8" />
      </a>

      <p className="hidden font-mono text-[11px] text-zinc-600 sm:block">
        drag to orbit · scroll to zoom
      </p>
    </footer>
  )
}
