import { useState, useEffect } from 'react';
import { HiOutlineMagnifyingGlass, HiOutlineShieldCheck } from 'react-icons/hi2';
import SchemeCard from '../components/SchemeCard';
import { getSchemes } from '../services/api';

function SchemesPage({ t, language }) {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchSchemes();
  }, [language]);

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = {};
      if (language !== 'en') {
        params.language = language;
      }
      const data = await getSchemes(params);
      setSchemes(data.schemes || []);

      // Extract unique categories
      const cats = [...new Set((data.schemes || []).map((s) => s.category).filter(Boolean))];
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch schemes:', error);
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter schemes client-side
  const filteredSchemes = schemes.filter((scheme) => {
    const matchesSearch =
      !searchTerm ||
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || scheme.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      {/* Page header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <HiOutlineShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t('schemes.title')}</h1>
            <p className="text-sm text-surface-400">{t('schemes.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up">
        <div className="relative flex-1">
          <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            id="scheme-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('schemes.search')}
            className="input-field pl-11"
          />
        </div>
        <select
          id="scheme-category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field w-full sm:w-48"
        >
          <option value="">{t('schemes.all')}</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Schemes list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-surface-400">
            <div className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            <span className="text-sm">{t('common.loading')}</span>
          </div>
        </div>
      ) : filteredSchemes.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineShieldCheck className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400">{t('schemes.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredSchemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SchemesPage;
