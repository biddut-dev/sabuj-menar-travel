import { PrismaClient, Role, PackageType, PackageCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with bilingual data (Bangla & English)...');

  // 1. Seed Admin User
  const adminEmail = 'admin@sabujmenar.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  let adminUser;
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Sabuj Menar Admin',
        role: Role.ADMIN,
      }
    });
    console.log('Admin user created successfully.');
  } else {
    adminUser = existingAdmin;
    console.log('Admin user already exists.');
  }

  // 2. Seed Homepage Content
  const existingHomepage = await prisma.homepageContent.findFirst();
  if (!existingHomepage) {
    await prisma.homepageContent.create({
      data: {
        heroTitle: 'আপনার হজ্জ ও ওমরার বিশ্বস্ত সঙ্গী',
        heroTitleEn: 'Your Trusted Companion for Hajj & Umrah',
        heroSubtitle: 'সবুজ মিনার ট্রাভেল এজেন্সির মাধ্যমে আরামদায়ক, নিরাপদ এবং পূর্ণাঙ্গ নির্দেশনার সাথে আপনার পবিত্র যাত্রা সম্পন্ন করুন।',
        heroSubtitleEn: 'Perform your sacred journey with comfort, confidence, and complete guidance through Sabuj Menar Travel Agency.',
        experienceYears: 10,
        happyPilgrims: 5000,
        guidanceRate: 100,
        supportHours: '24/7',
        aboutStory: 'সবুজ মিনার ট্রাভেল এজেন্সি যাত্রা শুরু করেছিল একটি সাধারণ উদ্দেশ্যে: প্রতিটি হজযাত্রীর জন্য পবিত্র হজ্জ ও ওমরাহ পালনকে সহজ, আরামদায়ক ও আধ্যাত্মিকভাবে ফলপ্রসূ করে তোলা। গত এক দশকে আমরা ধর্ম বিষয়ক মন্ত্রণালয়ের (লাইসেন্স নং ০৮১৬) অধীনে একটি অন্যতম শীর্ষ হজ্জ এজেন্সি হিসেবে নিজেদের প্রতিষ্ঠিত করেছি। আমরা ভিসা প্রসেসিং, বিমানের টিকিট, হারামাইনের কাছাকাছি ৫-তারকা ও মানসম্পন্ন হোটেল বুকিং, স্বাস্থ্যসম্মত খাবার এবং অভিজ্ঞ মুফতিদের দ্বারা সরাসরি ধর্মীয় নির্দেশনা সহ সকল বিষয় অত্যন্ত বিশ্বস্ততার সাথে পরিচালনা করি।',
        aboutStoryEn: 'Sabuj Menar Travel Agency was founded with a single mission: to make the sacred journey of Hajj & Umrah accessible, comfortable, and spiritually fulfilling for every pilgrim. Over the last decade, we have established ourselves as a premier agency registered under the Ministry of Religious Affairs (Govt. Reg. No. 0816), providing end-to-end guidance to thousands of happy pilgrims. We manage all logistics including visas, flights, 5-star & standard hotel bookings close to the Haramain, quality meals, and expert spiritual guidance.',
        aboutMission: 'হজযাত্রীদের জন্য উন্নতমানের ভ্রমণ, আবাসন ও ধর্মীয় নির্দেশনা প্রদান করা, যাতে তারা কোনো ধরণের ঝামেলা ছাড়াই সম্পূর্ণ মনোযোগের সাথে ইবাদত সম্পন্ন করতে পারেন।',
        aboutMissionEn: 'To provide seamless, premium-quality travel, accommodation, and spiritual guidance services that allow pilgrims to focus entirely on their worship and connection with Allah.',
        aboutVision: 'স্বচ্ছ সেবা, আরামদায়ক ব্যবস্থাপনা এবং গভীর ধর্মীয় নির্দেশনার মাধ্যমে দেশের সবচেয়ে বিশ্বস্ত ও নির্ভরযোগ্য হজ্জ ও ওমরাহ এজেন্সি হিসেবে পরিচিতি লাভ করা।',
        aboutVisionEn: 'To be the most trusted and preferred Hajj & Umrah agency in the region, recognized for transparent services, comfortable execution, and deep spiritual support.',
        govtRegistrationText: 'ধর্ম বিষয়ক মন্ত্রণালয় অনুমোদিত (হজ্জ লাইসেন্স নং ০৮১৬)',
        govtRegistrationTextEn: 'Approved by Ministry of Religious Affairs (Hajj License No. 0816)',
      }
    });
    console.log('Homepage content seeded.');
  }

  // 3. Seed Website Settings
  const existingSettings = await prisma.websiteSettings.findFirst();
  if (!existingSettings) {
    await prisma.websiteSettings.create({
      data: {
        officeAddress: 'রুম নং ৪০২, ৪র্থ তলা, পল্টন টাওয়ার, পুরানা পল্টন, ঢাকা-১০০০, বাংলাদেশ',
        officeAddressEn: 'Room No. 402, 4th Floor, Paltan Tower, Purana Paltan, Dhaka-1000, Bangladesh',
        googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.3701358988673!2d90.4101897!3d23.7341738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b85ee4b0c169%3A0xe9c869fb7a3c3065!2sPurana%20Paltan%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd',
        phone1: '+880 1711 123456',
        phone2: '+880 1819 654321',
        whatsappNumber: '+8801711123456',
        emailAddress: 'info@sabujmenar.com',
        businessHours: 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - রাত ৮:০০ (শুক্রবার বন্ধ)',
        businessHoursEn: 'Saturday - Thursday: 9:00 AM - 8:00 PM (Friday Closed)',
        facebookUrl: 'https://facebook.com/sabujmenar',
        twitterUrl: 'https://twitter.com/sabujmenar',
        instagramUrl: 'https://instagram.com/sabujmenar',
        youtubeUrl: 'https://youtube.com/c/sabujmenar',
        seoTitle: 'সবুজ মিনার ট্রাভেল এজেন্সি | হজ্জ ও ওমরার বিশ্বস্ত সঙ্গী',
        seoDescription: 'সবুজ মিনার ট্রাভেল এজেন্সির মাধ্যমে আরামদায়ক, নিরাপদ এবং পূর্ণাঙ্গ নির্দেশনার সাথে আপনার পবিত্র যাত্রা সম্পন্ন করুন।',
      }
    });
    console.log('Website settings seeded.');
  }

  // 4. Seed Hajj & Umrah Packages
  const packageCount = await prisma.package.count();
  if (packageCount === 0) {
    const packagesData = [
      {
        title: 'প্রিমিয়াম ভিআইপি গোল্ড হজ্জ প্যাকেজ ২০২৭',
        titleEn: 'Premium VIP Gold Hajj Package 2027',
        slug: 'premium-gold-hajj-package-2027',
        description: 'হারামাইনের ঠিক সামনে ৫-তারকা হোটেল, বিলাসবহুল এসি প্রাইভেট ট্রান্সফার, মিনা ও আরাফাতে ভিআইপি এসি তাঁবু এবং স্বনামধন্য ইসলামী স্কলারদের সার্বক্ষণিক দিকনির্দেশনা সহ একটি অভিজাত হজ্জ অভিজ্ঞতা।',
        descriptionEn: 'An elite spiritual experience with 5-star hotels directly facing the Haramain, luxury air-conditioned private transfers, VIP tents in Mina and Arafat, and dedicated guidance by renowned Islamic scholars.',
        type: PackageType.HAJJ,
        category: PackageCategory.VIP,
        durationDays: 25,
        price: 850000,
        hotelDetailsMakkah: 'পুলম্যান জমজম মক্কা (৫-স্টার, হারামের সামনে) - ১০ রাত',
        hotelDetailsMakkahEn: 'Pullman ZamZam Makkah (5-Star, Front of Haram) - 10 Nights',
        hotelDetailsMadinah: 'মদিনা হিলটন (৫-স্টার, মসজিদে নববীর সামনে) - ৫ রাত',
        hotelDetailsMadinahEn: 'Madinah Hilton (5-Star, Front of Nabawi) - 5 Nights',
        departureDate: new Date('2027-05-15'),
        mealsIncluded: true,
        visaIncluded: true,
        flightIncluded: true,
        guideIncluded: true,
        ziyaratIncluded: true,
        highlights: [
          'সৌদিয়া বা বিমান বাংলাদেশ এয়ারলাইন্সে সরাসরি ফ্লাইট',
          'হারাম ও মসজিদে নববীর ঠিক সামনে ৫-স্টার হোটেল',
          'মিনা ও আরাফাতে সোফাবেড এবং বুফে খাবার সহ ভিআইপি তাঁবু',
          'ব্যক্তিগত বিলাসবহুল এসি গাড়িতে যাতায়াত',
          'ইসলামী স্কলারদের দ্বারা হজ্জের প্রতিটি নিয়মের সঠিক দিকনির্দেশনা',
          'মক্কা ও মদিনার ঐতিহাসিক স্থানসমূহ (জিয়ারত) পরিভ্রমণ',
          'ফ্রি হজ্জ কিট (এহরামের কাপড়, ব্যাগ, গাইড বই)'
        ],
        highlightsEn: [
          'Direct flights via Saudia or Biman Bangladesh',
          '5-Star hotels directly in front of Haram/Nabawi',
          'VIP Tents in Mina & Arafat with Sofa Beds and Buffet Meals',
          'Private air-conditioned transportation',
          'Daily Islamic lectures and step-by-step guidance by Islamic Scholars',
          'Comprehensive Ziyarat (Holy Sites) Tours in Makkah & Madinah',
          'Complimentary ZamZam Water, Hajj Kit (Ihram, bags, books)'
        ]
      },
      {
        title: 'স্ট্যান্ডার্ড হজ্জ প্যাকেজ ২০২৭',
        titleEn: 'Standard Hajj Package 2027',
        slug: 'standard-hajj-package-2027',
        description: 'হারামাইনের খুব কাছে ৪-তারকা হোটেল, বুফে খাবার, এসি কোচ ট্রান্সফার এবং অভিজ্ঞ গাইড সমন্বয়ের সাথে আরামদায়ক ও সাশ্রয়ী হজ্জ প্যাকেজ।',
        descriptionEn: 'Comfortable and affordable Hajj packages offering high-quality 4-star hotels within short walking distance, quality buffet meals, comfortable air-conditioned coach transfers, and complete group coordination.',
        type: PackageType.HAJJ,
        category: PackageCategory.STANDARD,
        durationDays: 30,
        price: 680000,
        hotelDetailsMakkah: 'সুইসোটেল আল মাকাম মক্কা (৪-স্টার, হারামের কাছে) - ১৫ রাত',
        hotelDetailsMakkahEn: 'Swissotel Al Maqam Makkah (4-Star, Near Haram) - 15 Nights',
        hotelDetailsMadinah: 'আল আকীক মদিনা হোটেল (৪-স্টার, নববীর কাছে) - ৮ রাত',
        hotelDetailsMadinahEn: 'Al Aqeeq Madinah Hotel (4-Star, Near Nabawi) - 8 Nights',
        departureDate: new Date('2027-05-12'),
        mealsIncluded: true,
        visaIncluded: true,
        flightIncluded: true,
        guideIncluded: true,
        ziyaratIncluded: true,
        highlights: [
          'ঢাকা থেকে মক্কা/মদিনা আসা যাওয়ার বিমান টিকিট',
          'হারামাইন শরিফ থেকে ৩০০ মিটারের মধ্যে ৪-তারকা হোটেল',
          'মিনা ও আরাফাতে মানসম্পন্ন খাবার সহ এসি তাঁবু',
          'গ্রুপ এসি বাসে যাতায়াতের সুবিধা',
          'অভিজ্ঞ গাইড দ্বারা নিয়মতান্ত্রিক ধর্মীয় পথনির্দেশনা',
          'মক্কা ও মদিনায় ঐতিহাসিক স্থান জিয়ারত',
          'পবিত্র হজ্জের পূর্বে ঢাকা অফিসে বিশেষ ট্রেনিং সেমিনার'
        ],
        highlightsEn: [
          'Return flight tickets included',
          '4-Star hotels located within 300 meters of the Haramain',
          'Comfortable A/C tents in Mina & Arafat with high-quality catering',
          'Group bus transportation throughout the trip',
          'Experienced guides to help perform all rituals correctly',
          'Ziyarat tours in both Makkah and Madinah',
          'Pre-Hajj orientation seminars in Dhaka'
        ]
      },
      {
        title: 'ইকোনমি হজ্জ প্যাকেজ ২০২৭',
        titleEn: 'Economy Hajj Package 2027',
        slug: 'economy-hajj-package-2027',
        description: 'সীমিত বাজেটের মধ্যে মানসম্মত হোটেল, শাটল সার্ভিস, গ্রুপ গাইড এবং পুষ্টিকর দেশীয় খাবার সহ সাশ্রয়ী মূল্যে হজ্জ পালনের সেরা সুযোগ।',
        descriptionEn: 'Budget-friendly Hajj packages with decent accommodations, direct shuttle services, group guides, and healthy meals. Designed for pilgrims seeking the best cost-to-service ratio.',
        type: PackageType.HAJJ,
        category: PackageCategory.ECONOMY,
        durationDays: 35,
        price: 550000,
        hotelDetailsMakkah: 'দার আল ইমান আল সুদ (শাটল বাস সহ স্ট্যান্ডার্ড হোটেল) - ২০ রাত',
        hotelDetailsMakkahEn: 'Dar Al Eiman Al Sud (Standard Hotel with Shuttle) - 20 Nights',
        hotelDetailsMadinah: 'আরতাল ইন্টারন্যাশনাল হোটেল (নববীর কাছে স্ট্যান্ডার্ড হোটেল) - ১০ রাত',
        hotelDetailsMadinahEn: 'Artal International Hotel (Standard, walking distance) - 10 Nights',
        departureDate: new Date('2027-05-10'),
        mealsIncluded: true,
        visaIncluded: true,
        flightIncluded: true,
        guideIncluded: true,
        ziyaratIncluded: true,
        highlights: [
          'ইকোনমি ক্লাস বিমান টিকিট অন্তর্ভুক্ত',
          'মক্কায় ২৪ ঘণ্টা ফ্রি শাটল বাস সার্ভিস সহ হোটেল',
          'মিনা ও আরাফাতে সরকারি এসি তাঁবু ও ফুড বক্স',
          'গ্রুপ বাসে যাতায়াত ব্যবস্থাপনা',
          'অভিজ্ঞ গ্রুপ লিডার ও ধর্মীয় গাইড এবং প্রাথমিক চিকিৎসা সহায়তা',
          'মক্কা ও মদিনায় জিয়ারত সেবা',
          'এহরামের কাপড়, ব্যাগ এবং হজ্জ গাইড বই'
        ],
        highlightsEn: [
          'Economy flights included',
          'Standard hotels with 24/7 dedicated shuttle service in Makkah',
          'Government standard tents in Mina and Arafat with meal boxes',
          'Group bus transfers',
          'Experienced group guide and medical assistance',
          'Ziyarat in Makkah & Madinah',
          'Ihram, bags, and essential guidance booklet'
        ]
      },
      {
        title: 'ভিআইপি ১০-দিনের এক্সিকিউটিভ ওমরাহ প্যাকেজ',
        titleEn: 'VIP 10-Days Executive Umrah Package',
        slug: 'vip-10-days-executive-umrah-package',
        description: 'বিলাসবহুল ওমরাহ অভিজ্ঞতা। আবরাজ আল বাইত (ক্লক টাওয়ার) এবং মদিনা নববী চত্বরের সরাসরি ভিউ সুট হোটেল সহ ব্যক্তিগত বিলাসবহুল জিমসি গাড়িতে ভ্রমণ।',
        descriptionEn: 'Experience a luxurious spiritual getaway during Umrah. Stay in premium suites right in the Abraj Al Bait (Clock Tower) and Nabawi courtyard, with private luxury VIP cars for all transfers.',
        type: PackageType.UMRAH,
        category: PackageCategory.VIP,
        durationDays: 10,
        price: 220000,
        hotelDetailsMakkah: 'ফেয়ারমন্ট মক্কা ক্লক রয়্যাল টাওয়ার (৫-স্টার সুইট, হারাম ভিউ) - ৫ রাত',
        hotelDetailsMakkahEn: 'Fairmont Makkah Clock Royal Tower (5-Star Suite, Haram View) - 5 Nights',
        hotelDetailsMadinah: 'ওবেরয় মদিনা (৫-স্টার লাক্সারি) - ৪ রাত',
        hotelDetailsMadinahEn: 'Oberoi Madinah (5-Star Luxury) - 4 Nights',
        departureDate: new Date('2026-10-15'),
        mealsIncluded: true,
        visaIncluded: true,
        flightIncluded: true,
        guideIncluded: true,
        ziyaratIncluded: true,
        highlights: [
          'সৌদি এয়ারলাইন্সে সরাসরি প্রিমিয়াম রিটার্ন বিমান টিকিট',
          'মক্কা ক্লক টাওয়ারে আকর্ষণীয় হারাম ভিউ সুইট রুম',
          'ব্যক্তিগত জিমসি/লাক্সারি কারে বিমানবন্দর ও হোটেলসমূহে যাতায়াত',
          'ওমরাহ পালনের জন্য ১-টু-১ ব্যক্তিগত ধর্মীয় গাইড সুবিধা',
          'ব্যক্তিগত গাইড সহ ঐতিহাসিক স্থানে প্রিমিয়াম জিয়ারত ট্যুর',
          'হোটেলের আন্তর্জাতিক রেস্টুরেন্টে ৩ বেলা ফুল-বোর্ড বুফে খাবার',
          'ভিআইপি ফাস্ট-ট্র্যাক ওমরাহ ভিসা প্রসেসিং এবং এয়ারপোর্ট লাউঞ্জ সুবিধা'
        ],
        highlightsEn: [
          'Direct premium business/economy tickets on Saudia Airlines',
          'Breathtaking Haram View Suites in Makkah Clock Tower',
          'Private GMC/Luxury Car transportation between Airport, Makkah, and Madinah',
          'Exclusive 1-on-1 expert religious guide for performing Umrah',
          'Private historic Ziyarat tour with personal guide and premium refreshments',
          'Full-board buffet dining (Breakfast, Lunch, Dinner) in hotel restaurants',
          'VIP fast-track visa processing and airport lounge access'
        ]
      },
      {
        title: 'প্রিমিয়াম ১৪-দিনের ফ্যামিলি ওমরাহ প্যাকেজ',
        titleEn: 'Premium 14-Days Family Umrah Package',
        slug: 'premium-14-days-family-umrah-package',
        description: 'শিশু ও বয়োবৃদ্ধদের নিয়ে পারিবারিক ওমরাহ যাত্রার জন্য পারফেক্ট প্যাকেজ। হারামের মাত্র ১০০ মিটারের মধ্যে ৫-তারকা হোটেল এবং ডাবল/ট্রিপল রুমের বিশেষ ব্যবস্থা।',
        descriptionEn: 'Perfect package for families traveling with children or elders. Features excellent 5-star hotels within 100 meters, double/triple room configurations, and private group support.',
        type: PackageType.UMRAH,
        category: PackageCategory.PREMIUM,
        durationDays: 14,
        price: 155000,
        hotelDetailsMakkah: 'মক্কা টাওয়ার্স (৫-স্টার, হারামের প্রবেশদ্বারে) - ৭ রাত',
        hotelDetailsMakkahEn: 'Makkah Towers (5-Star, 2 mins walk) - 7 Nights',
        hotelDetailsMadinah: 'শাজা মদিনা (৫-স্টার, নববীর চত্বরে) - ৬ রাত',
        hotelDetailsMadinahEn: 'Shaza Madinah (5-Star, 3 mins walk) - 6 Nights',
        departureDate: new Date('2026-11-05'),
        mealsIncluded: true,
        visaIncluded: true,
        flightIncluded: true,
        guideIncluded: true,
        ziyaratIncluded: true,
        highlights: [
          'ঢাকা থেকে সরাসরি আন্তর্জাতিক রিটার্ন বিমান টিকিট',
          'মহিলাদের প্রবেশদ্বারের খুব কাছে প্রিমিয়াম ৫-স্টার হোটেল',
          'পরিবারের জন্য প্রশস্ত ডাবল ও ট্রিপল ফ্যামিলি রুম',
          'সপরিবারে আরামদায়ক এসি কোস্টারে যাতায়াত',
          'ওমরাহ পালনের সময় আমাদের অভিজ্ঞ গাইডের সার্বক্ষণিক সহায়তা',
          'মক্কা ও মদিনার ঐতিহাসিক স্থানসমূহ (জাবালে নূর, কুবা মসজিদ) জিয়ারত',
          'হোটেলের সুস্বাদু বুফে প্রাতঃরাশ (নাস্তা)'
        ],
        highlightsEn: [
          'Direct international flights',
          'Premium 5-Star accommodations very close to female entrance gates',
          'Spacious family rooms',
          'Private A/C Coaster transfers for the family group',
          'Experienced companion guide for the Umrah ritual',
          'Complete historical site tours (Ziyarat) including Cave of Hira, Quba Mosque',
          'Buffet breakfast included'
        ]
      }
    ];

    for (const pkg of packagesData) {
      await prisma.package.create({ data: pkg });
    }
    console.log('Hajj and Umrah packages seeded.');
  }

  // 5. Seed FAQs
  const faqCount = await prisma.fAQ.count();
  if (faqCount === 0) {
    const faqs = [
      {
        question: 'সবুজ মিনার ট্রাভেল এজেন্সির সাথে কীভাবে প্যাকেজ বুক করব?',
        questionEn: 'How do I book a package with Sabuj Menar Travel Agency?',
        answer: 'আপনি যেকোনো প্যাকেজের নিচে থাকা "বুক করুন" বা "পরামর্শের জন্য আবেদন" বাটনে ক্লিক করে ফর্মটি পূরণ করুন। আপনার নাম, মোবাইল নম্বর এবং পছন্দসই ভ্রমণের মাস দিয়ে ফর্ম জমা দেওয়ার পর, ২৪ ঘণ্টার মধ্যে আমাদের অভিজ্ঞ হজ্জ ও ওমরাহ পরামর্শক আপনার সাথে যোগাযোগ করবেন এবং পরবর্তী প্রক্রিয়াগুলো বুঝিয়ে দেবেন।',
        answerEn: 'You can request a booking by clicking the "Book Now" or "Book Consultation" button on any package. Fill out your contact details, travel preferences, and preferred month, and one of our dedicated Hajj & Umrah consultants will call you within 24 hours to guide you through the registrations, passport submissions, and payment terms.',
        category: 'General',
        order: 1
      },
      {
        question: 'হজ্জ ও ওমরাহ নিবন্ধনের জন্য কী কী কাগজপত্র প্রয়োজন?',
        questionEn: 'What documents are required for Hajj & Umrah registration?',
        answer: 'নিবন্ধনের জন্য প্রয়োজন: (১) ভ্রমণের তারিখ থেকে কমপক্ষে ৬ মাস মেয়াদী এবং ন্যূনতম ২টি ফাঁকা পৃষ্ঠা সহ মূল পাসপোর্ট। (২) সাদা ব্যাকগ্রাউন্ডে তোলা পাসপোর্ট সাইজের ছবি। (৩) জাতীয় পরিচয়পত্র (NID) অথবা অনলাইন জন্ম সনদের ফটোকপি। (৪) নারী হজযাত্রীদের ক্ষেত্রে মাহরামের সম্পর্ক প্রমাণের প্রয়োজনীয় প্রমাণপত্র।',
        answerEn: 'You will need: (1) An original passport valid for at least 6 months from the travel date with at least 2 blank pages. (2) White background passport-sized photographs. (3) National ID (NID) copy or Birth Certificate copy. (4) Mahram relationship proof for female travelers (where applicable under current Saudi regulations).',
        category: 'Requirements',
        order: 2
      },
      {
        question: 'প্যাকেজের মূল্যের মধ্যে কি বিমান ভাড়া অন্তর্ভুক্ত আছে?',
        questionEn: 'Is international airfare included in the package prices?',
        answer: 'হ্যাঁ, আমাদের প্রতিটি হজ্জ ও ওমরাহ প্যাকেজে (ইকোনমি, স্ট্যান্ডার্ড, প্রিমিয়াম এবং ভিআইপি) ঢাকা থেকে জেদ্দা/মদিনা যাওয়া-আসার বিমান টিকিট (রিটার্ন টিকিট) প্যাকেজ মূল্যের মধ্যেই অন্তর্ভুক্ত রয়েছে। বিশেষ কোনো ব্যতিক্রম থাকলে তা বুকিংয়ের সময় জানিয়ে দেওয়া হবে।',
        answerEn: 'Yes, all of our advertised packages (Economy, Standard, Premium, and VIP) include return economy or business class international flight tickets from Dhaka to Jeddah/Madinah and back. Any exceptions (such as custom land-only packages) will be clearly indicated during the consultation.',
        category: 'Packages',
        order: 3
      },
      {
        question: 'প্যাকেজে কি প্রতিদিনের খাবার অন্তর্ভুক্ত থাকে?',
        questionEn: 'Is food included in the packages?',
        answer: 'হ্যাঁ, আমাদের প্রিমিয়াম, ভিআইপি এবং স্ট্যান্ডার্ড প্যাকেজগুলোতে হোটেলের সুস্বাদু বুফে ব্রেকফাস্ট, লাঞ্চ এবং ডিনার (৩ বেলা) অন্তর্ভুক্ত থাকে। ইকোনমি প্যাকেজের ক্ষেত্রে দেশীয় বাবুর্চি দ্বারা প্রস্তুতকৃত পুষ্টিকর খাবার সরবরাহ করা হয়। আপনি চাইলে খাবার ছাড়া প্যাকেজও কাস্টমাইজ করে নিতে পারেন।',
        answerEn: 'Yes, our Premium, VIP, and Standard packages include half-board (breakfast & dinner) or full-board (breakfast, lunch, dinner) buffet meals. For Economy packages, we offer high-quality set lunch/dinner catering services. You can also customize your package to exclude meals if you prefer to dine independently.',
        category: 'Packages',
        order: 4
      }
    ];

    for (const faq of faqs) {
      await prisma.fAQ.create({ data: faq });
    }
    console.log('FAQs seeded.');
  }

  // 6. Seed Testimonials
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    const testimonials = [
      {
        name: 'হাজী মোহাম্মদ রহমান',
        nameEn: 'Haji Mohammad Rahman',
        city: 'ঢাকা',
        cityEn: 'Dhaka',
        rating: 5,
        review: 'সবুজ মিনার ট্রাভেল এজেন্সির সাথে হজ্জ পালন করা আমার জীবনের সেরা সিদ্ধান্ত ছিল। তাদের গাইড ও শিক্ষাবিদদের গাইডেন্স অসাধারণ ছিল। মক্কা ও মদিনার হোটেলগুলো হারামের খুব কাছে এবং প্রতিশ্রুতি অনুযায়ী পেয়েছি। আল্লাহ তাদের উত্তম প্রতিদান দিন।',
        reviewEn: 'Performing Hajj with Sabuj Menar Travel Agency was an incredibly smooth experience. Their guides were extremely knowledgeable, helping us with every ritual. The hotels in Makkah and Madinah were exactly as promised, very close to the Haramain. May Allah reward them.'
      },
      {
        name: 'ডা. নুসরাত জাহান',
        nameEn: 'Dr. Nusrat Jahan',
        city: 'চট্টগ্রাম',
        cityEn: 'Chittagong',
        rating: 5,
        review: 'আমরা ১৪ দিনের ফ্যামিলি ওমরাহ প্যাকেজ নিয়েছিলাম। বৃদ্ধ মা-বাবা এবং ছোট সন্তানদের নিয়ে যাত্রা কিছুটা চিন্তার ছিল, কিন্তু সবুজ মিনারের টিম অসাধারণ সহযোগিতা করেছে। তাদের প্রাইভেট গাড়ি বেশ আরামদায়ক ছিল। পরিবারের সাথে ওমরাহর জন্য অত্যন্ত রেকমেন্ডেড।',
        reviewEn: 'We took the 14-days Family Umrah package. Traveling with elderly parents and children is stressful, but Sabuj Menar took care of everything. The private transport was comfortable, and the hotel staff was cooperative. Highly recommended for families.'
      }
    ];

    for (const test of testimonials) {
      await prisma.testimonial.create({ data: test });
    }
    console.log('Testimonials seeded.');
  }

  // 7. Seed Team Members
  const teamCount = await prisma.teamMember.count();
  if (teamCount === 0) {
    const team = [
      {
        name: 'আলহাজ্ব মো. সবুজ মিয়া',
        nameEn: 'Alhaj Md. Sabuj Mia',
        role: 'ব্যবস্থাপনা পরিচালক ও প্রতিষ্ঠাতা',
        roleEn: 'Managing Director & Founder',
        phone: '+880 1711 123456',
        email: 'sabuj@sabujmenar.com',
        bio: 'ধর্মীয় ট্যুর ও হজ্জ ব্যবস্থাপনায় দীর্ঘ ১৫ বছরের অভিজ্ঞতা। তিনি ব্যক্তিগতভাবে সৌদি আরবে হজযাত্রীদের সকল লজিস্টিকস সরাসরি তদারকি করেন।',
        bioEn: 'Over 15 years of experience managing religious tours. He personally monitors Hajj logistics in Saudi Arabia.'
      },
      {
        name: 'মুফতি আব্দুর রহমান',
        nameEn: 'Mufti Abdur Rahman',
        role: 'প্রধান আধ্যাত্মিক গাইড (হজ্জ লিডার)',
        roleEn: 'Chief Spiritual Guide (Hajj Leader)',
        phone: '+880 1712 987654',
        email: 'guide@sabujmenar.com',
        bio: 'আল-আজহার বিশ্ববিদ্যালয় থেকে গ্র্যাজুয়েট। তিনি হজ্জ ও ওমরাহ যাত্রীদের মাসয়ালা-মাসায়েল বিষয়ক ট্রেনিং পরিচালনা করেন এবং মক্কায় সরাসরি rituals সঠিক নিয়মে পরিচালনা করেন।',
        bioEn: 'Graduated from Al-Azhar University. Leads spiritual orientation sessions and provides step-by-step guidance in Makkah.'
      }
    ];

    for (const member of team) {
      await prisma.teamMember.create({ data: member });
    }
    console.log('Team members seeded.');
  }

  // 8. Seed Blog Posts
  const blogCount = await prisma.blogPost.count();
  if (blogCount === 0) {
    const blogs = [
      {
        title: 'সহজ ও সঠিক নিয়মে হজ্জ পালনের ধারাবাহিক গাইড',
        titleEn: 'Step-by-Step Guide to Performing Hajj',
        slug: 'step-by-step-guide-to-performing-hajj',
        summary: 'হজ্জ পালনের নিয়মাবলী, ইহরামের বিধান থেকে শুরু করে তাওয়াফে বিদা পর্যন্ত প্রতিটি ধাপের ধারাবাহিক আধ্যাত্মিক ও লজিস্টিক গাইড।',
        summaryEn: 'A comprehensive spiritual and logistical guide to performing Hajj, covering the rituals from Ihram to Tawaf Al-Wada.',
        content: '<p>হজ্জ ইসলামের অন্যতম স্তম্ভ, একটি জীবনের স্বপ্ন। হজ্জ তামাত্তু পালনের ধারাবাহিক ধাপগুলো নিচে আলোচনা করা হলো:</p><h3>১. এহরাম গ্রহণ</h3><p>হজযাত্রীরা মিকাত অতিক্রম করার পূর্বে এহরামের কাপড় পরিধান করে হজ্জের নিয়ত করেন এবং তালবিয়া পাঠ করেন: "লাব্বাইক আল্লাহুম্মা লাব্বাইক..."</p><h3>২. মিনায় অবস্থান (৮ই জিলহজ্জ)</h3><p>মিনায় তাঁবুতে অবস্থান করে যোহর, আসর, মাগরিব, এশা এবং জিলহজ্জের ৯ তারিখের ফজর নামাজ আদায় করতে হয়। এটি প্রার্থনার প্রস্তুতি দিন।</p><h3>৩. আরাফাতের ময়দানে অবস্থান (৯ই জিলহজ্জ)</h3><p>হজ্জের মূল রুকন। দুপুর থেকে সূর্যাস্ত পর্যন্ত আরাফাতের ময়দানে দাঁড়িয়ে আল্লাহর নিকট ক্রন্দন ও মোনাজাত করা আবশ্যক। আমরা হজযাত্রীদের জন্য আরাফাতে সম্পূর্ণ এসি তাঁবু ও বুফে খাবারের ব্যবস্থা করি।</p><h3>৪. মুজদালিফায় অবস্থান</h3><p>সূর্যাস্তের পর আরাফাত থেকে মুজদালিফায় গিয়ে মাগরিব ও এশা একসাথে আদায় করে খোলা আকাশের নিচে রাত্রিযাপন করতে হয় এবং শয়তানকে পাথর মারার জন্য কঙ্কর সংগ্রহ করতে হয়।</p>',
        contentEn: '<p>Hajj is one of the five pillars of Islam, a journey of a lifetime. Here is a step-by-step overview of the Hajj Tamattu rituals:</p><h3>1. Entering Ihram</h3><p>Pilgrims enter the state of Ihram before crossing the Miqat boundary. You declare your intention for Hajj and recite the Talbiyah: "Labbayk Allahumma Labbayk..."</p><h3>2. Staying in Mina (8th Dhul-Hijjah)</h3><p>You travel to Mina and stay in tents, performing Dhuhr, Asr, Maghrib, Isha, and Fajr prayers. It is a day of preparation and prayer.</p>',
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
        category: 'Hajj Guide',
        author: 'Mufti Abdur Rahman',
      },
      {
        title: 'ওমরাহ যাত্রীদের প্রয়োজনীয় চেক লিস্ট ও গোছানোর গাইড',
        titleEn: 'Essential Umrah Checklist & Packing Guide',
        slug: 'essential-umrah-checklist-and-packing-guide',
        summary: 'ওমরাহ ভ্রমণের আগে আপনার ব্যাগে কী কী ধর্মীয় ও ব্যক্তিগত জিনিসপত্র নেওয়া প্রয়োজন তার একটি সম্পূর্ণ তালিকা।',
        summaryEn: 'What to pack and how to prepare for your Umrah journey. Make sure you don\'t miss these religious and personal essentials.',
        content: '<p>ওমরাহ যাত্রা শান্তিপূর্ণ করতে গোছানো অত্যন্ত গুরুত্বপূর্ণ। আমাদের দীর্ঘ অভিজ্ঞতার আলোকে তৈরি এই লিস্টটি দেখে ব্যাগ গুছিয়ে নিন:</p><h3>ধর্মীয় জিনিসপত্র</h3><ul><li><strong>এহরামের কাপড়:</strong> পুরুষদের জন্য কমপক্ষে ২ সেট সাদা সুতি এহরামের কাপড় এবং একটি শক্ত কোমরবেল্ট।</li><li><strong>পকেট কোরআন ও দোয়ার বই:</strong> তাওয়াফ ও সাঈ করার সময় পাঠ করার মতো নির্ভরযোগ্য দোয়ার বই।</li></ul><h3>প্রয়োজনীয় কাগজপত্র</h3><ul><li><strong>পাসপোর্ট ও ই-ভিসার কপি:</strong> আপনার পাসপোর্ট এবং ওমরাহ ভিসার প্রিন্ট কপি সাথে রাখুন।</li><li><strong>সৌদি রিয়াল:</strong> বাংলাদেশ থেকেই কিছু রিয়াল এক্সচেঞ্জ করে নিন জরুরি কেনাকাটা (যেমন মোবাইল সিম) করার জন্য।</li></ul>',
        contentEn: '<p>Preparation is key to a peaceful Umrah. Our experienced coordinators have put together this essential checklist for your journey.</p><h3>Religious Essentials</h3><ul><li><strong>Ihram Sheets:</strong> Two sets of white, unstitched cotton/toweling sheets for men. A comfortable belt to secure the Ihram.</li></ul>',
        imageUrl: '/images/about-medina.png',
        category: 'Umrah Checklist',
        author: 'Kamrul Hasan',
      }
    ];

    for (const post of blogs) {
      await prisma.blogPost.create({ data: post });
    }
    console.log('Blogs seeded.');
  }

  // 9. Seed Gallery Items
  const galleryCount = await prisma.galleryItem.count();
  if (galleryCount === 0) {
    const gallery = [
      {
        imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=800',
        caption: 'পবিত্র মক্কার মসজিদুল হারাম প্রাঙ্গনে পবিত্র কাবা শরিফ',
        category: 'KAABA',
      },
      {
        imageUrl: '/images/about-medina.png',
        caption: 'পবিত্র মদিনার মসজিদে নববী শরিফ প্রাঙ্গন',
        category: 'NABAWI',
      },
      {
        imageUrl: '/images/about-hajj.png',
        caption: ' মসজিদুল হারামে ইবাদতরত ওমরাহ যাত্রীগণ',
        category: 'PILGRIMS',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1580501170961-c4238e8ecfb0?auto=format&fit=crop&q=80&w=800',
        caption: 'আমাদের ঢাকা অফিসে হজযাত্রীদের প্রশিক্ষণ কর্মশালা',
        category: 'ORIENTATION',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=800',
        caption: 'শাহজালাল আন্তর্জাতিক বিমানবন্দর থেকে হজযাত্রীদের প্রথম কাফেলার বিদায়',
        category: 'DEPARTURE',
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=800',
        caption: 'মদিনায় উহুদ পাহাড় জিয়ারত করার সময় আমাদের গ্রুপ হজযাত্রীগণ',
        category: 'TOURS',
      }
    ];

    for (const item of gallery) {
      await prisma.galleryItem.create({ data: item });
    }
    console.log('Gallery items seeded.');
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
