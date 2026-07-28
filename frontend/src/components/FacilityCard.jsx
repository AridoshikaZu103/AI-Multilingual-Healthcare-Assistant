import {
  HiOutlineBuildingOffice2,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineExclamationTriangle,
} from 'react-icons/hi2';

function FacilityCard({ facility, t }) {
  const typeColors = {
    'Government General Hospital': 'from-blue-500 to-blue-700',
    'District Hospital': 'from-purple-500 to-purple-700',
    'Community Health Centre': 'from-amber-500 to-amber-700',
    'Primary Health Centre': 'from-green-500 to-green-700',
    'Sub Health Centre': 'from-teal-500 to-teal-700',
  };

  const typeBadgeColors = {
    'Government General Hospital': 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    'District Hospital': 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    'Community Health Centre': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    'Primary Health Centre': 'bg-green-500/10 text-green-300 border-green-500/20',
    'Sub Health Centre': 'bg-teal-500/10 text-teal-300 border-teal-500/20',
  };

  const gradientClass = typeColors[facility.facility_type] || 'from-surface-500 to-surface-700';
  const badgeClass = typeBadgeColors[facility.facility_type] || 'bg-surface-500/10 text-surface-300 border-surface-500/20';

  return (
    <div className="glass-card-hover overflow-hidden animate-slide-up">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <HiOutlineBuildingOffice2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white">{facility.name}</h3>
            <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border mt-1 ${badgeClass}`}>
              {facility.facility_type}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="mt-4 space-y-2.5">
          {/* Address */}
          {facility.address && (
            <div className="flex items-start gap-2">
              <HiOutlineMapPin className="w-4 h-4 text-surface-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-surface-300">
                {facility.address}
                {facility.district && `, ${facility.district}`}
                {facility.state && `, ${facility.state}`}
                {facility.pincode && ` - ${facility.pincode}`}
              </span>
            </div>
          )}

          {/* Phone */}
          {facility.phone && (
            <div className="flex items-center gap-2">
              <HiOutlinePhone className="w-4 h-4 text-surface-500" />
              <a href={`tel:${facility.phone}`} className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                {facility.phone}
              </a>
            </div>
          )}

          {/* Emergency */}
          {facility.emergency_phone && (
            <div className="flex items-center gap-2">
              <HiOutlineExclamationTriangle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-surface-500">{t('facilities.emergency')}:</span>
              <a href={`tel:${facility.emergency_phone}`} className="text-xs text-red-300 font-semibold hover:text-red-200 transition-colors">
                {facility.emergency_phone}
              </a>
            </div>
          )}

          {/* Timings */}
          {facility.timings && (
            <div className="flex items-start gap-2">
              <HiOutlineClock className="w-4 h-4 text-surface-500 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-surface-300">{facility.timings}</span>
            </div>
          )}
        </div>

        {/* Services */}
        {facility.services && (
          <div className="mt-4 pt-3 border-t border-surface-700/30">
            <p className="text-[10px] font-semibold text-surface-500 uppercase tracking-wider mb-2">
              {t('facilities.services')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {facility.services.split(',').slice(0, 6).map((service, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-[10px] rounded-full bg-surface-700/50 text-surface-300 border border-surface-600/30"
                >
                  {service.trim()}
                </span>
              ))}
              {facility.services.split(',').length > 6 && (
                <span className="px-2 py-0.5 text-[10px] rounded-full bg-surface-700/50 text-surface-400">
                  +{facility.services.split(',').length - 6} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FacilityCard;
