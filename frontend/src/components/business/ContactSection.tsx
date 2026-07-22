"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface ContactSectionProps {
  settings?: {
    officeAddress?: string;
    officeAddressEn?: string;
    phone1?: string;
    phone2?: string;
    emailAddress?: string;
    businessHours?: string;
    businessHoursEn?: string;
    googleMapEmbedUrl?: string;
  };
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const { language, t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    packageInterest: 'General Inquiry',
    preferredMonth: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const address = language === 'en'
    ? (settings?.officeAddressEn || "Room No. 402, 4th Floor, Paltan Tower, Purana Paltan, Dhaka-1000, Bangladesh")
    : (settings?.officeAddress || "রুম নং ৪০২, ৪র্থ তলা, পল্টন টাওয়ার, পুরানা পল্টন, ঢাকা-১০০০, বাংলাদেশ");

  const phone1 = settings?.phone1 || "+880 1711 123456";
  const phone2 = settings?.phone2 || "+880 1819 654321";
  const email = settings?.emailAddress || "info@sabujmenar.com";

  const hours = language === 'en'
    ? (settings?.businessHoursEn || "Saturday - Thursday: 9:00 AM - 8:00 PM (Friday Closed)")
    : (settings?.businessHours || "শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০ (শুক্রবার বন্ধ)");

  const mapUrl = settings?.googleMapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.3701358988673!2d90.4101897!3d23.7341738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85ee4b0c169%3A0xe9c869fb7a3c3065!2sPurana%20Paltan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/messages', formData);
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        packageInterest: 'General Inquiry',
        preferredMonth: '',
        message: ''
      });
      setTimeout(() => setSuccess(false), 8000);
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        (language === 'en' 
          ? 'Failed to send message. Please try again.' 
          : 'বার্তা পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।')
      );
    } finally {
      setLoading(false);
    }
  };

  const months = language === 'en'
    ? ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhul-Qadah', 'Dhul-Hijjah']
    : ['মহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউল সানি', 'জমাদিউল আউয়াল', 'জমাদিউল সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ্জ'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
      {/* Contact Details & Map */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
        <div className="space-y-6">
          <h4 className="font-serif-title font-bold text-lg text-brand-emerald border-b border-brand-gold/30 pb-2.5">
            {language === 'en' ? 'Our Headquarters' : 'আমাদের প্রধান কার্যালয়'}
          </h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {language === 'en'
              ? 'Please visit our office for face-to-face package bookings, visa processing documents drop-off, or pre-departure orientation briefing.'
              : 'সরাসরি প্যাকেজ বুকিং, ভিসার পাসপোর্ট জমা দেওয়া অথবা প্রাক-হজ্জ প্রশিক্ষণ সংক্রান্ত আলোচনার জন্য আমাদের অফিসে স্বাগত।'}
          </p>

          <ul className="space-y-4 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <div>
                <p>{phone1}</p>
                {phone2 && <p>{phone2}</p>}
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span>{email}</span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-brand-gold mt-0.5 flex-shrink-0" />
              <span>{hours}</span>
            </li>
          </ul>
        </div>

        {/* Map Embed Card */}
        <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 aspect-video w-full h-[220px] relative">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sabuj Menar Travel Agency Office Map"
          ></iframe>
        </div>
      </div>

      {/* Contact Inquiry Form */}
      <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100 flex flex-col justify-center">
        <h4 className="font-serif-title font-bold text-xl text-brand-emerald mb-6">
          {language === 'en' ? 'Send Us a Message' : 'আমাদের সরাসরি লিখুন'}
        </h4>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 space-y-3"
          >
            <CheckCircle className="w-12 h-12 text-brand-emerald mx-auto" />
            <h5 className="font-serif-title font-bold text-lg text-brand-emerald">
              {language === 'en' ? 'Message Sent Successfully!' : 'বার্তাটি সফলভাবে পাঠানো হয়েছে!'}
            </h5>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              {language === 'en'
                ? 'Thank you. We have received your inquiry message. Our sales representatives will reach out to you shortly.'
                : 'ধন্যবাদ। আমরা আপনার বার্তাটি পেয়েছি। আমাদের একজন প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'}
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-200 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t('fullName')} *</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder={language === 'en' ? 'e.g. Haji Rahman' : 'যেমন: হাজী মোস্তাফিজুর রহমান'}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                />
              </div>
              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t('phone')} *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder={language === 'en' ? 'e.g. +880 1711 123456' : 'যেমন: ০১৭১১ ১২৩৪৫৬'}
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t('email')} *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                />
              </div>

              {/* Package Interest */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t('packageInterest')}</label>
                <select
                  name="packageInterest"
                  value={formData.packageInterest}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all bg-white"
                >
                  <option value="General Inquiry">{language === 'en' ? 'General Inquiry' : 'সাধারণ জিজ্ঞাসা'}</option>
                  <option value="Hajj VIP Package">{language === 'en' ? 'Hajj VIP Package' : 'হজ্জ ভিআইপি প্যাকেজ'}</option>
                  <option value="Hajj Standard Package">{language === 'en' ? 'Hajj Standard Package' : 'হজ্জ স্ট্যান্ডার্ড প্যাকেজ'}</option>
                  <option value="Hajj Economy Package">{language === 'en' ? 'Hajj Economy Package' : 'হজ্জ ইকোনমি প্যাকেজ'}</option>
                  <option value="Umrah Executive Package">{language === 'en' ? 'Umrah Executive Package' : 'ওমরাহ এক্সিকিউটিভ প্যাকেজ'}</option>
                  <option value="Umrah Premium Package">{language === 'en' ? 'Umrah Premium Package' : 'ওমরাহ প্রিমিয়াম প্যাকেজ'}</option>
                  <option value="Umrah Economy Package">{language === 'en' ? 'Umrah Economy Package' : 'ওমরাহ ইকোনমি প্যাকেজ'}</option>
                  <option value="Ziyarat Tours">{language === 'en' ? 'Ziyarat Tours' : 'জিয়ারত ও সফর'}</option>
                </select>
              </div>
            </div>

            {/* Travel Month */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t('preferredMonth')}</label>
              <select
                name="preferredMonth"
                value={formData.preferredMonth}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all bg-white"
              >
                <option value="">{language === 'en' ? 'Choose Month (Optional)' : 'মাস নির্বাচন করুন (ঐচ্ছিক)'}</option>
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Message Body */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-700">{t('message')} *</label>
              <textarea
                name="message"
                required
                rows={3}
                placeholder={language === 'en' ? 'How can we assist you?' : 'আমরা আপনাকে কীভাবে সহযোগিতা করতে পারি?'}
                value={formData.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold py-2.5 rounded-lg text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="w-4 h-4 text-brand-gold-light" />
                  <span>{t('send')}</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
