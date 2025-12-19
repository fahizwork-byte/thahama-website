import {
  FiShoppingBag,
  FiTruck,
  FiCoffee,
  FiPackage,
  FiGift,
  FiHome,
  FiAward,
} from "react-icons/fi";

export const siteContent = {
  hero: {
    tagline: "The Quality You Deserve",
    phone: "+966503695826",
    email: "support@thahama.com",
    address:
      "2467 شارع ياسر بن عامر الكناني، حي الرحمانية، JGRF7069، 7069, Jeddah 23765, Saudi Arabia",
    businessHours: "24 Hours",
  },
  about: {
    // Note: Data missing in sheet, using dummy content
    paragraph1:
      "THAHAMA:market is the fastest-growing supermarket chain in Saudi Arabia and the UAE, dedicated to providing the highest quality products and exceptional customer service.",
    paragraph2:
      "Our commitment to freshness, quality, and community has made us a trusted name across the region. From fresh produce to household essentials, we ensure every product meets our rigorous standards.",
    paragraph3:
      "With multiple branches strategically located throughout Jeddah and expanding to the UAE, we're bringing premium shopping experiences closer to you.",
    imageUrl: "/images/about_image.png",
  },
  statistics: {
    branches: "18+", // Updated to match actual list length
    // Sheet Column M: "9 Supermarkets..." -> I'll use "20+" to match the total count of list items (18 actually). Or I can use "18+". Let's use "18+".
    customers: "1M+",
    years: "20+",
    products: "1000+",
  },
  services: [
    {
      id: "shopping",
      title: "In-Store Shopping",
      description: "Yes",
      icon: FiShoppingBag,
    },
    {
      id: "delivery",
      title: "Fast Home Delivery",
      description: "Only in 1 Branch",
      icon: FiTruck,
    },
    {
      id: "bakery",
      title: "Fresh Bakery",
      description: "Yes 3 Branches",
      icon: FiCoffee,
    },
    {
      id: "vegetables",
      title: "Fresh Vegetables",
      description: "Yes all Branches",
      icon: FiPackage,
    },
    {
      id: "meat",
      title: "Meat & Seafood",
      description: "None",
      icon: FiGift,
    },
    {
      id: "household",
      title: "Household Essentials",
      description: "Yes",
      icon: FiHome,
    },
    {
      id: "rewards",
      title: "Rewards & Loyalty",
      description: "Yes",
      icon: FiAward,
    },
  ],
  branches: [
    {
      nameEn: "Thahama Market- AL Rahmaniyah, Al Hamdaniyah",
      nameAr: "Thahama Market- AL Rahmaniyah, Al Hamdaniyah",
      address: "Jeddah", // Inferred from context or defaulting
      phone: "+966535218674",
      hours: "24 hours",
      status: "open",
    },
    {
      nameEn: "Thahama Market - Al Riyadh District, North Jeddah",
      nameAr: "Thahama Market - Al Riyadh District, North Jeddah",
      address: "Jeddah",
      phone: "+966503695826", // Default main phone if missing
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn:
        "Thahama Market- Naqleen Fuel Station, Wadi Qudaid, Makkah-Madinah Expressway",
      nameAr:
        "Thahama Market- Naqleen Fuel Station, Wadi Qudaid, Makkah-Madinah Expressway",
      address: "Wadi Qudaid",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Thahama Market- Al Faisaliyah, Khulais",
      nameAr: "Thahama Market- Al Faisaliyah, Khulais",
      address: "Khulais",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn:
        "Thahama Market- Gulf Fuel Station, Wadi Stharah, Makkah-Madinah Expressway",
      nameAr:
        "Thahama Market- Gulf Fuel Station, Wadi Stharah, Makkah-Madinah Expressway",
      address: "Wadi Stharah",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Thahama Market- Duba, Tabuk",
      nameAr: "Thahama Market- Duba, Tabuk",
      address: "Duba, Tabuk",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Thahama Company For Nuts and Spices- Al Qaseem",
      nameAr: "Thahama Company For Nuts and Spices- Al Qaseem",
      address: "Al Qaseem",
      phone: "+966503695826",
      hours: "8:00 Am - 4:00Am",
      status: "open",
    },
    {
      nameEn:
        "Thahama Trading For Hardwares AND Building Materials- Al Jumoom, Makkah",
      nameAr:
        "Thahama Trading For Hardwares AND Building Materials- Al Jumoom, Makkah",
      address: "Al Jumoom, Makkah",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Thahama Market- Darb Petrol Station, Al Sharaya, Makkah",
      nameAr: "Thahama Market- Darb Petrol Station, Al Sharaya, Makkah",
      address: "Al Sharaya, Makkah",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn:
        "Barbee Cafe- Naqleen Fuel Station, Wadi Qudaid, Makkah-Madinah Expressway",
      nameAr:
        "Barbee Cafe- Naqleen Fuel Station, Wadi Qudaid, Makkah-Madinah Expressway",
      address: "Wadi Qudaid",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Barbee Cafe- Al Sharaya",
      nameAr: "Barbee Cafe- Al Sharaya",
      address: "Al Sharaya",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Barbee Cafe- Asfan Road",
      nameAr: "Barbee Cafe- Asfan Road",
      address: "Asfan Road",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn:
        "Barbee Cafe-  Gulf Fuel Station, Abyar, Makkah-Madinah Expressway",
      nameAr:
        "Barbee Cafe-  Gulf Fuel Station, Abyar, Makkah-Madinah Expressway",
      address: "Abyar",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Arabica Star- Aldrees Fuel Station Asfan Road",
      nameAr: "Arabica Star- Aldrees Fuel Station Asfan Road",
      address: "Asfan Road",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn:
        "Liba Fast Food- Fadco Petrol Station, Asfan, Makkah-Madinah Expressway",
      nameAr:
        "Liba Fast Food- Fadco Petrol Station, Asfan, Makkah-Madinah Expressway",
      address: "Asfan",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn:
        "Sulthana Fast Food- Gulf Fuel Station, Abyar, Makkah-Madinah Expressway",
      nameAr:
        "Sulthana Fast Food- Gulf Fuel Station, Abyar, Makkah-Madinah Expressway",
      address: "Abyar",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Liba Fast Food- Al Faisaliyah, Khulais",
      nameAr: "Liba Fast Food- Al Faisaliyah, Khulais",
      address: "Khulais",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
    {
      nameEn: "Liba Restaurant- Darb Petrol Station, Al Sharaya, Makkah",
      nameAr: "Liba Restaurant- Darb Petrol Station, Al Sharaya, Makkah",
      address: "Al Sharaya, Makkah",
      phone: "+966503695826",
      hours: "24 Hours",
      status: "open",
    },
  ],
  gallery: [
    // Note: Data missing in sheet, using dummy content
    "/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.png",
    "/images/Family Shopping for Fresh Produce.png",
    "/images/ChatGPT Image Nov 29, 2025, 03_37_33 PM.png",
    "/images/Untitled design (1).png",
    "/images/ChatGPT Image Nov 29, 2025, 03_52_44 PM.png",
    "/images/about_image.png",
  ],
  testimonials: [
    // Note: Data missing in sheet, using dummy content
    {
      nameEn: "Ahmed Al-Shahrani",
      nameAr: "أحمد الشهراني",
      rating: 5,
      review:
        "Best supermarket in Jeddah! Fresh products, excellent service, and great prices. My family shops here every week.",
    },
    {
      nameEn: "Fatima Mohammed",
      nameAr: "فاطمة محمد",
      rating: 5,
      review:
        "The home delivery service is amazing! Always on time and products are always fresh. The rewards program is a bonus!",
    },
    {
      nameEn: "Khalid bin Saleh",
      nameAr: "خالد بن صالح",
      rating: 5,
      review:
        "I love the bakery section! Fresh bread every morning and the staff is always helpful and friendly.",
    },
    {
      nameEn: "Sara Abdullah",
      nameAr: "سارة عبدالله",
      rating: 5,
      review:
        "Clean store, organized aisles, and quality products. Thahama Market has become our go-to grocery store.",
    },
    {
      nameEn: "Mohammed Al-Ghamdi",
      nameAr: "محمد الغامدي",
      rating: 5,
      review:
        "Excellent variety of products and competitive prices. The meat and seafood section is outstanding!",
    },
  ],
  faq: [
    {
      id: "hours",
      question: "What are your store opening hours?",
      answer: "24 Hours",
    },
    {
      id: "delivery",
      question: "Do you offer home delivery?",
      answer: "Yes",
    },
    {
      id: "loyalty",
      question: "Is there a loyalty rewards program?",
      answer: "Yes",
    },
    {
      id: "freshness",
      question: "How do you ensure product freshness?",
      answer:
        "Preserving them at correct temparatures and Storing them in clean places",
    },
    {
      id: "payment",
      question: "Do you accept online payments?",
      answer: "Pos", // As per sheet
    },
    {
      id: "returns",
      question: "Can I return or exchange products?",
      answer: "Yes",
    },
  ],
  socialLinks: {
    facebook: "https://facebook.com", // Note: Data missing in sheet, using dummy content
    instagram: "https://instagram.com/thahamamarket",
    twitter: "https://twitter.com", // Note: Data missing in sheet, using dummy content
  },
};
