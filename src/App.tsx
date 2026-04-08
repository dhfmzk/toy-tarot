import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Home from './pages/Home';
import Tarot from './pages/Tarot';
import Astrology from './pages/Astrology';
import Starfield from './components/Starfield';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen relative font-sans text-brand-100 flex flex-col selection:bg-brand-500 selection:text-white">
        <Starfield />
        <nav className="w-full fixed top-0 bg-brand-900/80 backdrop-blur-lg border-b border-brand-800 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-brand-100 flex items-center gap-2">
                <span className="text-xl">✨</span> Lumina
              </Link>
              
              <div className="hidden sm:flex space-x-10">
                <Link to="/tarot" className="text-brand-300 hover:text-white transition-colors font-medium relative group">
                  타로
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
                </Link>
                <Link to="/astrology" className="text-brand-300 hover:text-white transition-colors font-medium relative group">
                  점성술
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-500 transition-all group-hover:w-full"></span>
                </Link>
              </div>

              <div className="sm:hidden">
                <button onClick={() => setMenuOpen(!menuOpen)} className="text-brand-300 hover:text-white transition">
                  {menuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>
          
          {menuOpen && (
            <div className="sm:hidden bg-brand-900 border-b border-brand-800">
              <div className="flex flex-col px-4 pt-2 pb-5 space-y-3">
                <Link to="/tarot" onClick={() => setMenuOpen(false)} className="text-brand-300 hover:text-white hover:bg-brand-800 px-4 py-3 rounded-xl font-medium transition">타로</Link>
                <Link to="/astrology" onClick={() => setMenuOpen(false)} className="text-brand-300 hover:text-white hover:bg-brand-800 px-4 py-3 rounded-xl font-medium transition">점성술</Link>
              </div>
            </div>
          )}
        </nav>

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tarot" element={<Tarot />} />
            <Route path="/astrology" element={<Astrology />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
