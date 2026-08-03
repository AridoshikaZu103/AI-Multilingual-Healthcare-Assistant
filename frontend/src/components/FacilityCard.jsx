import { useState } from 'react';
import {
  HiOutlineBuildingOffice2,
  HiOutlinePhone,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineExclamationTriangle,
  HiSparkles,
} from 'react-icons/hi2';

function FacilityCard({ facility, t }) {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const typeColors = {
    'Government General Hospital': 'from-sky-500 to-indigo-600',
    'District Hospital': 'from-indigo-500 to-purple-700',
    'Community Health Centre': 'from-amber-500 to-orange-700',
    'Primary Health Centre': 'from-emerald-500 to-teal-700',
    'Sub Health Centre': 'from-teal-500 to-cyan-700',
  };

  const typeBadgeColors = {
    'Government General Hospital': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    'District Hospital': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    'Community Health Centre': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'Primary Health Centre': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    'Sub Health Centre': 'bg-teal-500/15 text-teal-300 border-teal-500/30',
  };

  const gradientClass = typeColors[facility.facility_type] || 'from-slate-600 to-slate-800';
  const badgeClass = typeBadgeColors[facility.facility_type] || 'bg-slate-500/15 text-slate-300 border-slate-500/30';

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
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
      className="glass-card-hover group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1424]/60 backdrop-blur-2xl shadow-xl shadow-black/40 hover:border-cyan-500/40 hover:shadow-2xl hover:shadow-cyan-500/10"
    >
      {/* Specular Edge Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-300`}>
            <HiOutlineBuildingOffice2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-200 transition-colors">
                {facility.name}
              </h3>
              <HiSparkles className="w-4 h-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full border mt-1.5 ${badgeClass}`}>
              {facility.facility_type}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="mt-5 space-y-3">
          {/* Address */}
          {facility.address && (
            <div className="flex items-start gap-2.5">
              <HiOutlineMapPin className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-300 leading-relaxed">
                {facility.address}
                {facility.district && `, ${facility.district}`}
                {facility.state && `, ${facility.state}`}
                {facility.pincode && ` - ${facility.pincode}`}
              </span>
            </div>
          )}

          {/* Phone */}
          {facility.phone && (
            <div className="flex items-center gap-2.5">
              <HiOutlinePhone className="w-4 h-4 text-cyan-400" />
              <a href={`tel:${facility.phone}`} className="text-xs text-cyan-300 font-medium hover:text-cyan-100 transition-colors">
                {facility.phone}
              </a>
            </div>
          )}

          {/* Emergency */}
          {facility.emergency_phone && (
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-red-950/30 border border-red-500/30">
              <HiOutlineExclamationTriangle className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs text-red-300 font-medium">{t('facilities.emergency')}:</span>
              <a href={`tel:${facility.emergency_phone}`} className="text-xs text-white font-bold hover:text-red-200 transition-colors">
                {facility.emergency_phone}
              </a>
            </div>
          )}

          {/* Timings */}
          {facility.timings && (
            <div className="flex items-start gap-2.5">
              <HiOutlineClock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-300 font-medium">{facility.timings}</span>
            </div>
          )}
        </div>

        {/* Services Badges */}
        {facility.services && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">
              {t('facilities.services')}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {facility.services.split(',').slice(0, 6).map((service, index) => (
                <span
                  key={index}
                  className="px-2.5 py-1 text-[10px] font-medium rounded-lg bg-white/5 text-slate-200 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-colors"
                >
                  {service.trim()}
                </span>
              ))}
              {facility.services.split(',').length > 6 && (
                <span className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
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
