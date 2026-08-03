import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import SchemesPage from './pages/SchemesPage';
import FacilitiesPage from './pages/FacilitiesPage';
import FAQPage from './pages/FAQPage';

import en from './i18n/en.json';
import hi from './i18n/hi.json';
import te from './i18n/te.json';

const translations = { en, hi, te };

function App() {
  const [language, setLanguage] = useState('en');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Global Mouse Position Tracking for 3D Ambient Light & Parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      const xPercent = `${(e.clientX / window.innerWidth) * 100}%`;
      const yPercent = `${(e.clientY / window.innerHeight) * 100}%`;
      document.documentElement.style.setProperty('--mouse-x', xPercent);
      document.documentElement.style.setProperty('--mouse-y', yPercent);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const t = (key) => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
    }
    return result || key;
  };

  return (
    <Router>
      <div className="relative flex h-screen overflow-hidden bg-[#060913] text-slate-100 mouse-spotlight selection:bg-cyan-500/30 selection:text-cyan-200">
        
        {/* Live Ambient Floating 3D Orbs (Apple-Style Background Loop) */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          {/* Orb 1: Cyan/Teal Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-cyan-500/15 blur-[120px] animate-float-orb-1" />
          
          {/* Orb 2: Indigo/Violet Glow */}
          <div className="absolute top-1/2 -right-32 w-[30rem] h-[30rem] rounded-full bg-indigo-600/15 blur-[140px] animate-float-orb-2" />
          
          {/* Orb 3: Emerald Accent */}
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px] animate-pulse-ring" />
          
          {/* Cyber Grid Depth Overlay */}
          <div 
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Sidebar */}
        <div className="relative z-20 flex-shrink-0">
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            t={t}
            language={language}
          />
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex flex-1 flex-col overflow-hidden backdrop-blur-3xl">
          <Header
            t={t}
            language={language}
            onLanguageChange={setLanguage}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-apple-reveal">
            <Routes>
              <Route path="/" element={<ChatPage t={t} language={language} />} />
              <Route path="/schemes" element={<SchemesPage t={t} language={language} />} />
              <Route path="/facilities" element={<FacilitiesPage t={t} language={language} />} />
              <Route path="/faq" element={<FAQPage t={t} language={language} />} />
            </Routes>
          </main>
        </div>

        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-15 bg-black/70 backdrop-blur-md lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
