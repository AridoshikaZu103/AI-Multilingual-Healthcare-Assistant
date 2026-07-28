import { useState, useRef, useEffect } from 'react';
import { HiOutlineGlobeAlt, HiOutlineChevronDown } from 'react-icons/hi2';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
];

function LanguageSelector({ language, onLanguageChange, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === language);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        id="language-selector"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-800/50 border border-surface-700/50
                   hover:bg-surface-800 hover:border-primary-500/30 transition-all duration-200"
      >
        <HiOutlineGlobeAlt className="w-4 h-4 text-primary-400" />
        <span className="text-sm font-medium text-surface-200">
          {currentLang?.flag} {currentLang?.name}
        </span>
        <HiOutlineChevronDown
          className={`w-3 h-3 text-surface-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 py-2 glass-card shadow-2xl shadow-black/20 z-50 animate-fade-in">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">
            {t('language.select')}
          </div>
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              id={`lang-${lang.code}`}
              onClick={() => {
                onLanguageChange(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150
                ${language === lang.code
                  ? 'bg-primary-500/10 text-primary-300'
                  : 'text-surface-300 hover:bg-surface-700/50 hover:text-white'
                }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <div className="ml-auto w-2 h-2 rounded-full bg-primary-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default LanguageSelector;
