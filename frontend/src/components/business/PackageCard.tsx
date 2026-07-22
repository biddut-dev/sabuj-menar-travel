"use client";

import React from 'react';
import { Calendar, Clock, MapPin, Check, Plane, Shield, Utensils, Compass, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Package {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  type: 'HAJJ' | 'UMRAH';
  category: 'ECONOMY' | 'STANDARD' | 'PREMIUM' | 'VIP';
  durationDays: number;
  price: number;
  hotelDetailsMakkah: string;
  hotelDetailsMakkahEn: string;
  hotelDetailsMadinah: string;
  hotelDetailsMadinahEn: string;
  departureDate: string | Date;
  mealsIncluded: boolean;
  visaIncluded: boolean;
  flightIncluded: boolean;
  guideIncluded: boolean;
  ziyaratIncluded: boolean;
  highlights: string[];
  highlightsEn: string[];
}

interface PackageCardProps {
  pkg: Package;
  onBook: (pkg: Package) => void;
}

export default function PackageCard({ pkg, onBook }: PackageCardProps) {
  const { language, t, tExt, tExtArray } = useLanguage();

  // Color configuration based on category
  const categoryColors = {
    VIP: 'bg-amber-100 text-amber-800 border-amber-300',
    PREMIUM: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    STANDARD: 'bg-blue-100 text-blue-800 border-blue-300',
    ECONOMY: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  const categoryName = language === 'en'
    ? `${pkg.category} Category`
    : `${pkg.category === 'VIP' ? 'ভিআইপি' : pkg.category === 'PREMIUM' ? 'প্রিমিয়াম' : pkg.category === 'STANDARD' ? 'স্ট্যান্ডার্ড' : 'ইকোনমি'} ক্যাটাগরি`;

  const formattedDate = new Date(pkg.departureDate).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const activeHighlights = tExtArray(pkg.highlights, pkg.highlightsEn);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1">
      {/* Top Graphic */}
      <div className="bg-gradient-to-r from-brand-emerald to-brand-emerald-dark p-6 relative text-white flex-shrink-0">
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none islamic-pattern"></div>
        <div className="flex justify-between items-start">
          <span className="text-xs uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">
            {pkg.type === 'HAJJ' ? t('filterHajj') : t('filterUmrah')}
          </span>
          <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${categoryColors[pkg.category]}`}>
            {categoryName}
          </span>
        </div>
        <h4 className="font-serif-title font-bold text-lg mt-4 leading-tight group-hover:text-brand-gold-light transition-colors min-h-[50px] line-clamp-2">
          {tExt(pkg.title, pkg.titleEn)}
        </h4>
        <div className="mt-4 flex justify-between items-end border-t border-white/10 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-white/80">
            <Clock className="w-4 h-4 text-brand-gold-light" />
            <span>{language === 'en' ? `${pkg.durationDays} Days` : `${pkg.durationDays} দিন`}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-white/70 uppercase tracking-wider leading-none">
              {t('priceFrom')}
            </p>
            <p className="font-bold text-xl text-brand-gold-light mt-0.5">৳ {pkg.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div className="space-y-5">
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {tExt(pkg.description, pkg.descriptionEn)}
          </p>

          {/* Hotels info */}
          <div className="bg-brand-bg p-3.5 rounded-xl border border-gray-100 space-y-2 text-xs text-gray-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-emerald">{language === 'en' ? 'Makkah:' : 'মক্কা:'}</span> {tExt(pkg.hotelDetailsMakkah, pkg.hotelDetailsMakkahEn)}
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-emerald flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-emerald">{language === 'en' ? 'Madinah:' : 'মদিনা:'}</span> {tExt(pkg.hotelDetailsMadinah, pkg.hotelDetailsMadinahEn)}
              </div>
            </div>
          </div>

          {/* Checklists Icons */}
          <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold text-gray-500 py-1">
            <div className={`flex flex-col items-center gap-1 ${pkg.flightIncluded ? 'text-brand-emerald' : 'opacity-40'}`}>
              <Plane className="w-4 h-4" />
              <span>{language === 'en' ? 'Flight' : 'ফ্লাইট'}</span>
            </div>
            <div className={`flex flex-col items-center gap-1 ${pkg.visaIncluded ? 'text-brand-emerald' : 'opacity-40'}`}>
              <Shield className="w-4 h-4" />
              <span>{language === 'en' ? 'Visa' : 'ভিসা'}</span>
            </div>
            <div className={`flex flex-col items-center gap-1 ${pkg.mealsIncluded ? 'text-brand-emerald' : 'opacity-40'}`}>
              <Utensils className="w-4 h-4" />
              <span>{language === 'en' ? 'Meals' : 'খাবার'}</span>
            </div>
            <div className={`flex flex-col items-center gap-1 ${pkg.guideIncluded ? 'text-brand-emerald' : 'opacity-40'}`}>
              <Compass className="w-4 h-4" />
              <span>{language === 'en' ? 'Guide' : 'গাইড'}</span>
            </div>
            <div className={`flex flex-col items-center gap-1 ${pkg.ziyaratIncluded ? 'text-brand-emerald' : 'opacity-40'}`}>
              <Eye className="w-4 h-4" />
              <span>{language === 'en' ? 'Ziyarat' : 'জিয়ারত'}</span>
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">{t('inclusions')}:</p>
            <ul className="space-y-1.5 text-xs text-gray-600">
              {activeHighlights.slice(0, 3).map((hl, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{hl}</span>
                </li>
              ))}
              {activeHighlights.length > 3 && (
                <li className="text-[10px] text-brand-emerald font-bold pl-5">
                  {language === 'en'
                    ? `+ ${activeHighlights.length - 3} more features included`
                    : `+ আরও ${activeHighlights.length - 3}টি সুবিধা অন্তর্ভুক্ত`}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => onBook(pkg)}
            className="flex-grow bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold py-2.5 rounded-lg text-sm transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {t('bookNow')}
          </button>
          <div className="text-center sm:text-left py-1 px-2 text-[10px] text-gray-500 font-semibold flex items-center justify-center gap-1 bg-brand-bg rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-brand-gold" />
            <span>{language === 'en' ? `Dep: ${formattedDate}` : `যাত্রা: ${formattedDate}`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
