"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface Testimonial {
  id: string;
  name: string;
  nameEn?: string | null;
  city: string;
  cityEn?: string | null;
  rating: number;
  review: string;
  reviewEn?: string | null;
  imageUrl?: string | null;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { language, tExt } = useLanguage();

  const fallbacks: Testimonial[] = [
    {
      id: 't1',
      name: 'হাজী মোহাম্মদ রহমান',
      nameEn: 'Haji Mohammad Rahman',
      city: 'ঢাকা',
      cityEn: 'Dhaka',
      rating: 5,
      review: 'সবুজ মিনার ট্রাভেল এজেন্সির সাথে হজ্জ পালন করা আমার জীবনের সেরা সিদ্ধান্ত ছিল। তাদের গাইড ও শিক্ষাবিদদের গাইডেন্স অসাধারণ ছিল। মক্কা ও মদিনার hotel গুলো প্রতিশ্রুতি অনুযায়ী হারামের খুব কাছে পেয়েছি। আল্লাহ তাদের উত্তম প্রতিদান দিন।',
      reviewEn: 'Performing Hajj with Sabuj Menar Travel Agency was an incredibly smooth experience. Their guides were extremely knowledgeable, helping us with every ritual. The hotels in Makkah and Madinah were exactly as promised, very close to the Haramain. May Allah reward them.'
    },
    {
      id: 't2',
      name: 'ডা. নুসরাত জাহান',
      nameEn: 'Dr. Nusrat Jahan',
      city: 'চট্টগ্রাম',
      cityEn: 'Chittagong',
      rating: 5,
      review: 'আমরা ১৪ দিনের ফ্যামিলি ওমরাহ প্যাকেজ নিয়েছিলাম। বৃদ্ধ মা-বাবা এবং ছোট সন্তানদের নিয়ে যাত্রা কিছুটা চিন্তার ছিল, কিন্তু সবুজ মিনারের টিম অসাধারণ সহযোগিতা করেছে। তাদের প্রাইভেট গাড়ি বেশ আরামদায়ক ছিল। পরিবারের সাথে ওমরাহর জন্য অত্যন্ত রেকমেন্ডেড।',
      reviewEn: 'We took the 14-days Family Umrah package. Traveling with elderly parents and children is stressful, but Sabuj Menar took care of everything. The private transport was comfortable, and the hotel staff was cooperative. Highly recommended for families.'
    },
    {
      id: 't3',
      name: 'আহমেদ রফিক',
      nameEn: 'Ahmed Rafiq',
      city: 'সিলেট',
      cityEn: 'Sylhet',
      rating: 5,
      review: 'সবুজ মিনারের সততা ও স্বচ্ছতা আমাকে সবচেয়ে বেশি মুগ্ধ করেছে। কোনো ধরণের লুকানো ফি ছিল না। যা প্যাকেজে উল্লেখ ছিল ঠিক তাই পেয়েছি। ফ্লাইটের আগে ঢাকা অফিসে তাদের আয়োজন করা হজ্জ কর্মশালা আমাদের আধ্যাত্মিকভাবে খুব সাহায্য করেছে।',
      reviewEn: 'Transparency and honesty are what stand out about Sabuj Menar. There were no hidden fees. Whatever was mentioned in the package was delivered. The pre-departure orientation in Dhaka was very helpful in preparing us spiritually.'
    }
  ];

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get('/testimonials');
        if (response.data && response.data.length > 0) {
          setTestimonials(response.data);
        } else {
          setTestimonials(fallbacks);
        }
      } catch (err) {
        console.error('Error fetching testimonials, using fallbacks:', err);
        setTestimonials(fallbacks);
      }
    };
    fetchReviews();
  }, []);

  // Auto scroll effect
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [activeIndex, testimonials]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (testimonials.length === 0) return null;

  const current = testimonials[activeIndex];
  const currentName = tExt(current.name, current.nameEn);
  const currentCity = tExt(current.city, current.cityEn);
  const currentReview = tExt(current.review, current.reviewEn);

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-8">
      {/* Decorative quotes */}
      <Quote className="absolute -top-6 -left-4 w-20 h-20 text-brand-emerald/5 rotate-180 pointer-events-none" />
      <Quote className="absolute -bottom-6 -right-4 w-20 h-20 text-brand-emerald/5 pointer-events-none" />

      {/* Slider View Box */}
      <div className="relative overflow-hidden min-h-[260px] md:min-h-[220px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="text-center px-6 md:px-12 flex flex-col items-center"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < current.rating ? 'text-brand-gold fill-brand-gold' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Review text */}
            <p className="text-sm md:text-base text-gray-700 italic leading-relaxed max-w-2xl">
              "{currentReview}"
            </p>

            {/* Avatar & Pilgrim metadata */}
            <div className="mt-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-emerald/10 border-2 border-brand-gold flex items-center justify-center font-serif-title font-bold text-brand-emerald text-sm uppercase">
                {currentName.split(' ').filter(n => n.length > 0).slice(0, 2).map(n => n[0]).join('')}
              </div>
              <div className="text-left">
                <h5 className="font-serif-title font-bold text-sm text-brand-emerald">{currentName}</h5>
                <p className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">{currentCity}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center items-center gap-5 mt-6 relative z-10">
        <button
          onClick={handlePrev}
          className="bg-white hover:bg-brand-emerald hover:text-white text-brand-emerald p-2 rounded-full border border-brand-gold/20 shadow-md transition-all cursor-pointer"
          aria-label="Previous Review"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Indicators Dots */}
        <div className="flex gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                index === activeIndex ? 'bg-brand-emerald w-4' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="bg-white hover:bg-brand-emerald hover:text-white text-brand-emerald p-2 rounded-full border border-brand-gold/20 shadow-md transition-all cursor-pointer"
          aria-label="Next Review"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
