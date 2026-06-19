import SeamDivider from './SeamDivider'

export default function WhyFitCard({ reasons }) {
  if (!reasons || reasons.length === 0) return null

  return (
    <div
      className="bg-card border border-borderwarm rounded-2xl p-4 opacity-0 animate-slide_up"
      style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
    >
      <h3 className="font-serif text-sm font-medium text-ink mb-3">
        Why this fit
      </h3>
      <div className="space-y-0">
        {reasons.map((reason, i) => (
          <div
            key={i}
            className={`flex gap-3 py-2.5 ${
              i > 0 ? 'border-t border-dashed border-borderwarm' : ''
            }`}
          >
            <span className="font-mono text-[11px] text-thread flex-shrink-0 mt-0.5">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="text-sm text-ink leading-snug">{reason}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
