import { useState } from 'react'
import toast from 'react-hot-toast'
import { updateWardrobeItem } from '../api/api'

const CATEGORIES = ['Top', 'Bottom', 'Footwear', 'Accessory', 'Other']
const PATTERNS = ['Solid', 'Striped', 'Checkered', 'Floral', 'Printed', 'Other']
const STYLES = ['Casual', 'Formal', 'Ethnic', 'Streetwear', 'Minimalist', 'Sportswear']

export default function ClothingCard({ item, onDelete, onEdit, draggable, onDragStart }) {
  const [hovered, setHovered] = useState(false)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    category: item.category,
    item_name: item.item_name,
    color: item.color,
    pattern: item.pattern,
    style: item.style,
  })

  const isOther = item.category === 'Other'

  const inputCls =
    'w-full border border-borderwarm rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-thread bg-canvas'

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateWardrobeItem(item.id, form)
      toast('item updated')
      setEditing(false)
      onEdit()
    } catch (err) {
      toast(err.response?.data?.detail || 'failed to update item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="relative group"
      draggable={draggable}
      onDragStart={onDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transform: hovered && !editing ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'transform 200ms ease',
      }}
    >
      {/* Hook indicator */}
      <div className="flex justify-center mb-1">
        <div
          className="rounded-full transition-all duration-300"
          style={{
            width: '1.5px',
            height: isOther ? '10px' : '5px',
            background: isOther ? '#B5482E' : '#A39C92',
          }}
        />
      </div>

      <div
        className={`bg-card border rounded-t-[10px] rounded-b-[4px] overflow-hidden shadow-sm transition-shadow duration-200 ${
          isOther ? 'border-thread/40' : 'border-borderwarm'
        } ${hovered ? 'shadow-md' : ''}`}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-canvas">
          <img
            src={item.image_url}
            alt={item.item_name}
            className="w-full h-full object-cover"
          />
          {/* Hover delete button */}
          <button
            onClick={() => onDelete(item.id)}
            className={`absolute top-1 right-1 w-5 h-5 bg-ink/80 text-canvas rounded-full flex items-center justify-center text-[10px] transition-opacity duration-150 ${
              hovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-label="Delete item"
          >
            ✕
          </button>
          {isOther && (
            <div className="absolute bottom-1 left-1">
              <span className="font-mono text-[8px] uppercase bg-thread/90 text-canvas px-1.5 py-0.5 rounded-full">
                fix me
              </span>
            </div>
          )}
        </div>

        {/* Info / edit form */}
        <div className="p-2">
          {!editing ? (
            <>
              <p className="text-[11px] font-medium text-ink truncate leading-tight mb-0.5">
                {item.item_name}
              </p>
              <p className="font-mono text-[9px] uppercase text-muted truncate">
                {item.category} · {item.color}
              </p>
              <button
                onClick={() => setEditing(true)}
                className="mt-1.5 font-mono text-[9px] uppercase text-thread hover:text-thread-dark transition-colors"
              >
                edit
              </button>
            </>
          ) : (
            <div className="space-y-1.5 py-1">
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input type="text" value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} className={inputCls} placeholder="Name" />
              <input type="text" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputCls} placeholder="Color" />
              <select value={form.pattern} onChange={(e) => setForm({ ...form, pattern: e.target.value })} className={inputCls}>
                {PATTERNS.map((p) => <option key={p}>{p}</option>)}
              </select>
              <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className={inputCls}>
                {STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div className="flex gap-1 pt-0.5">
                <button onClick={handleSave} disabled={saving} className="flex-1 bg-ink text-canvas font-mono text-[9px] uppercase rounded-full py-1 hover:bg-thread-dark transition-colors disabled:opacity-50">
                  {saving ? '…' : 'save'}
                </button>
                <button onClick={() => setEditing(false)} className="flex-1 border border-borderwarm font-mono text-[9px] uppercase rounded-full py-1 text-muted hover:border-thread transition-colors">
                  cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
