import { useState } from 'react';
import {
  HiOutlineShieldCheck,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiOutlineCheckBadge,
  HiOutlineGlobeAlt,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2';

function SchemeCard({ scheme, t }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-card-hover overflow-hidden animate-slide-up">
      {/* Header */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <HiOutlineShieldCheck className="w-5 h-5 text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white leading-snug">
                {scheme.name}
              </h3>
              {scheme.name_local && (
                <p className="text-xs text-primary-400 mt-0.5">{scheme.name_local}</p>
              )}
              <p className="text-xs text-surface-400 mt-1.5 line-clamp-2">
                {scheme.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {scheme.category && (
              <span className="chip hidden sm:inline-flex">{scheme.category}</span>
            )}
            <HiOutlineChevronDown
              className={`w-4 h-4 text-surface-400 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {/* Coverage badge */}
        {scheme.coverage && (
          <div className="flex items-center gap-1.5 mt-3">
            <HiOutlineGlobeAlt className="w-3.5 h-3.5 text-surface-500" />
            <span className="text-[11px] text-surface-500">{t('schemes.coverage')}: {scheme.coverage}</span>
          </div>
        )}
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-surface-700/30 pt-4 animate-fade-in">
          {/* Full description */}
          <div>
            <p className="text-sm text-surface-300 leading-relaxed">{scheme.description}</p>
          </div>

          {/* Eligibility */}
          {scheme.eligibility && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineCheckBadge className="w-4 h-4 text-green-400" />
                <h4 className="text-xs font-semibold text-green-300 uppercase tracking-wider">
                  {t('schemes.eligibility')}
                </h4>
              </div>
              <div className="pl-6 text-sm text-surface-300 whitespace-pre-line leading-relaxed">
                {scheme.eligibility}
              </div>
            </div>
          )}

          {/* Documents Required */}
          {scheme.documents_required && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineDocumentText className="w-4 h-4 text-blue-400" />
                <h4 className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  {t('schemes.documents')}
                </h4>
              </div>
              <div className="pl-6 text-sm text-surface-300 whitespace-pre-line leading-relaxed">
                {scheme.documents_required}
              </div>
            </div>
          )}

          {/* Benefits */}
          {scheme.benefits && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HiOutlineShieldCheck className="w-4 h-4 text-primary-400" />
                <h4 className="text-xs font-semibold text-primary-300 uppercase tracking-wider">
                  {t('schemes.benefits')}
                </h4>
              </div>
              <div className="pl-6 text-sm text-surface-300 whitespace-pre-line leading-relaxed">
                {scheme.benefits}
              </div>
            </div>
          )}

          {/* Website link */}
          {scheme.website && (
            <a
              href={scheme.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500/10 border border-primary-500/20
                         text-sm text-primary-300 hover:bg-primary-500/20 transition-all duration-200"
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
