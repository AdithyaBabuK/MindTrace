export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      <div className="grid-overlay absolute inset-0" />
      <div className="aurora-blob animate-drift-a absolute -top-32 -left-24 size-[46rem] bg-[var(--glow-1)]" />
      <div className="aurora-blob animate-drift-b absolute top-1/3 -right-40 size-[40rem] bg-[var(--glow-2)]" />
      <div className="aurora-blob animate-drift-c absolute bottom-[-18rem] left-1/4 size-[38rem] bg-[var(--glow-3)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,transparent_35%,var(--vignette)_100%)]" />
    </div>
  );
}
