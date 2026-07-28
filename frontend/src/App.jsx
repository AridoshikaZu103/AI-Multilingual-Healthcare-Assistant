import { useState } from 'react';
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
      <div className="flex h-screen overflow-hidden bg-surface-950">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          t={t}
          language={language}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header
            t={t}
            language={language}
            onLanguageChange={setLanguage}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />

          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<ChatPage t={t} language={language} />} />
              <Route path="/schemes" element={<SchemesPage t={t} language={language} />} />
              <Route path="/facilities" element={<FacilitiesPage t={t} language={language} />} />
              <Route path="/faq" element={<FAQPage t={t} language={language} />} />
            </Routes>
          </main>
        </div>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
