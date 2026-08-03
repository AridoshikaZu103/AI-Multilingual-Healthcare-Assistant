import { HiOutlineGlobeAlt, HiOutlineBars3, HiOutlineHeart, HiShieldCheck } from 'react-icons/hi2';
import LanguageSelector from './LanguageSelector';

function Header({ t, language, onLanguageChange, onToggleSidebar }) {
  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-3.5 border-b border-white/10 bg-[#0a0f1d]/75 backdrop-blur-2xl z-10 sticky top-0 shadow-lg shadow-black/40">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          id="sidebar-toggle"
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all lg:hidden"
        >
          <HiOutlineBars3 className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <HiOutlineHeart className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-extrabold tracking-tight gradient-text">{t('app.title')}</h1>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">{t('app.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Medical Advisory Badge */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 shadow-inner">
          <HiShieldCheck className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] text-amber-200 font-medium">
            {t('app.disclaimer').substring(0, 52)}...
          </span>
        </div>

        {/* Language Selector */}
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
