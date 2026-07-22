"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone, Mail, Clock, MessageSquare, ShieldCheck, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface NavbarProps {
  settings?: {
    phone1?: string;
    whatsappNumber?: string;
    emailAddress?: string;
    officeAddress?: string;
    officeAddressEn?: string;
    businessHours?: string;
    businessHoursEn?: string;
  };
}

export default function Navbar({ settings }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();

  const phone = settings?.phone1 || "+880 1711 123456";
  const email = settings?.emailAddress || "info@sabujmenar.com";
  
  const businessHours = language === 'en'
    ? (settings?.businessHoursEn || "Sat - Thu: 9:00 AM - 8:00 PM")
    : (settings?.businessHours || "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০");

  const regText = language === 'en'
    ? "Approved by Ministry of Religious Affairs (Hajj License No. 0816)"
    : "ধর্ম বিষয়ক মন্ত্রণালয় অনুমোদিত (হজ্জ লাইসেন্স নং ০৮১৬)";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), href: '/' },
    { name: t('aboutTitle'), href: '#about' },
    { name: t('filterHajj'), href: '#hajj-packages' },
    { name: t('filterUmrah'), href: '#umrah-packages' },
    { name: t('services'), href: '#services' },
    { name: t('gallery'), href: '#gallery' },
    { name: t('faqs'), href: '#faq' },
    { name: t('blogs'), href: '#blog' },
    { name: t('contact'), href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      setIsOpen(false);
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 120; // accounting for sticky nav
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <>
      {/* Top Utility Banner */}
      <div className="bg-brand-dark text-white text-xs py-2 border-b border-brand-gold/20 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-1.5 text-gray-300">
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              {phone}
            </span>
            <span className="flex items-center gap-1.5 text-gray-300">
              <Mail className="w-3.5 h-3.5 text-brand-gold" />
              {email}
            </span>
            <span className="flex items-center gap-1.5 text-brand-gold font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              {regText}
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-gold" />
              {businessHours}
            </span>
            <Link 
              href={`/admin/login`} 
              className="text-brand-gold hover:text-white transition-colors border-l border-gray-700 pl-4 font-semibold"
            >
              {t('adminPortal')}
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-brand-gold/10'
            : 'bg-white py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo and Brand */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-brand-gold/30 p-0.5 bg-white shadow-sm flex-shrink-0">
                <Image
                  src="/logo.jpg"
                  alt="Sabuj Menar Logo"
                  fill
                  className="object-cover rounded-full group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <h1 className="font-serif-title font-bold text-base md:text-lg text-brand-emerald tracking-wide leading-tight group-hover:text-brand-emerald-light transition-colors">
                  {language === 'en' ? 'SABUJ MENAR' : 'সবুজ মিনার'}
                </h1>
                <p className="text-[9px] md:text-[10px] uppercase font-semibold text-brand-gold tracking-widest leading-none">
                  {language === 'en' ? 'Travel Agency' : 'ট্রাভেল এজেন্সি'}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-5">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-xs xl:text-sm font-semibold transition-colors duration-200 hover:text-brand-emerald relative py-1 ${
                    pathname === link.href || (pathname === '/' && link.href === '/')
                      ? 'text-brand-emerald'
                      : 'text-brand-dark/80'
                  }`}
                >
                  {link.name}
                  {link.href.startsWith('#') && (
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-300 hover:w-full"></span>
                  )}
                </a>
              ))}
            </div>

            {/* Actions: Language Toggle & CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Language Switcher Pill */}
              <button
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-brand-emerald/20 bg-brand-emerald/5 hover:bg-brand-emerald/10 text-brand-emerald text-xs font-bold transition-all cursor-pointer"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-brand-emerald/70" />
                <span className={language === 'bn' ? 'text-brand-emerald font-extrabold' : 'text-gray-400 font-normal'}>বাংলা</span>
                <span className="text-gray-300">|</span>
                <span className={language === 'en' ? 'text-brand-emerald font-extrabold' : 'text-gray-400 font-normal'}>EN</span>
              </button>

              <a
                href="#contact"
                onClick={(e) => handleLinkClick(e, '#contact')}
                className="bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 shadow-md gold-glow hover:scale-102 flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4 text-brand-gold-light" />
                {t('bookConsultation')}
              </a>
            </div>

            {/* Mobile Menu Button & Mobile Language Toggle */}
            <div className="lg:hidden flex items-center space-x-2">
              {/* Mobile Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-brand-emerald/20 bg-brand-emerald/5 text-brand-emerald text-xs font-bold"
                aria-label="Toggle language"
              >
                {language === 'bn' ? 'EN' : 'বাংলা'}
              </button>

              <Link 
                href={`/admin/login`} 
                className="text-[10px] text-brand-gold font-bold bg-brand-dark px-2.5 py-1.5 rounded-full border border-brand-gold/30"
              >
                Admin
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-brand-dark hover:text-brand-emerald p-2 rounded-md focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-brand-gold/10 overflow-hidden shadow-inner"
            >
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className="block px-4 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-emerald/5 hover:text-brand-emerald rounded-lg transition-all"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                  <div className="px-4 text-xs text-gray-500 space-y-1">
                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-brand-emerald" /> {phone}</p>
                    <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-brand-emerald" /> {email}</p>
                  </div>
                  <a
                    href="#contact"
                    onClick={(e) => handleLinkClick(e, '#contact')}
                    className="bg-brand-emerald hover:bg-brand-emerald-dark text-white text-center font-bold py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageSquare className="w-4 h-4 text-brand-gold" />
                    {t('bookConsultation')}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
