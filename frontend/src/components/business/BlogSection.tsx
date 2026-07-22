"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface BlogPost {
  id: string;
  title: string;
  titleEn: string;
  slug: string;
  summary: string;
  summaryEn: string;
  imageUrl: string;
  category: string;
  author: string;
  createdAt: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const { language, t, tExt } = useLanguage();

  const fallbacks: BlogPost[] = [
    {
      id: 'b1',
      title: 'সহজ ও সঠিক নিয়মে হজ্জ পালনের ধারাবাহিক গাইড',
      titleEn: 'Step-by-Step Guide to Performing Hajj',
      slug: 'step-by-step-guide-to-performing-hajj',
      summary: 'হজ্জ পালনের নিয়মাবলী, ইহরামের বিধান থেকে শুরু করে তাওয়াফে বিদা পর্যন্ত প্রতিটি ধাপের ধারাবাহিক আধ্যাত্মিক ও লজিস্টিক গাইড।',
      summaryEn: 'A comprehensive spiritual and logistical guide to performing Hajj, covering the rituals from Ihram to Tawaf Al-Wada.',
      imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
      category: 'Hajj Guide',
      author: 'Mufti Abdur Rahman',
      createdAt: '2026-07-10T12:00:00Z'
    },
    {
      id: 'b2',
      title: 'ওমরাহ যাত্রীদের প্রয়োজনীয় চেক লিস্ট ও গোছানোর গাইড',
      titleEn: 'Essential Umrah Checklist & Packing Guide',
      slug: 'essential-umrah-checklist-and-packing-guide',
      summary: 'ওমরাহ ভ্রমণের আগে আপনার ব্যাগে কী কী ধর্মীয় ও ব্যক্তিগত জিনিসপত্র নেওয়া প্রয়োজন তার একটি সম্পূর্ণ তালিকা।',
      summaryEn: 'What to pack and how to prepare for your Umrah journey. Make sure you don\'t miss these religious and personal essentials.',
      imageUrl: '/images/about-medina.png',
      category: 'Umrah Checklist',
      author: 'Kamrul Hasan',
      createdAt: '2026-07-15T09:30:00Z'
    },
    {
      id: 'b3',
      title: 'ভ্রমণের পূর্বে ৫টি আধ্যাত্মিক প্রস্তুতিমূলক জরুরি টিপস',
      titleEn: 'Top 5 Spiritual Preparation Tips before Leaving',
      slug: 'top-5-spiritual-preparation-tips-before-leaving',
      summary: 'হজ্জ ও ওমরাহর প্রস্তুতি শুধু পাসপোর্ট বা ব্যাগ গোছানোর মধ্যে সীমাবদ্ধ নয়। অন্তরের আধ্যাত্মিক প্রস্তুতি হজ্জ কবুল হওয়ার জন্য অত্যন্ত গুরুত্বপূর্ণ।',
      summaryEn: 'Preparing for Hajj and Umrah is not just about passports and bags. The spiritual preparation of the heart is what makes it accepted.',
      imageUrl: '/images/about-hajj.png',
      category: 'Religious Preparation',
      author: 'Mufti Abdur Rahman',
      createdAt: '2026-07-18T15:45:00Z'
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs?isPublished=true');
        if (response.data && response.data.length > 0) {
          setBlogs(response.data.slice(0, 3));
        } else {
          setBlogs(fallbacks);
        }
      } catch (err) {
        console.error('Error fetching blogs, using fallbacks:', err);
        setBlogs(fallbacks);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => {
        const formattedDate = new Date(blog.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        const blogCategory = language === 'en'
          ? blog.category
          : (blog.category === 'Hajj Guide' ? 'হজ্জ গাইড' : blog.category === 'Umrah Checklist' ? 'ওমরাহ সহায়িকা' : 'ধর্মীয় প্রস্তুতি');

        return (
          <article 
            key={blog.id} 
            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
          >
            {/* Blog Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
              <img
                src={blog.imageUrl}
                alt={tExt(blog.title, blog.titleEn)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 bg-brand-gold text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 shadow-sm">
                {blogCategory}
              </span>
            </div>

            {/* Content body */}
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                {/* Meta details */}
                <div className="flex items-center gap-4 text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-3">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-brand-emerald" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-emerald" />
                    {formattedDate}
                  </span>
                </div>

                <h4 className="font-serif-title font-bold text-base md:text-lg text-brand-emerald leading-snug group-hover:text-brand-gold transition-colors line-clamp-2 min-h-[50px]">
                  {tExt(blog.title, blog.titleEn)}
                </h4>

                <p className="text-xs md:text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                  {tExt(blog.summary, blog.summaryEn)}
                </p>
              </div>

              {/* Read button */}
              <div className="mt-6 pt-4 border-t border-gray-50">
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-emerald hover:text-brand-gold transition-colors uppercase tracking-widest"
                >
                  {t('readPost')}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
