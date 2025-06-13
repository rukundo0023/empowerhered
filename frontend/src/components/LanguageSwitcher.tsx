import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline'; // You can replace with any icon

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const changeLanguage = async (lng: string) => {
    await i18n.changeLanguage(lng);
    i18n.reloadResources(lng);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Toggle language dropdown"
      >
        <GlobeAltIcon className="w-5 h-5 text-gray-700" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-10">
          <button
            onClick={() => changeLanguage('en')}
            className={`block w-full text-left px-4 py-2 text-sm ${
              i18n.language === 'en' ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            🇺🇸 English
          </button>
          <button
            onClick={() => changeLanguage('rw')}
            className={`block w-full text-left px-4 py-2 text-sm ${
              i18n.language === 'rw' ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
            }`}
          >
            🇷🇼 Kinyarwanda
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
