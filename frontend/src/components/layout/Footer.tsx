"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Clock, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FooterProps {
  settings?: {
    officeAddress?: string;
    officeAddressEn?: string;
    phone1?: string;
    phone2?: string;
    emailAddress?: string;
    businessHours?: string;
    businessHoursEn?: string;
    facebookUrl?: string;
    twitterUrl?: string;
    instagramUrl?: string;
    youtubeUrl?: string;
  };
}

export default function Footer({ settings }: FooterProps) {
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { language, t } = useLanguage();

  const address = language === 'en'
    ? (settings?.officeAddressEn || "Room No. 402, 4th Floor, Paltan Tower, Purana Paltan, Dhaka-1000, Bangladesh")
    : (settings?.officeAddress || "রুম নং ৪০২, ৪র্থ তলা, পল্টন টাওয়ার, পুরানা পল্টন, ঢাকা-১০০০, বাংলাদেশ");

  const phone1 = settings?.phone1 || "+880 1711 123456";
  const phone2 = settings?.phone2 || "+880 1819 654321";
  const email = settings?.emailAddress || "info@sabujmenar.com";

  const hours = language === 'en'
    ? (settings?.businessHoursEn || "Saturday - Thursday: 9:00 AM - 8:00 PM (Friday Closed)")
    : (settings?.businessHours || "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০ (শুক্রবার বন্ধ)");

  const aboutText = language === 'en'
    ? "Your premier gateway to performing sacred pilgrimages. We offer highly trusted, transparent, and spiritually enriched Hajj & Umrah services."
    : "আপনার হজ্জ ও ওমরাহ পালনের বিশ্বস্ত সহযোগী। আমরা অত্যন্ত স্বচ্ছতা, আরামদায়ক ব্যবস্থাপনা এবং ধর্মীয় নির্দেশনার সাথে আপনার পবিত্র যাত্রা সফল করতে সেবা প্রদান করি।";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setEmailInput('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const scrollSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="bg-brand-dark text-gray-300 pt-16 pb-8 border-t-4 border-brand-gold relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none islamic-pattern"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand and Logo */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-gold p-0.5 bg-white flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Sabuj Menar Logo"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-serif-title font-bold text-white text-base md:text-lg tracking-wide leading-tight">
                  {language === 'en' ? 'SABUJ MENAR' : 'সবুজ মিনার'}
                </h3>
                <p className="text-[10px] uppercase font-semibold text-brand-gold tracking-widest leading-none">
                  {language === 'en' ? 'Travel Agency' : 'ট্রাভেল এজেন্সি'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {aboutText}
            </p>
            <div className="text-xs text-brand-gold font-semibold bg-white/5 border border-brand-gold/20 p-3 rounded-lg">
              {t('regText')}
            </div>
            {/* Social Icons */}
            <div className="flex items-center space-x-3 pt-2">
              <Link href={settings?.facebookUrl || "https://facebook.com"} target="_blank" className="p-2 bg-white/5 hover:bg-brand-gold/20 rounded-full text-gray-300 hover:text-brand-gold transition-colors flex items-center justify-center w-8 h-8" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </Link>
              <Link href={settings?.twitterUrl || "https://twitter.com"} target="_blank" className="p-2 bg-white/5 hover:bg-brand-gold/20 rounded-full text-gray-300 hover:text-brand-gold transition-colors flex items-center justify-center w-8 h-8" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </Link>
              <Link href={settings?.instagramUrl || "https://instagram.com"} target="_blank" className="p-2 bg-white/5 hover:bg-brand-gold/20 rounded-full text-gray-300 hover:text-brand-gold transition-colors flex items-center justify-center w-8 h-8" aria-label="Instagram">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Link>
              <Link href={settings?.youtubeUrl || "https://youtube.com"} target="_blank" className="p-2 bg-white/5 hover:bg-brand-gold/20 rounded-full text-gray-300 hover:text-brand-gold transition-colors flex items-center justify-center w-8 h-8" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.528 3.545 12 3.545 12 3.545s-7.528 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.86.508 9.388.508 9.388.508s7.528 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif-title text-white font-bold text-lg border-b border-brand-gold/30 pb-3 mb-6 relative">
              {t('quickLinks')}
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-gold"></span>
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => scrollSection('about')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{t('aboutTitle')}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('services')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{t('services')}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('gallery')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{t('gallery')}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('testimonials')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{t('testimonials')}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('faq')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{t('faqs')}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('contact')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{t('contact')}</button>
              </li>
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-serif-title text-white font-bold text-lg border-b border-brand-gold/30 pb-3 mb-6 relative">
              {t('packages')}
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-gold"></span>
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => scrollSection('hajj-packages')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{t('filterHajj')}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('umrah-packages')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{t('filterUmrah')}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('services')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{language === 'en' ? 'VIP Packages' : 'ভিআইপি প্যাকেজ'}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('services')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{language === 'en' ? 'Group Hajj Tours' : 'গ্রুপ হজ্জ ট্যুর'}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('services')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{language === 'en' ? 'Family Umrah Plans' : 'পারিবারিক ওমরাহ পরিকল্পনা'}</button>
              </li>
              <li>
                <button onClick={() => scrollSection('services')} className="hover:text-brand-gold hover:translate-x-1 transition-all text-left">{language === 'en' ? 'Ziyarat Services' : 'জিয়ারত সেবা'}</button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif-title text-white font-bold text-lg border-b border-brand-gold/30 pb-3 mb-6 relative">
              {t('office')}
              <span className="absolute bottom-0 left-0 w-8 h-[2px] bg-brand-gold"></span>
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-brand-gold flex-shrink-0 mt-0.5" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <div>
                  <p>{phone1}</p>
                  {phone2 && <p>{phone2}</p>}
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>{email}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <span>{hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup Banner */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="text-center lg:text-left">
            <h5 className="font-serif-title text-white font-bold text-base">
              {language === 'en' ? 'Subscribe to our newsletter' : 'আমাদের নিউজলেটারে সাবস্ক্রাইব করুন'}
            </h5>
            <p className="text-xs text-gray-400">
              {language === 'en' 
                ? 'Get religious updates, package launches, and pilgrim checklists right in your inbox.' 
                : 'পবিত্র ভ্রমণ সংক্রান্ত আপডেট, নতুন প্যাকেজ এবং প্রয়োজনীয় সহায়িকা পেতে আপনার ইমেইল দিয়ে সংযুক্ত থাকুন।'}
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-2 max-w-md">
            <div className="relative flex-grow">
              <input
                type="email"
                placeholder={language === 'en' ? 'Your email address' : 'আপনার ইমেইল ঠিকানা'}
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-white/5 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all"
              />
            </div>
            <button
              type="submit"
              className="bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-1.5 shadow-md flex-shrink-0 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              {language === 'en' ? 'Subscribe' : 'সাবস্ক্রাইব'}
            </button>
          </form>
        </div>

        {/* Success toast alert details */}
        {isSubscribed && (
          <div className="fixed bottom-6 left-6 z-50 bg-brand-emerald text-white text-xs px-4 py-3 rounded-lg shadow-lg border border-brand-gold/30">
            {language === 'en' ? 'Thank you for subscribing! We will send you updates.' : 'সাবস্ক্রাইব করার জন্য ধন্যবাদ! আমরা আপনাকে আপডেট পাঠাব।'}
          </div>
        )}

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>{t('copyright')}</p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-brand-gold">{language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}</Link>
            <Link href="#" className="hover:text-brand-gold">{language === 'en' ? 'Terms of Service' : 'সেবার শর্তাবলী'}</Link>
            <Link href="/admin/login" className="text-brand-gold hover:underline">{t('adminPortal')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
