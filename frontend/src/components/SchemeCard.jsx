import { useState } from 'react';
import {
  HiOutlineShieldCheck,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiOutlineCheckBadge,
  HiOutlineGlobeAlt,
  HiOutlineArrowTopRightOnSquare,
  HiSparkles,
} from 'react-icons/hi2';

function SchemeCard({ scheme, t }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate 3D tilt angles
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, transition: 'transform 0.15s ease-out, box-shadow 0.3s ease' }}
      className="glass-card-hover group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1424]/60 backdrop-blur-2xl shadow-xl shadow-black/40 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
    >
      {/* Dynamic Specular Shimmer Top Border */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card Header */}
      <div
        className="p-6"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner">
              <HiOutlineShieldCheck className="w-6 h-6 text-cyan-300" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                  {scheme.name}
                </h3>
                <HiSparkles className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {scheme.name_local && (
                <p className="text-xs font-semibold text-cyan-400 mt-0.5">{scheme.name_local}</p>
              )}
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {scheme.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {scheme.category && (
              <span className="chip hidden sm:inline-flex">{scheme.category}</span>
            )}
            <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 group-hover:text-white group-hover:bg-cyan-500/20 transition-all">
              <HiOutlineChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180 text-cyan-300' : ''
                }`}
              />
            </div>
          </div>
        </div>

        {/* Coverage badge */}
        {scheme.coverage && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
            <HiOutlineGlobeAlt className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">
              <strong className="text-slate-300">{t('schemes.coverage')}:</strong> {scheme.coverage}
            </span>
          </div>
        )}
      </div>

      {/* Expanded details view */}
      {isExpanded && (
        <div className="px-6 pb-6 space-y-4 border-t border-white/10 pt-5 bg-black/20 animate-apple-reveal">
          <div>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">{scheme.description}</p>
          </div>

          {/* Eligibility */}
          {scheme.eligibility && (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineCheckBadge className="w-5 h-5 text-emerald-400" />
                <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  {t('schemes.eligibility')}
                </h4>
              </div>
              <div className="text-xs text-emerald-100/90 whitespace-pre-line leading-relaxed pl-7">
                {scheme.eligibility}
              </div>
            </div>
          )}

          {/* Documents Required */}
          {scheme.documents_required && (
            <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30">
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineDocumentText className="w-5 h-5 text-sky-400" />
                <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                  {t('schemes.documents')}
                </h4>
              </div>
              <div className="text-xs text-sky-100/90 whitespace-pre-line leading-relaxed pl-7">
                {scheme.documents_required}
              </div>
            </div>
          )}

          {/* Benefits */}
          {scheme.benefits && (
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30">
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineShieldCheck className="w-5 h-5 text-indigo-400" />
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  {t('schemes.benefits')}
                </h4>
              </div>
              <div className="text-xs text-indigo-100/90 whitespace-pre-line leading-relaxed pl-7">
                {scheme.benefits}
              </div>
            </div>
          )}

          {/* Official Website Link */}
          {scheme.website && (
            <a
              href={scheme.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 border border-cyan-500/40 text-xs font-semibold text-cyan-200 hover:text-white hover:border-cyan-400 shadow-lg transition-all duration-300 hover:scale-105"
            >
              <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
              {t('schemes.website')}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default SchemeCard;
