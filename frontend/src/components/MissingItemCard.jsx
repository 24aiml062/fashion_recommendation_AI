import { useState } from 'react'
import toast from 'react-hot-toast'

export default function MissingItemCard({ items }) {
  const [wishlisted, setWishlisted] = useState([])

  if (!items || items.length === 0) return null

  const handleWishlist = (item) => {
    if (wishlisted.includes(item)) return
    setWishlisted((prev) => [...prev, item])
    toast('added to your wishlist', { icon: '🤍' })
  }

  return (
    <div
      className="bg-sage-light rounded-xl p-3.5 opacity-0 animate-slide_up"
      style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
    >
      {items.map((item) => (
        <button
          key={item}
          onClick={() => handleWishlist(item)}
          className="flex items-start gap-2.5 w-full text-left group mb-2 last:mb-0"
        >
          <span className="font-serif italic text-sage text-lg leading-none mt-0.5 flex-shrink-0">
            +
          </span>
          <span className="text-sm text-ink leading-snug">
            You don't own a suitable{' '}
            <span className="font-medium">{item}</span> yet — it'd sharpen this
            look.{' '}
            <span className="text-sage underline decoration-dotted underline-offset-2 group-hover:text-sage-dark transition-colors">
              {wishlisted.includes(item) ? 'wishlisted ✓' : 'Tap to wishlist it.'}
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}
