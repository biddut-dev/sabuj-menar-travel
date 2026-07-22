"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface FAQ {
  id: string;
  question: string;
  questionEn: string;
  answer: string;
  answerEn: string;
  category: string;
}

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { language, tExt } = useLanguage();

  const fallbacks: FAQ[] = [
    {
      id: 'q1',
      question: 'সবুজ মিনার ট্রাভেল এজেন্সির সাথে কীভাবে প্যাকেজ বুক করব?',
      questionEn: 'How do I book a package with Sabuj Menar Travel Agency?',
      answer: 'আপনি যেকোনো প্যাকেজের নিচে থাকা "বুক করুন" বা "পরামর্শের জন্য আবেদন" বাটনে ক্লিক করে ফর্মটি পূরণ করুন। আপনার নাম, মোবাইল নম্বর এবং পছন্দসই ভ্রমণের মাস দিয়ে ফর্ম জমা দেওয়ার পর, ২৪ ঘণ্টার মধ্যে আমাদের অভিজ্ঞ হজ্জ ও ওমরাহ পরামর্শক আপনার সাথে যোগাযোগ করবেন এবং পরবর্তী প্রক্রিয়াগুলো বুঝিয়ে দেবেন।',
      answerEn: 'You can request a booking by clicking the "Book Now" or "Book Consultation" button on any package. Fill out your contact details, travel preferences, and preferred month, and one of our dedicated Hajj & Umrah consultants will call you within 24 hours to guide you through the registrations, passport submissions, and payment terms.',
      category: 'General'
    },
    {
      id: 'q2',
      question: 'হজ্জ ও ওমরাহ নিবন্ধনের জন্য কী কী কাগজপত্র প্রয়োজন?',
      questionEn: 'What documents are required for Hajj & Umrah registration?',
      answer: 'নিবন্ধনের জন্য প্রয়োজন: (১) ভ্রমণের তারিখ থেকে কমপক্ষে ৬ মাস মেয়াদী এবং ন্যূনতম ২টি ফাঁকা পৃষ্ঠা সহ মূল পাসপোর্ট। (২) সাদা ব্যাকগ্রাউন্ডে তোলা পাসপোর্ট সাইজের ছবি। (৩) জাতীয় পরিচয়পত্র (NID) অথবা অনলাইন জন্ম সনদের ফটোকপি। (৪) নারী হজযাত্রীদের ক্ষেত্রে মাহরামের সম্পর্ক প্রমাণের প্রয়োজনীয় প্রমাণপত্র।',
      answerEn: 'You will need: (1) An original passport valid for at least 6 months from the travel date with at least 2 blank pages. (2) White background passport-sized photographs. (3) National ID (NID) copy or Birth Certificate copy. (4) Mahram relationship proof for female travelers (where applicable under current Saudi regulations).',
      category: 'Requirements'
    },
    {
      id: 'q3',
      question: 'প্যাকেজের মূল্যের মধ্যে কি বিমান ভাড়া অন্তর্ভুক্ত আছে?',
      questionEn: 'Is international airfare included in the package prices?',
      answer: 'হ্যাঁ, আমাদের প্রতিটি হজ্জ ও ওমরাহ প্যাকেজে (ইকোনমি, স্ট্যান্ডার্ড, প্রিমিয়াম এবং ভিআইপি) ঢাকা থেকে জেদ্দা/মদিনা যাওয়া-আসার বিমান টিকিট (রিটার্ন টিকিট) প্যাকেজ মূল্যের মধ্যেই অন্তর্ভুক্ত রয়েছে। বিশেষ কোনো ব্যতিক্রম থাকলে তা বুকিংয়ের সময় জানিয়ে দেওয়া হবে।',
      answerEn: 'Yes, all of our advertised packages (Economy, Standard, Premium, and VIP) include return economy or business class international flight tickets from Dhaka to Jeddah/Madinah and back. Any exceptions (such as custom land-only packages) will be clearly indicated during the consultation.',
      category: 'Packages'
    },
    {
      id: 'q4',
      question: 'প্যাকেজে কি প্রতিদিনের খাবার অন্তর্ভুক্ত থাকে?',
      questionEn: 'Is daily food included in the packages?',
      answer: 'হ্যাঁ, আমাদের প্রিমিয়াম, ভিআইপি এবং স্ট্যান্ডার্ড প্যাকেজগুলোতে হোটেলের সুস্বাদু বুফে ব্রেকফাস্ট, লাঞ্চ এবং ডিনার (৩ বেলা) অন্তর্ভুক্ত থাকে। ইকোনমি প্যাকেজের ক্ষেত্রে দেশীয় বাবুর্চি দ্বারা প্রস্তুতকৃত পুষ্টিকর খাবার সরবরাহ করা হয়। আপনি চাইলে খাবার ছাড়া প্যাকেজও কাস্টমাইজ করে নিতে পারেন।',
      answerEn: 'Yes, our Premium, VIP, and Standard packages include half-board (breakfast & dinner) or full-board (breakfast, lunch, dinner) buffet meals. For Economy packages, we offer high-quality set lunch/dinner catering services. You can also customize your package to exclude meals if you prefer to dine independently.',
      category: 'Packages'
    },
    {
      id: 'q5',
      question: 'পরিবারের সদস্যরা কি একই হোটেল রুমে একসাথে থাকতে পারবেন?',
      questionEn: 'Can families travel and stay together in the same hotel rooms?',
      answer: 'হ্যাঁ, অবশ্যই! আমরা পারিবারিক ওমরাহ ও হজ্জ পালনের জন্য বিশেষ ডাবল (২ বেড), ট্রিপল (৩ বেড), কোয়াড (৪ বেড) রুম বা পারিবারিক সুইটের ব্যবস্থা করতে পারি। আপনি আবেদন করার সময় আপনার পরিবারের সদস্যদের সংখ্যা ও সম্পর্কের বিবরণ দিয়ে জানালে আমরা সেই অনুযায়ী রুম কাস্টমাইজ করে দেব।',
      answerEn: 'Absolutely! We specialize in custom family room packages. We can arrange Double (2 beds), Triple (3 beds), Quad (4 beds), or interconnected family suites in hotels. Simply let us know the number of travelers and relationship details in your inquiry, and we will tailor the room arrangements accordingly.',
      category: 'General'
    },
    {
      id: 'q6',
      question: 'বিমানে কত কেজি লাগেজ নেওয়া যাবে?',
      questionEn: 'How much luggage is allowed on the flights?',
      answer: 'সাধারণত বিমান বাংলাদেশ বা সৌদিয়া এয়ারলাইন্সের ক্ষেত্রে একজন যাত্রীর জন্য সর্বোচ্চ দুটি চেক-ইন লাগেজ (২৩ কেজি করে মোট ৪৬ কেজি) এবং একটি ৭ কেজির হ্যান্ড লাগেজ অনুমোদিত থাকে। এছাড়া ঢাকা বিমানবন্দরে ফেরার সময় প্রতিটি হাজীকে বিনামূল্যে ৫ লিটারের ১ বোতল জমজমের পানি উপহার দেওয়া হয়। বিমান অনুযায়ী লাগেজের সঠিক নিয়ম বুকিংয়ের সময় নিশ্চিত করা হবে।',
      answerEn: 'Generally, airlines (like Saudia or Biman) allow 2 pieces of checked luggage (up to 23kg each, total 46kg) and 1 piece of hand luggage (up to 7kg). Each pilgrim is also gifted 1 bottle (5 Litres) of ZamZam water at the airport, which is handled separately as airline check-in allowance. We will confirm the exact rules of your airline during booking.',
      category: 'Support'
    }
  ];

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await api.get('/faqs');
        if (response.data && response.data.length > 0) {
          setFaqs(response.data);
        } else {
          setFaqs(fallbacks);
        }
      } catch (err) {
        console.error('Error fetching FAQs, using fallbacks:', err);
        setFaqs(fallbacks);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        const questionText = tExt(faq.question, faq.questionEn);
        const answerText = tExt(faq.answer, faq.answerEn);
        return (
          <div
            key={faq.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-5 text-left font-serif-title font-bold text-sm md:text-base text-brand-emerald hover:text-brand-gold transition-colors focus:outline-none cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-brand-gold flex-shrink-0" />
                <span>{questionText}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-brand-emerald-light transition-transform duration-300 flex-shrink-0 ${
                  isOpen ? 'rotate-180 text-brand-gold' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-5 pt-0 border-t border-gray-50 text-xs md:text-sm text-gray-600 leading-relaxed bg-brand-bg/20">
                    {answerText}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
