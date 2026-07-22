"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface GalleryItem {
  id: string;
  imageUrl: string;
  caption: string;
  captionEn?: string;
  category: string; // KAABA, HARAM, NABAWI, PILGRIMS, TOURS, ORIENTATION, DEPARTURE, CUSTOMERS
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { language } = useLanguage();

  // Fallback items in case API is unavailable or database is empty
  const fallbackItems: GalleryItem[] = [
    {
      id: 'f1',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
      caption: 'পবিত্র মক্কার মসজিদুল হারাম প্রাঙ্গনে পবিত্র কাবা শরিফ',
      captionEn: 'The Holy Kaaba at the center of Masjid Al Haram, Makkah',
      category: 'KAABA'
    },
    {
      id: 'f2',
      imageUrl: '/images/about-medina.png',
      caption: 'পবিত্র মদিনার মসজিদে নববী শরিফ প্রাঙ্গন',
      captionEn: 'Masjid An Nabawi (The Prophet\'s Mosque) in Madinah at sunset',
      category: 'NABAWI'
    },
    {
      id: 'f3',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
      caption: 'মসজিদুল হারামে ইবাদতরত ওমরাহ যাত্রীগণ',
      captionEn: 'Pilgrims circumambulating (Tawaf) around the Kaaba',
      category: 'PILGRIMS'
    },
    {
      id: 'f4',
      imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800',
      caption: 'মদিনায় উহুদ পাহাড় জিয়ারত করার সময় আমাদের গ্রুপ হজযাত্রীগণ',
      captionEn: 'Group tour visiting the historic Mount Uhud in Madinah',
      category: 'TOURS'
    },
    {
      id: 'f5',
      imageUrl: 'https://images.unsplash.com/photo-1580501170961-c4238e8ecfb0?auto=format&fit=crop&q=80&w=800',
      caption: 'আমাদের ঢাকা অফিসে হজযাত্রীদের প্রশিক্ষণ কর্মশালা',
      captionEn: 'Pre-Hajj orientation seminar held at our office for pilgrims',
      category: 'ORIENTATION'
    },
    {
      id: 'f6',
      imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
      caption: 'শাহজালাল আন্তর্জাতিক বিমানবন্দর থেকে হজযাত্রীদের প্রথম কাফেলার বিদায়',
      captionEn: 'Group of pilgrims departing from Hazrat Shahjalal International Airport',
      category: 'DEPARTURE'
    }
  ];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get('/gallery');
        if (response.data && response.data.length > 0) {
          setItems(response.data);
        } else {
          setItems(fallbackItems);
        }
      } catch (err) {
        console.error('Error fetching gallery, using fallbacks:', err);
        setItems(fallbackItems);
      }
    };
    fetchGallery();
  }, []);

  const categories = [
    { name: language === 'en' ? 'All' : 'সব ছবি', value: 'ALL' },
    { name: language === 'en' ? 'Holy Kaaba' : 'কাবা শরিফ', value: 'KAABA' },
    { name: language === 'en' ? 'Nabawi Mosque' : 'মসজিদে নববী', value: 'NABAWI' },
    { name: language === 'en' ? 'Orientation Programs' : 'প্রশিক্ষণ কর্মশালা', value: 'ORIENTATION' },
    { name: language === 'en' ? 'Airport Departure' : 'ফ্লাইট প্রস্থান', value: 'DEPARTURE' },
    { name: language === 'en' ? 'Group Ziyarats' : 'জিয়ারত ও সফর', value: 'TOURS' },
  ];

  const filteredItems = activeFilter === 'ALL'
    ? items
    : items.filter(item => item.category === activeFilter);

  const openLightbox = (id: string) => {
    const index = filteredItems.findIndex(item => item.id === id);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;
    let newIndex = direction === 'prev' ? lightboxIndex - 1 : lightboxIndex + 1;
    
    if (newIndex < 0) {
      newIndex = filteredItems.length - 1;
    } else if (newIndex >= filteredItems.length) {
      newIndex = 0;
    }
    setLightboxIndex(newIndex);
  };

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveFilter(cat.value)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all border cursor-pointer ${
              activeFilter === cat.value
                ? 'bg-brand-emerald text-white border-brand-emerald shadow-md'
                : 'bg-white text-gray-600 border-gray-200 hover:border-brand-emerald/30 hover:text-brand-emerald'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Masonry Layout Grid */}
      <motion.div 
        layout
        className="masonry-grid"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item) => {
            const itemCaption = language === 'en' ? (item.captionEn || item.caption) : item.caption;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                onClick={() => openLightbox(item.id)}
                className="masonry-grid-item relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="relative aspect-auto min-h-[200px] w-full">
                  <img
                    src={item.imageUrl}
                    alt={itemCaption}
                    className="w-full h-auto object-cover group-hover:scale-103 transition-transform duration-500 rounded-xl"
                    loading="lazy"
                  />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <Maximize2 className="w-5 h-5 text-brand-gold absolute top-4 right-4 animate-pulse" />
                  <p className="text-xs font-bold text-brand-gold uppercase tracking-wider">{item.category}</p>
                  <p className="text-xs mt-1 leading-relaxed line-clamp-2">{itemCaption}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 bg-black/95 backdrop-blur-md"
            />

            {/* Content Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-4xl w-full flex flex-col items-center z-10"
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all cursor-pointer"
                aria-label="Close Lightbox"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Photo Box */}
              <div className="relative w-full aspect-[4/3] max-h-[70vh] flex items-center justify-center overflow-hidden rounded-xl border border-white/10">
                <img
                  src={filteredItems[lightboxIndex].imageUrl}
                  alt={language === 'en' ? (filteredItems[lightboxIndex].captionEn || filteredItems[lightboxIndex].caption) : filteredItems[lightboxIndex].caption}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Left/Right Navigation controls */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox('prev');
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-brand-emerald hover:text-white p-3 rounded-full transition-all border border-white/10 cursor-pointer"
                  aria-label="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateLightbox('next');
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-brand-emerald hover:text-white p-3 rounded-full transition-all border border-white/10 cursor-pointer"
                  aria-label="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Caption text */}
              <div className="text-center text-white mt-4 max-w-xl">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
                  {filteredItems[lightboxIndex].category}
                </span>
                <p className="text-sm mt-3 leading-relaxed">
                  {language === 'en' ? (filteredItems[lightboxIndex].captionEn || filteredItems[lightboxIndex].caption) : filteredItems[lightboxIndex].caption}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
