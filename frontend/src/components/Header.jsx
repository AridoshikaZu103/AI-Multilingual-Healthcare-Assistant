import { HiOutlineGlobeAlt, HiOutlineBars3, HiOutlineHeart } from 'react-icons/hi2';
import LanguageSelector from './LanguageSelector';

function Header({ t, language, onLanguageChange, onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-surface-800/50 bg-surface-950/80 backdrop-blur-xl z-10">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all lg:hidden"
        >
          <HiOutlineBars3 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <HiOutlineHeart className="w-4 h-4 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold gradient-text">{t('app.title')}</h1>
            <p className="text-[10px] text-surface-500 leading-tight">{t('app.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Disclaimer badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-soft" />
          <span className="text-[10px] text-amber-300 font-medium">
            {t('app.disclaimer').substring(0, 50)}...
          </span>
        </div>

        {/* Language selector */}
        <LanguageSelector
          language={language}
          onLanguageChange={onLanguageChange}
          t={t}
        />
      </div>
    </header>
  );
}

export default Header;
