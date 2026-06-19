import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AppDataProvider } from './context/AppDataContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Profile from './pages/Profile'
import BodyAnalysis from './pages/BodyAnalysis'
import Wardrobe from './pages/Wardrobe'
import Recommendations from './pages/Recommendations'
import Discover from './pages/Discover'

export default function App() {
  return (
    <AppDataProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#231F1C',
              color: '#FBF8F4',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '12px',
              borderRadius: '9999px',
              padding: '10px 18px',
            },
            duration: 1800,
          }}
        />
        <main className="max-w-lg mx-auto px-4 pt-6 pb-24 min-h-screen bg-canvas">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/body-analysis" element={<BodyAnalysis />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/discover" element={<Discover />} />
          </Routes>
        </main>
        <BottomNav />
      </BrowserRouter>
    </AppDataProvider>
  )
}
