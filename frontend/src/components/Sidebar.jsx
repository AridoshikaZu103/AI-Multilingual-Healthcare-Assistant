import { NavLink } from 'react-router-dom';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineShieldCheck,
  HiOutlineBuildingOffice2,
  HiOutlineQuestionMarkCircle,
  HiOutlineHeart,
  HiOutlineXMark,
  HiOutlinePhone,
  HiSparkles,
} from 'react-icons/hi2';

const NAV_ITEMS = [
  { path: '/', icon: HiOutlineChatBubbleLeftRight, labelKey: 'nav.chat' },
  { path: '/schemes', icon: HiOutlineShieldCheck, labelKey: 'nav.schemes' },
  { path: '/facilities', icon: HiOutlineBuildingOffice2, labelKey: 'nav.facilities' },
  { path: '/faq', icon: HiOutlineQuestionMarkCircle, labelKey: 'nav.faq' },
];

function Sidebar({ isOpen, onToggle, t }) {
  return (
    <aside
      className={`fixed lg:static inset-y-0 left-0 z-30 w-72 flex flex-col
                  bg-[#0a0f1d]/85 backdrop-blur-2xl border-r border-white/10
                  transition-all duration-300 ease-in-out shadow-2xl shadow-black/80
                  ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-0'}`}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between p-5 border-b border-white/10">
        <div className="flex items-center gap-3.5 group cursor-pointer">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-all duration-300">
            <HiOutlineHeart className="w-6 h-6 text-white animate-pulse" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                AI Healthcare
              </h2>
              <HiSparkles className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <p className="text-[11px] text-cyan-400/90 font-medium tracking-wide">Pro Assistant</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all lg:hidden"
        >
          <HiOutlineXMark className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5">
        <p className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Menu Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `nav-item group relative ${isActive ? 'active' : ''}`
            }
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
          >
            {({ isActive }) => (
              <>
                {/* Active Left Neon Glow Bar */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]" />
                )}
                <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-white'}`} />
                <span className="text-sm font-medium">{t(item.labelKey)}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Emergency Info Card */}
      <div className="p-4">
        <div className="relative p-4 rounded-2xl bg-gradient-to-br from-rose-950/40 via-red-950/20 to-slate-950/60 border border-red-500/30 backdrop-blur-xl shadow-lg shadow-red-950/30 transition-all duration-300 hover:border-red-500/50 hover:shadow-red-500/20 hover:-translate-y-0.5">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 animate-pulse">
              <HiOutlinePhone className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider text-red-300 uppercase">Emergency Hotlines</span>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-red-200/90 flex justify-between items-center">
              <span>National Emergency</span>
              <span className="font-bold text-white bg-red-500/30 px-2 py-0.5 rounded-md border border-red-400/30">112</span>
            </p>
            <p className="text-xs text-red-200/90 flex justify-between items-center">
              <span>Ambulance Service</span>
              <span className="font-bold text-white bg-red-500/30 px-2 py-0.5 rounded-md border border-red-400/30">108</span>
            </p>
            <p className="text-xs text-red-200/90 flex justify-between items-center">
              <span>Health Helpline</span>
              <span className="font-bold text-white bg-red-500/30 px-2 py-0.5 rounded-md border border-red-400/30">104</span>
            </p>
          </div>
        </div>
      </div>

      {/* Version & Status Badge */}
      <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between">
        <p className="text-[11px] text-slate-400 font-medium">
          v1.0.0 Pro Edition
        </p>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Live</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
