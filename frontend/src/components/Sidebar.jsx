import { NavLink } from 'react-router-dom';
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineShieldCheck,
  HiOutlineBuildingOffice2,
  HiOutlineQuestionMarkCircle,
  HiOutlineHeart,
  HiOutlineXMark,
  HiOutlinePhone,
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
                  bg-surface-900/95 backdrop-blur-xl border-r border-surface-800/50
                  transition-transform duration-300 ease-in-out
                  ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-0 lg:overflow-hidden lg:border-0'}`}
    >
      {/* Logo area */}
      <div className="flex items-center justify-between p-5 border-b border-surface-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <HiOutlineHeart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">AI Healthcare</h2>
            <p className="text-[10px] text-primary-400 font-medium">Assistant</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-800/50 transition-all lg:hidden"
        >
          <HiOutlineXMark className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="px-4 py-2 text-[10px] font-semibold text-surface-500 uppercase tracking-wider">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={() => {
              if (window.innerWidth < 1024) onToggle();
            }}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{t(item.labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Emergency info */}
      <div className="p-4">
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <HiOutlinePhone className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-300">Emergency</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-red-200/80">
              <span className="font-semibold">112</span> — National Emergency
            </p>
            <p className="text-xs text-red-200/80">
              <span className="font-semibold">108</span> — Ambulance
            </p>
            <p className="text-xs text-red-200/80">
              <span className="font-semibold">104</span> — Health Helpline
            </p>
          </div>
        </div>
      </div>

      {/* Version badge */}
      <div className="px-5 py-3 border-t border-surface-800/50">
        <p className="text-[10px] text-surface-600">
          AI Healthcare Assistant v1.0.0
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
