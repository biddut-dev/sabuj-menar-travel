"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  PhoneCall, 
  HelpCircle, 
  Award, 
  Clipboard, 
  FileText, 
  Users, 
  BookOpen, 
  Plane, 
  ShieldCheck, 
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Step {
  number: number;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  icon: React.ComponentType<any>;
}

export default function Timeline() {
  const { language } = useLanguage();
  
  const steps: Step[] = [
    {
      number: 1,
      titleBn: 'যোগাযোগ করুন',
      titleEn: 'Contact Us',
      descriptionBn: 'হোয়াটসঅ্যাপ, ফোন বা যোগাযোগ ফর্মের মাধ্যমে আমাদের সাথে যুক্ত হন।',
      descriptionEn: 'Reach out via WhatsApp, phone, or message form.',
      icon: PhoneCall
    },
    {
      number: 2,
      titleBn: 'বিনামূল্যে পরামর্শ',
      titleEn: 'Free Consultation',
      descriptionBn: 'ভ্রমণের সময়সূচী, যোগ্যতা, বাজেট ও প্রয়োজনীয় লজিস্টিকস নিয়ে আলোচনা।',
      descriptionEn: 'Discuss schedules, requirements, budgets, and needs.',
      icon: HelpCircle
    },
    {
      number: 3,
      titleBn: 'প্যাকেজ নির্বাচন',
      titleEn: 'Package Selection',
      descriptionBn: 'আপনার সাধ্য ও সুবিধা অনুযায়ী সেরা প্যাকেজটি (ইকোনমি থেকে ভিআইপি) বেছে নিন।',
      descriptionEn: 'Choose your preferred package level (Economy to VIP).',
      icon: Award
    },
    {
      number: 4,
      titleBn: 'নিবন্ধন',
      titleEn: 'Registration',
      descriptionBn: 'সরকারি হজ্জ পোর্টাল ও আমাদের সিস্টেমে আপনার ওমরাহ/হজ্জ স্লট বুক করুন।',
      descriptionEn: 'Book your slot in the government Hajj portal/our system.',
      icon: Clipboard
    },
    {
      number: 5,
      titleBn: 'কাগজপত্র জমা',
      titleEn: 'Document Submission',
      descriptionBn: 'পাসপোর্ট, জাতীয় পরিচয়পত্র (NID), ছবি এবং ভ্যাকসিন কার্ড জমা দিন।',
      descriptionEn: 'Provide passport, NID, photographs, and certificates.',
      icon: FileText
    },
    {
      number: 6,
      titleBn: 'প্রশিক্ষণ কর্মশালা',
      titleEn: 'Orientation Session',
      descriptionBn: 'ঢাকা অফিসে হজ্জের নিয়মাবলী, স্বাস্থ্য ও নিরাপত্তা নির্দেশিকার ওপর বিশেষ ট্রেইনিং।',
      descriptionEn: 'Attend pre-departure seminars on Hajj guides & health rules.',
      icon: Users
    },
    {
      number: 7,
      titleBn: 'ভিসা ও ফ্লাইটের প্রস্তুতি',
      titleEn: 'Visa & Travel Prep',
      descriptionBn: 'আমরা দ্রুত ই-ভিসা ইস্যু করি এবং সরাসরি ফ্লাইটের টিকিট বুকিং সম্পন্ন করি।',
      descriptionEn: 'We process your electronic Hajj/Umrah visa and flights.',
      icon: BookOpen
    },
    {
      number: 8,
      titleBn: 'পবিত্র যাত্রা',
      titleEn: 'Departure',
      descriptionBn: 'শাহজালাল বিমানবন্দরে আমাদের মোয়াল্লেমদের সাথে একত্রিত হয়ে সৌদির উদ্দেশ্যে রওনা।',
      descriptionEn: 'Gather at airport with our guides and fly to KSA.',
      icon: Plane
    },
    {
      number: 9,
      titleBn: 'ইবাদত ও মোয়াল্লেম সাপোর্ট',
      titleEn: 'Journey Completion',
      descriptionBn: 'ইসলামী স্কলারদের দিকনির্দেশনায় নিখুঁতভাবে হজ্জ ও ওমরাহর প্রতিটি রুকন পালন।',
      descriptionEn: 'Perform all spiritual rites with step-by-step scholar guidance.',
      icon: ShieldCheck
    },
    {
      number: 10,
      titleBn: 'নিরাপদ প্রত্যাবর্তন',
      titleEn: 'Safe Return Home',
      descriptionBn: 'জমজমের পানি এবং আজীবনের আধ্যাত্মিক স্মৃতি নিয়ে ঢাকায় নিরাপদ প্রত্যাবর্তন।',
      descriptionEn: 'Fly back to Dhaka with ZamZam water and spiritual memories.',
      icon: Home
    }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - 300 
        : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 hidden md:block">
        <button
          onClick={() => scroll('left')}
          className="p-3 bg-white hover:bg-brand-emerald hover:text-white rounded-full shadow-lg border border-brand-gold/25 transition-all text-brand-emerald cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 hidden md:block">
        <button
          onClick={() => scroll('right')}
          className="p-3 bg-white hover:bg-brand-emerald hover:text-white rounded-full shadow-lg border border-brand-gold/25 transition-all text-brand-emerald cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Horizontal Scrolling Timeline container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide snap-x snap-mandatory px-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex-shrink-0 w-[280px] bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 relative snap-align-start group border-t-4 border-t-brand-emerald/80"
            >
              {/* Connector line (desktop) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[44px] left-[70px] w-[270px] h-[2px] bg-brand-gold/20 -z-10 group-hover:bg-brand-gold/50 transition-colors" />
              )}

              {/* Header: Circle & Icon */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-xl bg-brand-bg border border-brand-emerald/10 flex items-center justify-center text-brand-emerald group-hover:bg-brand-emerald group-hover:text-white transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-serif-title font-bold text-3xl text-brand-gold/20 group-hover:text-brand-gold/40 transition-colors">
                  {String(step.number).padStart(2, '0')}
                </span>
              </div>

              {/* Content */}
              <h4 className="font-serif-title font-bold text-base text-brand-emerald mb-2">
                {language === 'en' ? step.titleEn : step.titleBn}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed min-h-[48px]">
                {language === 'en' ? step.descriptionEn : step.descriptionBn}
              </p>

              {/* Mini Badge */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[9px] text-gray-400 font-extrabold uppercase tracking-widest">
                <span>{language === 'en' ? `Step ${step.number}` : `ধাপ ${step.number}`}</span>
                <span className="text-brand-gold">{language === 'en' ? 'Verified' : 'যাচাইকৃত'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Mobile Indicator */}
      <div className="text-center text-[10px] text-gray-400 md:hidden mt-2 font-semibold uppercase tracking-wider">
        {language === 'en' ? '← Swipe left/right to view Hajj steps →' : '← ধাপগুলো দেখতে ডানে/বামে সুইপ করুন →'}
      </div>
    </div>
  );
}
