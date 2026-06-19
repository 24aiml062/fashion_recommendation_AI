import { NavLink } from 'react-router-dom'
import { useState } from 'react'

const tabs = [
  { to: '/recommendations', label: 'today',   dot: '●' },
  { to: '/wardrobe',        label: 'closet',  dot: '●' },
  { to: '/body-analysis',   label: 'mirror',  dot: '●' },
  { to: '/profile',         label: 'profile', dot: '●' },
]

export default function BottomNav() {
  const [pressed, setPressed] = useState(null)

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-borderwarm">
      <div className="max-w-lg mx-auto flex items-end justify-around px-2 py-2 pb-safe">
        {tabs.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/recommendations'}
            onPointerDown={() => setPressed(to)}
            onPointerUp={() => setPressed(null)}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-4 py-1 select-none transition-colors ${
                isActive ? 'text-thread' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`text-[6px] transition-transform duration-150 ${
                    pressed === to ? 'scale-[1.8]' : 'scale-100'
                  } ${isActive ? 'text-thread' : 'text-muted'}`}
                >
                  ●
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wide">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
