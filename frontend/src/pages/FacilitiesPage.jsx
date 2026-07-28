import { useState, useEffect } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import FacilityCard from '../components/FacilityCard';
import { getFacilities } from '../services/api';

const FACILITY_TYPES = [
  'Government General Hospital',
  'District Hospital',
  'Community Health Centre',
  'Primary Health Centre',
  'Sub Health Centre',
];

function FacilitiesPage({ t, language }) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const data = await getFacilities();
      setFacilities(data.facilities || []);
    } catch (error) {
      console.error('Failed to fetch facilities:', error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter client-side
  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      !searchTerm ||
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (facility.district && facility.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (facility.state && facility.state.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = !selectedType || facility.facility_type === selectedType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <HiOutlineBuildingOffice2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t('facilities.title')}</h1>
            <p className="text-sm text-surface-400">{t('facilities.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            id="facility-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('facilities.search')}
            className="input-field pl-11"
          />
        </div>
        <select
          id="facility-type-filter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="input-field w-full sm:w-64"
        >
          <option value="">{t('facilities.allTypes')}</option>
          {FACILITY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-xs text-surface-500 mb-4">
          {filteredFacilities.length} {filteredFacilities.length === 1 ? 'facility' : 'facilities'} found
        </p>
      )}

      {/* Facilities grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-surface-400">
            <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-sm">{t('common.loading')}</span>
          </div>
        </div>
      ) : filteredFacilities.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineBuildingOffice2 className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400">{t('facilities.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredFacilities.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

export default FacilitiesPage;
