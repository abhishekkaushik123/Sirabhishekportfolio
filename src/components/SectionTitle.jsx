export default function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-8">
      <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-accent">
        <span className="h-0.5 w-8 bg-accent" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="font-display text-6xl leading-none md:text-7xl">{title}</h2>
    </div>
  )
}