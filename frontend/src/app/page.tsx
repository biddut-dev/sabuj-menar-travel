"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  ShieldCheck, 
  CheckCircle,
  ChevronDown,
  Heart
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import ScrollToTop from '@/components/layout/ScrollToTop';

import PackageCard from '@/components/business/PackageCard';
import BookingModal from '@/components/business/BookingModal';
import Timeline from '@/components/business/Timeline';
import Gallery from '@/components/business/Gallery';
import Testimonials from '@/components/business/Testimonials';
import FAQSection from '@/components/business/FAQSection';
import BlogSection from '@/components/business/BlogSection';
import ContactSection from '@/components/business/ContactSection';
import api from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const [packages, setPackages] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [homepage, setHomepage] = useState<any>({});
  const [team, setTeam] = useState<any[]>([]);
  const { language, t, tExt } = useLanguage();
  
  // Package filtering
  const [hajjFilter, setHajjFilter] = useState('ALL');
  const [umrahFilter, setUmrahFilter] = useState('ALL');

  // Booking modal state
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<any>(null);

  // Load dynamic data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [pkgsRes, setRes, homeRes, teamRes] = await Promise.all([
          api.get('/packages?isPublished=true'),
          api.get('/settings'),
          api.get('/settings/homepage'),
          api.get('/team')
        ]);
        
        setPackages(pkgsRes.data || []);
        setSettings(setRes.data || {});
        setHomepage(homeRes.data || {});
        setTeam(teamRes.data || []);
      } catch (err) {
        console.error('Error loading API data, using fallbacks:', err);
      }
    };
    loadData();
  }, []);

  const handleBookClick = (pkg: any) => {
    setSelectedPkg({
      id: pkg.id,
      title: pkg.title,
      titleEn: pkg.titleEn,
      price: pkg.price,
      type: pkg.type
    });
    setBookingOpen(true);
  };

  const handleConsultationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedPkg(null);
    setBookingOpen(true);
  };

  // Filter lists
  const hajjPackages = packages.filter(p => p.type === 'HAJJ');
  const filteredHajj = hajjFilter === 'ALL' 
    ? hajjPackages 
    : hajjPackages.filter(p => p.category === hajjFilter);

  const umrahPackages = packages.filter(p => p.type === 'UMRAH');
  const filteredUmrah = umrahFilter === 'ALL' 
    ? umrahPackages 
    : umrahPackages.filter(p => p.category === umrahFilter);

  const filters = [
    { name: language === 'en' ? 'All Packages' : 'সব প্যাকেজ', value: 'ALL' },
    { name: language === 'en' ? 'VIP' : 'ভিআইপি', value: 'VIP' },
    { name: language === 'en' ? 'Premium' : 'প্রিমিয়াম', value: 'PREMIUM' },
    { name: language === 'en' ? 'Standard' : 'স্ট্যান্ডার্ড', value: 'STANDARD' },
    { name: language === 'en' ? 'Economy' : 'ইকোনমি', value: 'ECONOMY' }
  ];

  const servicesData = [
    {
      title: language === 'en' ? 'Hajj Packages' : 'হজ্জ প্যাকেজসমূহ',
      desc: language === 'en'
        ? 'Fully guided Hajj programs featuring premium and standard tiers with pre-departure orientation, flight tickets, and visa processing.'
        : 'পবিত্র হজ্জের প্রিমিয়াম ও স্ট্যান্ডার্ড প্যাকেজ, যার মধ্যে প্রাক-হজ্জ ওরিয়েন্টেশন, বিমানের টিকিট এবং হজ্জ ভিসা প্রক্রিয়াকরণ অন্তর্ভুক্ত।'
    },
    {
      title: language === 'en' ? 'Umrah Packages' : 'ওমরাহ প্যাকেজসমূহ',
      desc: language === 'en'
        ? 'Customizable Umrah plans throughout the year for individuals, families, and groups, with 5-star clock tower accommodation options.'
        : 'সারা বছরের জন্য কাস্টমাইজড একক, পারিবারিক ও গ্রুপ ওমরাহ প্যাকেজ, সাথে ৫-তারকা হোটেল ও ক্লক টাওয়ারে থাকার চমৎকার সুবিধা।'
    },
    {
      title: language === 'en' ? 'Group Hajj & Umrah' : 'গ্রুপ হজ্জ ও ওমরাহ',
      desc: language === 'en'
        ? 'Cost-effective and highly organized group packages accompanied by religious scholars, medical advisors, and group leaders.'
        : 'ইসলামী স্কলার ও গ্রুপ লিডারদের সার্বক্ষণিক তত্ত্ববধানে কম খরচে এবং অত্যন্ত সুশৃঙ্খলভাবে হজ্জ ও ওমরাহ পালনের সুবিধা।'
    },
    {
      title: language === 'en' ? 'Family Umrah Packages' : 'পারিবারিক ওমরাহ পরিকল্পনা',
      desc: language === 'en'
        ? 'Custom family room reservations (double/triple/quad), private transportation transfers, and support for elders and children.'
        : 'পরিবারের শিশু ও প্রবীণদের সুবিধার্থে বিশেষ ফ্যামিলি রুম বুকিং, প্রাইভেট এসি গাড়িতে যাতায়াত এবং বিশেষ সাপোর্ট।'
    },
    {
      title: language === 'en' ? 'VIP Executive Hajj' : 'ভিআইপি এক্সিকিউটিভ হজ্জ',
      desc: language === 'en'
        ? 'Elite stays in luxury hotels facing the Haramain, private GMC vehicle transfers, and luxury A/C tents in Mina & Arafat.'
        : 'হারামাইনের সামনে অভিজাত ৫-তারকা হোটেল, প্রাইভেট GMC লাক্সারি কার এবং মিনা ও আরাফাতে বিশেষ ভিআইপি এসি তাঁবু।'
    },
    {
      title: language === 'en' ? 'Ziyarat Historic Tours' : 'ঐতিহাসিক জিয়ারত ট্যুর',
      desc: language === 'en'
        ? 'Guided historical site visits in both Makkah and Madinah, including Cave of Hira, Mount Uhud, Quba Mosque, and Arafat fields.'
        : 'মক্কা ও মদিনার ঐতিহাসিক স্থানসমূহ (জাবালে নূর, উহুদ পাহাড়, কুবা মসজিদ ও আরাফাত ময়দান) অভিজ্ঞ গাইড সহ জিয়ারত ট্যুর।'
    },
    {
      title: language === 'en' ? 'Passport & Documentation' : 'পাসপোর্ট ও ভিসা প্রসেসিং',
      desc: language === 'en'
        ? 'Sincere assistance with passport renewal, registration in Saudi e-Hajj portals, biometric checks, and visa processing.'
        : 'পাসপোর্ট নবায়ন, সৌদি ই-হজ পোর্টালে রেজিস্ট্রেশন, বায়োমেট্রিক ও ভিসা ইস্যু করার যাবতীয় কাজে আন্তরিক সহযোগিতা।'
    },
    {
      title: language === 'en' ? 'Pre-Hajj Orientation' : 'প্রাক-হজ্জ দিকনির্দেশনা ও সেমিনার',
      desc: language === 'en'
        ? 'Interactive training sessions in Dhaka using models of the Kaaba, guiding pilgrims step-by-step on rituals and health rules.'
        : 'ঢাকায় কাবার ডামি মডেল ও মাল্টিমিডিয়ার সাহায্যে হজ্জের প্রতিটি নিয়ম ও স্বাস্থ্যবিধি সম্পর্কে হাতে-কলমে প্রশিক্ষণ সেমিনার।'
    },
    {
      title: language === 'en' ? 'Airport & Pilgrim Support' : 'বিমানবন্দর ও কাস্টমার সাপোর্ট',
      desc: language === 'en'
        ? 'Dedicated coordinators at Dhaka and Jeddah airports to help with immigration, luggage management, and hotel check-ins.'
        : 'ঢাকা ও জেদ্দা বিমানবন্দরে ইমিগ্রেশন, লাগেজ সংগ্রহ এবং হোটেল চেকিংয়ের জন্য নিয়োজিত প্রতিনিধির সার্বক্ষণিক তদারকি।'
    }
  ];

  return (
    <>
      <Navbar settings={settings} />

      {/* Hero Section */}
      <section className="relative h-[92vh] flex items-center justify-center text-white overflow-hidden">
        {/* Full screen background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1920"
            alt="Makkah Holy Kaaba background"
            fill
            priority
            className="object-cover brightness-[0.45]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-brand-dark/40"></div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-6 md:space-y-8 flex flex-col items-center">
          <span className="text-xs md:text-sm font-extrabold uppercase tracking-widest text-brand-gold bg-brand-gold/10 px-4 py-1.5 rounded-full border border-brand-gold/30 gold-glow">
            {language === 'en' ? 'Reg. Ministry of Religious Affairs (0816)' : 'অনুমোদিত: ধর্ম বিষয়ক মন্ত্রণালয় (০৮১৬)'}
          </span>
          <h2 className="font-serif-title font-bold text-3xl sm:text-5xl md:text-6xl text-white tracking-wide leading-tight max-w-4xl drop-shadow-lg">
            {tExt(homepage.heroTitle, homepage.heroTitleEn) || t('trustedCompanion')}
          </h2>
          <p className="text-sm sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed drop-shadow">
            {tExt(homepage.heroSubtitle, homepage.heroSubtitleEn) || t('subheadingText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center w-full sm:w-auto">
            <a
              href="#hajj-packages"
              className="bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold px-8 py-3.5 rounded-full text-sm transition-all duration-300 shadow-lg gold-glow hover:scale-103 text-center"
            >
              {t('viewPackages')}
            </a>
            <button
              onClick={handleConsultationClick}
              className="bg-transparent hover:bg-white/10 text-white font-bold px-8 py-3.5 rounded-full text-sm border-2 border-white transition-all duration-300 hover:scale-103 cursor-pointer"
            >
              {t('bookConsultation')}
            </button>
          </div>

          <div className="absolute bottom-10 animate-bounce">
            <ChevronDown className="w-6 h-6 text-brand-gold-light" />
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="relative z-10 -mt-16 max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-brand-gold/10 p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1 md:border-r border-gray-100 last:border-0">
            <p className="font-serif-title font-bold text-3xl sm:text-4xl text-brand-emerald">
              {homepage.experienceYears || 10}+
            </p>
            <p className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">{t('experienceYears')}</p>
          </div>
          <div className="space-y-1 md:border-r border-gray-100 last:border-0">
            <p className="font-serif-title font-bold text-3xl sm:text-4xl text-brand-emerald">
              {homepage.happyPilgrims || 5000}+
            </p>
            <p className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">{t('happyPilgrims')}</p>
          </div>
          <div className="space-y-1 md:border-r border-gray-100 last:border-0">
            <p className="font-serif-title font-bold text-3xl sm:text-4xl text-brand-emerald">
              {homepage.guidanceRate || 100}%
            </p>
            <p className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">
              {language === 'en' ? 'Spiritual Guidance' : 'ধর্মীয় গাইডেন্স'}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-serif-title font-bold text-3xl sm:text-4xl text-brand-emerald">
              {homepage.supportHours || "24/7"}
            </p>
            <p className="text-[10px] uppercase font-bold text-brand-gold tracking-widest">
              {language === 'en' ? 'Pilgrim Support' : 'সার্বক্ষণিক সাপোর্ট'}
            </p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none islamic-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Who We Are' : 'আমরা কে'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {language === 'en' ? 'Sabuj Menar Travel Agency' : 'সবুজ মিনার ট্রাভেল এজেন্সি'}
            </h3>
            <p className="text-xs text-brand-gold uppercase font-bold tracking-widest">
              {tExt(homepage.govtRegistrationText, homepage.govtRegistrationTextEn) || t('regText')}
            </p>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Content */}
            <div className="lg:col-span-7 space-y-6 text-sm sm:text-base text-gray-600 leading-relaxed">
              <h4 className="font-serif-title font-bold text-xl text-brand-emerald">
                {language === 'en' ? 'Our Spiritual Legacy' : 'আমাদের গৌরবময় যাত্রা'}
              </h4>
              <p>
                {tExt(homepage.aboutStory, homepage.aboutStoryEn) || t('subheadingText')}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <h5 className="font-serif-title font-bold text-brand-emerald text-sm uppercase tracking-wide">{t('ourMission')}</h5>
                  <p className="text-xs">
                    {tExt(homepage.aboutMission, homepage.aboutMissionEn)}
                  </p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-2">
                  <h5 className="font-serif-title font-bold text-brand-emerald text-sm uppercase tracking-wide">{t('ourVision')}</h5>
                  <p className="text-xs">
                    {tExt(homepage.aboutVision, homepage.aboutVisionEn)}
                  </p>
                </div>
              </div>
            </div>

            {/* Office Info & Visuals */}
            <div className="lg:col-span-5 space-y-6">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-brand-gold/20 aspect-[4/3] w-full bg-gray-200">
                <Image
                  src="/images/about-hajj.png"
                  alt={language === 'en' ? 'Tawaf around the Holy Kaaba' : 'পবিত্র কাবার চারিপাশে তাওয়াফরত হাজিগণ'}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="bg-brand-emerald text-white p-5 rounded-xl border border-brand-gold/20 shadow-md">
                <h5 className="font-serif-title font-bold text-xs uppercase tracking-widest text-brand-gold-light mb-2">
                  {language === 'en' ? 'Visit Our Office' : 'আমাদের প্রধান কার্যালয়'}
                </h5>
                <p className="text-xs text-white/90 leading-relaxed">
                  {tExt(settings.officeAddress, settings.officeAddressEn) || (language === 'en' ? "Room No. 402, 4th Floor, Paltan Tower, Purana Paltan, Dhaka-1000, Bangladesh" : "রুম নং ৪০২, ৪র্থ তলা, পল্টন টাওয়ার, পুরানা Paltan, ঢাকা-১০০০, বাংলাদেশ")}
                </p>
                <div className="mt-4 flex items-center gap-4 text-xs text-brand-gold-light font-bold">
                  <span>{language === 'en' ? 'Tel:' : 'ফোন:'} {settings.phone1 || "+880 1711 123456"}</span>
                  <span>{language === 'en' ? 'WhatsApp:' : 'হোয়াটসঅ্যাপ:'} {settings.whatsappNumber || "+8801711123456"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seeded Team Members */}
          {team.length > 0 && (
            <div className="mt-20">
              <h4 className="font-serif-title font-bold text-lg text-brand-emerald text-center mb-10 uppercase tracking-wider">
                {language === 'en' ? 'Our Spiritual Scholars & Management' : 'আমাদের ধর্মীয় স্কলার ও প্রতিনিধি দল'}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {team.map((member) => {
                  const memberName = tExt(member.name, member.nameEn);
                  const memberRole = tExt(member.role, member.roleEn);
                  const memberBio = tExt(member.bio, member.bioEn);
                  return (
                    <div key={member.id} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center space-y-3 group hover:border-brand-gold/30 hover:shadow-md transition-all">
                      <div className="w-16 h-16 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-serif-title font-bold text-lg mx-auto border-2 border-brand-gold">
                        {memberName.split(' ').filter((n: string) => n.length > 0).slice(0, 2).map((n: string) => n[0]).join('')}
                      </div>
                      <div>
                        <h5 className="font-serif-title font-bold text-brand-emerald">{memberName}</h5>
                        <p className="text-xs text-brand-gold font-semibold uppercase tracking-wider mt-0.5">{memberRole}</p>
                      </div>
                      {memberBio && (
                        <p className="text-xs text-gray-500 leading-relaxed px-4">{memberBio}</p>
                      )}
                      {(member.phone || member.email) && (
                        <div className="pt-3 border-t border-gray-50 text-[10px] text-gray-400 space-y-0.5">
                          {member.phone && <p>{language === 'en' ? 'Phone:' : 'ফোন:'} {member.phone}</p>}
                          {member.email && <p>{language === 'en' ? 'Email:' : 'ইমেইল:'} {member.email}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Hajj Packages Section */}
      <section id="hajj-packages" className="py-20 bg-brand-bg relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Pilgrimage of a Lifetime' : 'জীবনের সবচেয়ে পবিত্র সফর'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {language === 'en' ? 'Hajj Packages 2027' : 'হজ্জ প্যাকেজসমূহ ২০২৭'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'en' 
                ? 'Government approved Hajj categories (VIP, Premium, Standard, Economy) tailored for comfort and devotion.'
                : 'ধর্ম বিষয়ক মন্ত্রণালয় অনুমোদিত হজ্জ প্যাকেজসমূহ (ভিআইপি, প্রিমিয়াম, স্ট্যান্ডার্ড, ইকোনমি) আপনার সর্বোচ্চ আরাম ও ইবাদতের জন্য প্রস্তুত।'}
            </p>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setHajjFilter(f.value)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all border cursor-pointer ${
                  hajjFilter === f.value
                    ? 'bg-brand-emerald text-white border-brand-emerald shadow'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-emerald/30'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredHajj.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredHajj.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onBook={handleBookClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
              <p className="text-sm text-gray-500">
                {language === 'en' 
                  ? 'No Hajj packages matching this category are currently listed.' 
                  : 'এই ক্যাটাগরির কোনো হজ্জ প্যাকেজ এখন তালিকাভুক্ত নেই।'}
              </p>
              <button 
                onClick={handleConsultationClick}
                className="mt-4 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all"
              >
                {language === 'en' ? 'Request Custom Quotation' : 'কাস্টম প্যাকেজের জন্য আবেদন করুন'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Umrah Packages Section */}
      <section id="umrah-packages" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Sacred Visit' : 'পবিত্র ওমরাহ সফর'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {language === 'en' ? 'Umrah Packages 2026/2027' : 'ওমরাহ প্যাকেজসমূহ ২০২৬/২০২৭'}
            </h3>
            <p className="text-xs text-gray-500">
              {language === 'en'
                ? 'Perform Umrah throughout the year. Select from our highly custom executive, premium, and group tours.'
                : 'সারা বছর জুড়েই ওমরাহ পালন করুন। আমাদের প্রিমিয়াম, এক্সিকিউটিভ ও গ্রুপ প্যাকেজ থেকে আপনার পছন্দেরটি বেছে নিন।'}
            </p>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setUmrahFilter(f.value)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all border cursor-pointer ${
                  umrahFilter === f.value
                    ? 'bg-brand-emerald text-white border-brand-emerald shadow'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-emerald/30'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredUmrah.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredUmrah.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} onBook={handleBookClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-brand-bg rounded-2xl border border-gray-100 p-8 max-w-md mx-auto">
              <p className="text-sm text-gray-500">
                {language === 'en'
                  ? 'No Umrah packages matching this category are currently listed.'
                  : 'এই ক্যাটাগরির কোনো ওমরাহ প্যাকেজ এখন তালিকাভুক্ত নেই।'}
              </p>
              <button 
                onClick={handleConsultationClick}
                className="mt-4 bg-brand-emerald hover:bg-brand-emerald-dark text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all"
              >
                {language === 'en' ? 'Request Custom Umrah' : 'কাস্টম ওমরাহ প্যাকেজের আবেদন'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Sabuj Menar */}
      <section className="py-20 bg-brand-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none islamic-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Why Travel With Us' : 'কেন আমাদের বেছে নেবেন'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {language === 'en' ? 'A Decade of Trusted Pilgrimages' : 'দীর্ঘ এক দশকের বিশ্বস্ত হজ্জ ও ওমরাহ সেবা'}
            </h3>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-brand-gold" />
              </div>
              <h4 className="font-serif-title font-bold text-brand-emerald text-base">
                {language === 'en' ? 'Government Approved' : 'সরকারি লাইসেন্সপ্রাপ্ত'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'en'
                  ? 'Registered and licensed agency under the Ministry of Religious Affairs, Government of Bangladesh (Reg. No. 0816), guaranteeing transparent procedures.'
                  : 'ধর্ম বিষয়ক মন্ত্রণালয় (হজ্জ লাইসেন্স নং ০৮১৬) অনুমোদিত এবং নিবন্ধিত ট্রাভেল এজেন্সি, যা আপনার পবিত্র সফরকে সম্পূর্ণ নিরাপদ ও আইনি জটলামুক্ত রাখবে।'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-brand-gold" />
              </div>
              <h4 className="font-serif-title font-bold text-brand-emerald text-base">
                {language === 'en' ? 'Experienced Hajj Guides' : 'দক্ষ হজ্জ গাইড ও মোয়াল্লেম'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'en'
                  ? 'Accompanied by renowned Islamic scholars and highly experienced guides who provide step-by-step guidance for every ritual in KSA.'
                  : 'পবিত্র সফরে অভিজ্ঞ মুফতি এবং ইসলামী স্কলারদের সার্বক্ষণিক দিকনির্দেশনা, যা আপনাকে হজ্জ ও ওমরাহর প্রতিটি রুকন ও মাসয়ালা সঠিকভাবে পালনে সাহায্য করবে।'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-brand-gold" />
              </div>
              <h4 className="font-serif-title font-bold text-brand-emerald text-base">
                {language === 'en' ? 'All-In-One Packages' : 'সম্পূর্ণ প্যাকেজ সুবিধা'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'en'
                  ? 'Everything is covered: flight tickets, visa processing, document management, transfers in luxury coach fleets, quality meals, and hotel bookings.'
                  : 'ফ্লাইট টিকিট, ওমরাহ/হজ্জ ভিসা প্রসেসিং, ট্রান্সপোর্ট, পুষ্টিকর খাবার এবং হারামাইনের কাছে হোটেল বুকিং সহ সমস্ত লজিস্টিকস এক প্যাকেজেই সরবরাহ করা হয়।'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center flex-shrink-0">
                <Building2 className="w-6 h-6 text-brand-gold" />
              </div>
              <h4 className="font-serif-title font-bold text-brand-emerald text-base">
                {language === 'en' ? 'Premium Hotels' : 'হারামের নিকটবর্তী হোটেল'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'en'
                  ? 'Partnerships with high-quality hotels directly in front of the Haram yards in Makkah and Madinah, minimizing walking distance for elders.'
                  : 'মক্কা ও মদিনার পবিত্র কাবা ও মসজিদে নববীর মূল চত্বরের কাছাকাছি উন্নত হোটেল, যা বয়স্ক যাত্রীদের যাতায়াত এবং হাঁটার দূরত্ব কমিয়ে দেয়।'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-brand-gold" />
              </div>
              <h4 className="font-serif-title font-bold text-brand-emerald text-base">
                {language === 'en' ? '24/7 Dedicated Support' : '২৪/৭ সার্বক্ষণিক কেয়ার'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'en'
                  ? 'Our support team is active round-the-clock. Whether in Dhaka or Saudi Arabia, we are here to assist with health, travel, or lodging requirements.'
                  : 'ঢাকা এবং সৌদি আরবে আমাদের গাইড ও ভলান্টিয়ার টিম ২৪ ঘণ্টা সক্রিয় থাকে। যেকোনো স্বাস্থ্যগত, আইনি বা বাসস্থান সংক্রান্ত জটিলতায় আমরা আপনার পাশে আছি।'}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-brand-emerald/10 text-brand-emerald flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-brand-gold" />
              </div>
              <h4 className="font-serif-title font-bold text-brand-emerald text-base">
                {language === 'en' ? 'Trusted by Thousands' : 'হাজারো হাজির সন্তুষ্টি'}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {language === 'en'
                  ? 'Over 5000 happy pilgrims have successfully performed their spiritual obligations with us, returning home with deep satisfaction.'
                  : 'আমাদের মাধ্যমে পাঁচ হাজারেরও বেশি হজ ও ওমরাহযাত্রী সন্তোষজনকভাবে ইবাদত সম্পন্ন করে সফলভাবে দেশে ফিরেছেন।'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Our Capabilities' : 'আমাদের সেবাসমূহ'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {language === 'en' ? 'End-to-End Pilgrimage Services' : 'আমাদের পূর্ণাঙ্গ সেবাসমূহ'}
            </h3>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((s, index) => (
              <div key={index} className="flex gap-4 p-5 rounded-2xl border border-gray-100 hover:border-brand-emerald/20 hover:bg-brand-emerald/5 transition-all animate-none">
                <div className="w-8 h-8 rounded-lg bg-brand-emerald text-white font-serif-title font-bold text-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif-title font-bold text-brand-emerald text-sm">{s.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hajj Journey Timeline Section */}
      <section id="timeline" className="py-20 bg-brand-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none islamic-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'The Path of Devotion' : 'ইবাদতের পবিত্র পথ'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {t('journeyTimeline')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('journeyTimelineSub')}
            </p>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <Timeline />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Visual Highlights' : 'যাত্রার চিত্রমালা'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {t('galleryTitle')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('gallerySubtitle')}
            </p>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <Gallery />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-brand-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none islamic-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Pilgrims Feedback' : 'হাজীদের মন্তব্য'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {t('testimonialTitle')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('testimonialSubtitle')}
            </p>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <Testimonials />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Clear Answers' : 'স্বচ্ছ উত্তর'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {t('faqTitle')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('faqSubtitle')}
            </p>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <FAQSection />
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-brand-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none islamic-pattern"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Islamic Guides & Tips' : 'ইসলামী গাইড ও টিপস'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {t('blogTitle')}
            </h3>
            <p className="text-xs text-gray-500">
              {t('blogSubtitle')}
            </p>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <BlogSection />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/20">
              {language === 'en' ? 'Get in Touch' : 'আমাদের সাথে যোগাযোগ'}
            </span>
            <h3 className="font-serif-title font-bold text-2xl sm:text-4xl text-brand-emerald">
              {language === 'en' ? 'Start Your Sacred Journey Today' : 'আজই আপনার পবিত্র যাত্রা শুরু করুন'}
            </h3>
            <div className="w-12 h-1 bg-brand-gold mx-auto rounded-full mt-4"></div>
          </div>

          <ContactSection settings={settings} />
        </div>
      </section>

      {/* Floating Buttons & Modals */}
      <WhatsAppButton number={settings.whatsappNumber} />
      <ScrollToTop />

      {/* Booking Form Dialog */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        selectedPackage={selectedPkg}
      />

      <Footer settings={settings} />
    </>
  );
}
