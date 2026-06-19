/**
 * Reusable chip-row component.
 * Used for occasion picker (Recommendations) and wardrobe filters.
 *
 * Props:
 *   options  — array of strings
 *   selected — currently selected value (string or null for "all")
 *   onSelect — (value) => void
 *   shaking  — boolean, triggers shake animation on the row
 *   counts   — optional { [label]: number } for filter badges
 */
export default function OccasionChips({
  options,
  selected,
  onSelect,
  shaking = false,
  counts,
}) {
  return (
    <div
      className={`flex gap-2 overflow-x-auto hide-scrollbar pb-1 ${
        shaking ? 'animate-shake' : ''
      }`}
    >
      {options.map((opt) => {
        const isSelected = selected === opt
        return (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`
              flex-shrink-0 flex items-center gap-1.5
              font-mono text-[11px] uppercase tracking-wide
              px-3.5 py-2 rounded-full border
              transition-all duration-150
              active:scale-95
              ${isSelected
                ? 'bg-ink text-canvas border-ink'
                : 'bg-card text-ink border-borderwarm hover:border-thread hover:-translate-y-px'
              }
            `}
          >
            {opt}
            {counts && counts[opt] !== undefined && (
              <span
                className={`font-mono text-[9px] ${
                  isSelected ? 'text-canvas/60' : 'text-muted'
                }`}
              >
                {counts[opt]}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
