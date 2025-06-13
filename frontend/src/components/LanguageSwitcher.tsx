import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    // Force a reload of the translations
    i18n.reloadResources(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'en' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('rw')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'rw' ? 'bg-blue-500 text-white' : 'bg-gray-200'
        }`}
      >
        RW
      </button>
    </div>
  );
};

export default LanguageSwitcher; 