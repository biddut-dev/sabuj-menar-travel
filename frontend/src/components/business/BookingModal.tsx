"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Phone, Mail, Users, FileText, CheckCircle, MapPin, Globe } from 'lucide-react';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

interface Package {
  id: string;
  title: string;
  titleEn: string;
  price: number;
  type: 'HAJJ' | 'UMRAH';
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage?: Package | null;
}

export default function BookingModal({ isOpen, onClose, selectedPackage }: BookingModalProps) {
  const { language, t, tExt } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    passportNumber: '',
    nationality: '',
    numTravelers: 1,
    packageType: 'UMRAH',
    preferredMonth: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      nationality: language === 'en' ? 'Bangladeshi' : 'বাংলাদেশী',
    }));
  }, [language]);

  useEffect(() => {
    if (selectedPackage) {
      setFormData(prev => ({
        ...prev,
        packageType: selectedPackage.type,
      }));
    }
  }, [selectedPackage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        packageId: selectedPackage ? selectedPackage.id : undefined,
        numTravelers: parseInt(formData.numTravelers.toString())
      };

      await api.post('/bookings', payload);
      setSuccess(true);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        passportNumber: '',
        nationality: language === 'en' ? 'Bangladeshi' : 'বাংলাদেশী',
        numTravelers: 1,
        packageType: selectedPackage ? selectedPackage.type : 'UMRAH',
        preferredMonth: '',
        notes: '',
      });
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        (language === 'en' 
          ? 'Something went wrong. Please check your details.' 
          : 'কোনো সমস্যা হয়েছে। অনুগ্রহ করে আপনার তথ্য চেক করুন।')
      );
    } finally {
      setLoading(false);
    }
  };

  const months = language === 'en'
    ? ['Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani', 'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhul-Qadah', 'Dhul-Hijjah']
    : ['মহররম', 'সফর', 'রবিউল আউয়াল', 'রবিউল সানি', 'জমাদিউল আউয়াল', 'জমাদিউল সানি', 'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ্জ'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-brand-gold/30 z-10 max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="bg-brand-emerald text-white p-6 relative flex-shrink-0">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none islamic-pattern"></div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="font-serif-title font-bold text-xl tracking-wide">
                {selectedPackage 
                  ? (language === 'en' ? 'Request Package Booking' : 'প্যাকেজ বুকিংয়ের আবেদন') 
                  : (language === 'en' ? 'Book a Consultation' : 'বিনামূল্যে পরামর্শের আবেদন')}
              </h3>
              <p className="text-white/80 text-xs mt-1">
                {selectedPackage 
                  ? (language === 'en'
                      ? `Selected: ${selectedPackage.titleEn || selectedPackage.title} (Est. Price: ৳${selectedPackage.price.toLocaleString()})`
                      : `নির্বাচিত প্যাকেজ: ${selectedPackage.title} (আনুমানিক মূল্য: ৳${selectedPackage.price.toLocaleString()})`)
                  : (language === 'en'
                      ? 'Let our Hajj & Umrah experts guide you through the journey.'
                      : 'আমাদের হজ্জ ও ওমরাহ বিশেষজ্ঞদের সাথে আলোচনা করে আপনার পবিত্র যাত্রা শুরু করুন।')}
              </p>
            </div>

            {/* Scrollable Form */}
            <div className="p-6 overflow-y-auto flex-grow">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center space-y-4"
                >
                  <CheckCircle className="w-16 h-16 text-brand-emerald mx-auto animate-pulse" />
                  <h4 className="font-serif-title text-brand-emerald font-bold text-xl">
                    {language === 'en' ? 'Inquiry Submitted Successfully' : 'অনুরোধটি সফলভাবে জমা দেওয়া হয়েছে'}
                  </h4>
                  <p className="text-sm text-gray-600 max-w-md mx-auto">
                    {language === 'en'
                      ? 'Jazakallah Khair. We have received your booking inquiry request. One of our dedicated Hajj & Umrah consultants will contact you within 24 hours to clarify terms, confirm documentation, and help you finalize your pilgrimage plans.'
                      : 'জাজাকাল্লাহ খাইরান। আমরা আপনার বুকিংয়ের আবেদনটি পেয়েছি। আপনার পবিত্র যাত্রার পরিকল্পনা নিশ্চিত করতে আমাদের একজন হজ্জ ও ওমরাহ পরামর্শক আগামী ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করবেন।'}
                  </p>
                  <button
                    onClick={() => {
                      setSuccess(false);
                      onClose();
                    }}
                    className="mt-6 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold px-8 py-2.5 rounded-full transition-all duration-300 shadow-md cursor-pointer text-sm"
                  >
                    {language === 'en' ? 'Close Window' : 'উইন্ডো বন্ধ করুন'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 text-red-600 border border-red-200 text-sm px-4 py-3 rounded-lg font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <User className="w-3.5 h-3.5 text-brand-emerald" />
                        {t('fullName')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        placeholder={language === 'en' ? 'e.g. Haji Rahman' : 'যেমন: হাজী মোস্তাফিজুর রহমান'}
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <Phone className="w-3.5 h-3.5 text-brand-emerald" />
                        {t('phone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder={language === 'en' ? 'e.g. +880 1711 123456' : 'যেমন: ০১৭১১ ১২৩৪৫৬'}
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <Mail className="w-3.5 h-3.5 text-brand-emerald" />
                        {t('email')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="e.g. name@domain.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                      />
                    </div>

                    {/* Nationality */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <Globe className="w-3.5 h-3.5 text-brand-emerald" />
                        {t('nationality')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="nationality"
                        required
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Travelers */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <Users className="w-3.5 h-3.5 text-brand-emerald" />
                        {language === 'en' ? 'Travelers' : 'ভ্রমণকারী'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="numTravelers"
                        min="1"
                        required
                        value={formData.numTravelers}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                      />
                    </div>

                    {/* Package Type */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <MapPin className="w-3.5 h-3.5 text-brand-emerald" />
                        {language === 'en' ? 'Package Type' : 'প্যাকেজের ধরন'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="packageType"
                        value={formData.packageType}
                        onChange={handleChange}
                        disabled={!!selectedPackage}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all bg-white"
                      >
                        <option value="HAJJ">{language === 'en' ? 'HAJJ' : 'হজ্জ'}</option>
                        <option value="UMRAH">{language === 'en' ? 'UMRAH' : 'ওমরাহ'}</option>
                      </select>
                    </div>

                    {/* Preferred Month */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                        <Calendar className="w-3.5 h-3.5 text-brand-emerald" />
                        {language === 'en' ? 'Travel Month' : 'ভ্রমণের মাস'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="preferredMonth"
                        required
                        value={formData.preferredMonth}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all bg-white"
                      >
                        <option value="">{t('monthSelect')}</option>
                        {months.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Passport Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                      <FileText className="w-3.5 h-3.5 text-brand-emerald" />
                      {t('passportNumber')}
                    </label>
                    <input
                      type="text"
                      name="passportNumber"
                      placeholder="e.g. EE0123456"
                      value={formData.passportNumber}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wide">
                      <FileText className="w-3.5 h-3.5 text-brand-emerald" />
                      {language === 'en' ? 'Additional Requests / Notes' : 'বিশেষ কোনো অনুরোধ বা মন্তব্য (ঐচ্ছিক)'}
                    </label>
                    <textarea
                      name="notes"
                      rows={3}
                      placeholder={language === 'en' ? 'e.g. need quad room for family, elderly wheelchair assistance, flight upgrades...' : 'যেমন: পরিবারের জন্য বিশেষ রুমের সুবিধা, প্রবীণদের হুইলচেয়ার সহায়তা বা ফ্লাইট আপগ্রেড...'}
                      value={formData.notes}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold py-3 rounded-lg text-sm transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        t('sendBookingRequest')
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
