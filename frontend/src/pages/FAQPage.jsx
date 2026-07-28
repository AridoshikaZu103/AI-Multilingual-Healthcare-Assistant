import { useState, useEffect } from 'react';
import {
  HiOutlineQuestionMarkCircle,
  HiOutlineChevronDown,
  HiOutlineFunnel,
} from 'react-icons/hi2';
import { getFAQs } from '../services/api';

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="glass-card-hover overflow-hidden">
      <button
        className="w-full flex items-start gap-3 p-5 text-left"
        onClick={onToggle}
      >
        <HiOutlineQuestionMarkCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white leading-snug">{faq.question}</h3>
        </div>
        <HiOutlineChevronDown
          className={`w-4 h-4 text-surface-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pl-13 animate-fade-in">
          <div className="pl-8 text-sm text-surface-300 leading-relaxed whitespace-pre-line">
            {faq.answer}
          </div>
        </div>
      )}
    </div>
  );
}

function FAQPage({ t, language }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchFAQs();
  }, [language]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const data = await getFAQs(language);
      setFaqs(data.faqs || []);

      const cats = [...new Set((data.faqs || []).map((f) => f.category).filter(Boolean))];
      setCategories(cats);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
      setFaqs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredFAQs = faqs.filter((faq) => {
    return !selectedCategory || faq.category === selectedCategory;
  });

  return (
    <div className="p-4 lg:p-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <HiOutlineQuestionMarkCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{t('faq.title')}</h1>
            <p className="text-sm text-surface-400">{t('faq.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap animate-slide-up">
        <HiOutlineFunnel className="w-4 h-4 text-surface-500" />
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200
            ${!selectedCategory
              ? 'bg-primary-500/10 text-primary-300 border-primary-500/20'
              : 'bg-surface-800/50 text-surface-400 border-surface-700/50 hover:text-white hover:border-surface-600'
            }`}
        >
          {t('faq.allCategories')}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200
              ${selectedCategory === cat
                ? 'bg-primary-500/10 text-primary-300 border-primary-500/20'
                : 'bg-surface-800/50 text-surface-400 border-surface-700/50 hover:text-white hover:border-surface-600'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ list */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex items-center gap-3 text-surface-400">
            <div className="w-5 h-5 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
            <span className="text-sm">{t('common.loading')}</span>
          </div>
        </div>
      ) : filteredFAQs.length === 0 ? (
        <div className="text-center py-20">
          <HiOutlineQuestionMarkCircle className="w-12 h-12 text-surface-600 mx-auto mb-3" />
          <p className="text-surface-400">{t('faq.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFAQs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FAQPage;
