/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FBF8F4',
        ink: '#231F1C',
        thread: {
          DEFAULT: '#B5482E',
          dark: '#8C3620',
        },
        sage: {
          DEFAULT: '#6B7A5E',
          light: '#E4E8DE',
        },
        muted: '#A39C92',
        card: '#FFFFFF',
        borderwarm: '#E6DFD3',
      },
      fontFamily: {
        serif: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        shake: {
          '0%,100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-4px)' },
          '30%': { transform: 'translateX(4px)' },
          '45%': { transform: 'translateX(-4px)' },
          '60%': { transform: 'translateX(4px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
        wiggle: {
          '0%,100%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(6px) rotate(20deg)' },
          '75%': { transform: 'translateX(-6px) rotate(-20deg)' },
        },
        pulse_dot: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        tilt: {
          '0%,100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        reveal_up: {
          '0%': { opacity: '0', transform: 'translateY(14px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        pop_in: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slide_up: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fly_left: {
          '0%': { opacity: '1', transform: 'translateX(0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'translateX(-500px) rotate(-25deg)' },
        },
        fly_right: {
          '0%': { opacity: '1', transform: 'translateX(0) rotate(0deg)' },
          '100%': { opacity: '0', transform: 'translateX(500px) rotate(25deg)' },
        },
      },
      animation: {
        shake: 'shake 350ms ease-in-out',
        wiggle: 'wiggle 600ms ease-in-out infinite',
        pulse_dot: 'pulse_dot 1.6s ease-in-out infinite',
        tilt: 'tilt 500ms ease-in-out',
        reveal_up: 'reveal_up 600ms cubic-bezier(.34,1.2,.64,1) forwards',
        pop_in: 'pop_in 300ms cubic-bezier(.34,1.56,.64,1) forwards',
        slide_up: 'slide_up 250ms ease forwards',
        fly_left: 'fly_left 250ms ease forwards',
        fly_right: 'fly_right 250ms ease forwards',
      },
    },
  },
  plugins: [],
}
