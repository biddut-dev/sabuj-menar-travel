"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Calendar, User, ArrowLeft, BookOpen } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ScrollToTop from '@/components/layout/ScrollToTop';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface BlogPost {
  title: string;
  titleEn: string;
  summary: string;
  summaryEn: string;
  content: string;
  contentEn: string;
  imageUrl: string;
  category: string;
  author: string;
  createdAt: string;
}

export default function BlogDetails() {
  const params = useParams();
  const slug = params.slug as string;
  const { language, t, tExt } = useLanguage();

  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);

  useEffect(() => {
    if (!slug) return;

    const loadBlog = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/blogs/slug/${slug}`);
        setBlog(response.data);
        
        const recentResponse = await api.get('/blogs?isPublished=true');
        if (recentResponse.data) {
          setRecentBlogs(recentResponse.data.filter((b: any) => b.slug !== slug).slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex-grow flex items-center justify-center min-h-[50vh] bg-brand-bg">
          <div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center min-h-[50vh] bg-brand-bg text-center space-y-4">
          <h3 className="font-serif-title font-bold text-2xl text-brand-emerald">
            {language === 'en' ? 'Article Not Found' : 'আর্টিকেলটি পাওয়া যায়নি'}
          </h3>
          <p className="text-gray-500 text-sm">
            {language === 'en' 
              ? 'The article you are searching for might have been removed or updated.' 
              : 'আপনি যে নিবন্ধটি খুঁজছেন তা মুছে ফেলা হয়েছে বা আপডেট করা হয়েছে।'}
          </p>
          <Link href="/" className="bg-brand-emerald text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-md">
            {t('backToHome')}
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const blogCategory = language === 'en'
    ? blog.category
    : (blog.category === 'Hajj Guide' ? 'হজ্জ গাইড' : blog.category === 'Umrah Checklist' ? 'ওমরাহ সহায়িকা' : 'ধর্মীয় প্রস্তুতি');

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-brand-bg py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs font-extrabold text-brand-emerald hover:text-brand-gold transition-colors uppercase tracking-widest mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Main content body */}
            <article className="lg:col-span-8 bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 space-y-6">
              <span className="bg-brand-gold text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 shadow-sm inline-block">
                {blogCategory}
              </span>

              <h2 className="font-serif-title font-bold text-2xl sm:text-3xl md:text-4xl text-brand-emerald leading-tight">
                {tExt(blog.title, blog.titleEn)}
              </h2>

              <div className="flex items-center gap-4 text-gray-500 text-xs border-b border-gray-100 pb-4">
                <span className="flex items-center gap-1.5 font-semibold">
                  <User className="w-4 h-4 text-brand-emerald" />
                  {blog.author}
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Calendar className="w-4 h-4 text-brand-emerald" />
                  {formattedDate}
                </span>
              </div>

              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-gray-100 shadow">
                <img
                  src={blog.imageUrl}
                  alt={tExt(blog.title, blog.titleEn)}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-xs md:text-sm font-medium text-gray-700 leading-relaxed bg-brand-bg/40 p-4 rounded-xl border-l-4 border-brand-gold">
                {tExt(blog.summary, blog.summaryEn)}
              </p>

              <div 
                className="text-xs md:text-sm text-gray-700 leading-relaxed space-y-4 pt-2 prose prose-emerald max-w-none"
                dangerouslySetInnerHTML={{ __html: tExt(blog.content, blog.contentEn) }}
              />
            </article>

            {/* Sidebar details */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="bg-brand-dark text-white rounded-2xl p-6 border border-brand-gold/30 shadow-md relative overflow-hidden text-center space-y-4">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none islamic-pattern"></div>
                <BookOpen className="w-10 h-10 text-brand-gold mx-auto animate-pulse" />
                <h4 className="font-serif-title font-bold text-sm text-white">
                  {language === 'en' ? 'Need Pilgrimage Assistance?' : 'পবিত্র সফরে সাহায্য প্রয়োজন?'}
                </h4>
                <p className="text-[10px] text-gray-300 leading-relaxed">
                  {language === 'en'
                    ? 'Have questions about Hajj requirements or visa document submissions? Talk to our travel consultants today.'
                    : 'হজ্জের যোগ্যতা বা ভিসার প্রয়োজনীয় কাগজপত্র জমা নিয়ে কোনো প্রশ্ন আছে? আজই আমাদের হজ্জ ও ওমরাহ পরামর্শকদের সাথে কথা বলুন।'}
                </p>
                <Link
                  href="/#contact"
                  className="block bg-brand-emerald hover:bg-brand-emerald-dark text-white text-xs font-bold py-2.5 rounded-lg transition-all"
                >
                  {t('contact')}
                </Link>
              </div>

              {recentBlogs.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md space-y-6">
                  <h4 className="font-serif-title font-bold text-xs text-brand-emerald uppercase tracking-wider border-b border-gray-100 pb-3">
                    {language === 'en' ? 'Other Useful Guides' : 'অন্যান্য প্রয়োজনীয় সহায়িকা'}
                  </h4>
                  <div className="space-y-4">
                    {recentBlogs.map((b) => {
                      const recentCategory = language === 'en'
                        ? b.category
                        : (b.category === 'Hajj Guide' ? 'হজ্জ গাইড' : b.category === 'Umrah Checklist' ? 'ওমরাহ সহায়িকা' : 'ধর্মীয় প্রস্তুতি');

                      return (
                        <Link 
                          href={`/blogs/${b.slug}`}
                          key={b.id} 
                          className="flex gap-3 group items-center"
                        >
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={b.imageUrl}
                              alt={tExt(b.title, b.titleEn)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[9px] uppercase font-bold text-brand-gold tracking-wide">{recentCategory}</span>
                            <h5 className="font-bold text-xs text-brand-emerald group-hover:text-brand-gold transition-colors line-clamp-2 leading-tight">
                              {tExt(b.title, b.titleEn)}
                            </h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
      <WhatsAppButton />
      <ScrollToTop />
      <Footer />
    </>
  );
}
