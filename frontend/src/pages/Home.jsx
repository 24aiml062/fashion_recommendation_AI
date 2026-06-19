import { Link } from 'react-router-dom'
import SeamDivider from '../components/SeamDivider'

const steps = [
  { step: '01', label: 'Set your profile', sub: 'style, budget, colors', to: '/profile' },
  { step: '02', label: 'Mirror yourself', sub: 'body type & skin tone', to: '/body-analysis' },
  { step: '03', label: 'Build your closet', sub: 'photograph your clothes', to: '/wardrobe' },
  { step: '04', label: 'Get styled', sub: 'AI picks the outfit', to: '/recommendations' },
]

export default function Home() {
  return (
    <div>
      {/* Wordmark */}
      <div className="mb-8 pt-4">
        <h1 className="font-serif text-4xl font-medium text-ink leading-none">
          atelier<span className="text-thread italic">.</span>
        </h1>
        <p className="text-sm text-muted mt-2">
          your AI-powered personal stylist
        </p>
      </div>

      <SeamDivider />

      {/* Steps */}
      <div className="space-y-0">
        {steps.map(({ step, label, sub, to }, i) => (
          <div key={step}>
            <Link to={to} className="flex items-center justify-between py-4 group">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[11px] text-thread">{step}</span>
                <div>
                  <p className="font-serif text-lg font-medium text-ink group-hover:text-thread transition-colors">
                    {label}
                  </p>
                  <p className="font-mono text-[10px] uppercase text-muted mt-0.5">{sub}</p>
                </div>
              </div>
              <span className="text-muted group-hover:text-thread transition-colors text-sm">→</span>
            </Link>
            {i < steps.length - 1 && (
              <hr className="border-t border-dashed border-borderwarm opacity-60" />
            )}
          </div>
        ))}
      </div>

      <SeamDivider />

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          to="/recommendations"
          className="flex-1 text-center bg-ink text-canvas font-mono text-xs uppercase tracking-wide rounded-full py-3.5 hover:bg-thread-dark active:scale-[0.97] transition-all"
        >
          ✂ style me
        </Link>
        <Link
          to="/discover"
          className="flex-1 text-center border border-borderwarm text-ink font-mono text-xs uppercase tracking-wide rounded-full py-3.5 hover:border-thread transition-colors active:scale-[0.97]"
        >
          ♥ discover
        </Link>
      </div>
    </div>
  )
}
