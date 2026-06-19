/**
 * Renders outfit slots as a row of pills.
 * Each non-null slot gets one pill.
 * Pills cascade in with staggered delay.
 */
const SLOT_ICONS = { top: '👕', bottom: '👖', footwear: '👟', accessory: '⌚' }

export default function OutfitCard({ outfit }) {
  const slots = Object.entries(outfit).filter(([, v]) => v)

  return (
    <div className="flex flex-wrap gap-2">
      {slots.map(([key, value], i) => (
        <span
          key={key}
          className="font-mono text-[10px] bg-white/85 border border-white/90 rounded-full px-2.5 py-1 text-ink opacity-0 animate-slide_up"
          style={{ animationDelay: `${i * 70}ms`, animationFillMode: 'forwards' }}
        >
          {SLOT_ICONS[key]} {value}
        </span>
      ))}
    </div>
  )
}
