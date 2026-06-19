import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { saveProfile, updateProfile } from '../api/api'
import { useAppData } from '../context/AppDataContext'
import SeamDivider from '../components/SeamDivider'

const GENDERS = ['Male', 'Female', 'Non-binary', 'Prefer not to say']
const STYLES = ['Casual', 'Formal', 'Streetwear', 'Minimalist', 'Ethnic']

const inputCls =
  'w-full border border-borderwarm rounded-lg px-3 py-2 text-sm text-ink bg-card focus:outline-none focus:ring-2 focus:ring-thread placeholder:text-muted'
const labelCls = 'block font-mono text-[10px] uppercase tracking-wide text-muted mb-1'

export default function Profile() {
  const { profile, refreshProfile } = useAppData()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', gender: 'Male', style_preference: 'Casual', budget: '', favorite_colors: '',
  })

  useEffect(() => {
    if (profile) setForm({
      name: profile.name,
      gender: profile.gender,
      style_preference: profile.style_preference,
      budget: profile.budget,
      favorite_colors: profile.favorite_colors,
    })
  }, [profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { ...form, budget: parseFloat(form.budget) || 0 }
      if (profile) await updateProfile(payload)
      else await saveProfile(payload)
      await refreshProfile()
      toast('profile saved')
    } catch (err) {
      toast(err.response?.data?.detail || 'something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-ink mb-1">Your profile</h1>
      <p className="text-sm text-muted mb-0">Tell us your style so we can tailor every look.</p>

      <SeamDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelCls}>Name</label>
          <input type="text" required placeholder="e.g. Alex" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Gender</label>
          <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className={inputCls}>
            {GENDERS.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Style Preference</label>
          <select value={form.style_preference} onChange={(e) => setForm({ ...form, style_preference: e.target.value })} className={inputCls}>
            {STYLES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className={labelCls}>Budget (₹)</label>
          <input type="number" required min="0" placeholder="e.g. 5000" value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>Favourite Colors</label>
          <input type="text" placeholder="e.g. Black, White, Navy" value={form.favorite_colors}
            onChange={(e) => setForm({ ...form, favorite_colors: e.target.value })} className={inputCls} />
          <p className="font-mono text-[9px] uppercase text-muted mt-1">comma-separated</p>
        </div>

        <SeamDivider />

        <button type="submit" disabled={loading}
          className="w-full bg-ink text-canvas font-mono text-xs uppercase tracking-wide rounded-full py-3.5 hover:bg-thread-dark active:scale-[0.97] transition-all disabled:opacity-60">
          {loading ? 'saving…' : profile ? 'update profile' : 'save profile'}
        </button>
      </form>

      {profile && (
        <div className="mt-4 bg-sage-light rounded-xl p-4">
          <p className="text-sm text-ink">
            <span className="text-sage font-medium">✓</span> styled for{' '}
            <span className="font-medium">{profile.name}</span> ·{' '}
            <span className="text-muted">{profile.style_preference}</span>
          </p>
        </div>
      )}
    </div>
  )
}
