
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define supported languages
export type SupportedLanguage = 'en' | 'hi' | 'ta' | 'te' | 'mr';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  translate: (key: string) => string;
}

const defaultLanguage: SupportedLanguage = 'en';

// Expanded translations for the entire application
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Common UI elements
    home: 'Home',
    login: 'Login',
    signup: 'Sign Up',
    profile: 'View Profile',
    savedProviders: 'Saved Providers',
    logout: 'Logout',
    searchPlaceholder: 'Search legal professionals...',
    resources: 'Legal Resources',
    articles: 'Articles',
    faqs: 'FAQs',
    templates: 'Templates',
    language: 'Language',
    
    // Provider details page
    backToResults: 'Back to Results',
    providerNotFound: 'Provider Not Found',
    providerNotExist: 'The legal service provider you\'re looking for doesn\'t exist or has been removed.',
    browseAll: 'Browse All Providers',
    errorLoading: 'Error loading provider',
    couldNotLoad: 'Could not load provider details. Please try again.',
    saveProvider: 'Save Provider',
    providerSaved: 'Provider Saved',
    providerInfo: 'Provider Information',
    practiceArea: 'Practice Area',
    experience: 'Experience',
    languages: 'Languages',
    rating: 'Rating',
    responseTime: 'Response Time',
    location: 'Location',
    address: 'Address',
    district: 'District',
    call: 'Call',
    message: 'Message',
    about: 'About',
    expertise: 'Expertise',
    similarProviders: 'AI Recommended Similar Providers',
    viewAll: 'View All',
    
    // Booking dialog
    selectService: 'Select Service',
    selectDate: 'Select a Date',
    chooseTime: 'Choose a Time',
    consultationDetails: 'Consultation Details',
    confirmBooking: 'Confirm Your Booking',
    bookingSubmitted: 'Booking Submitted',
    chooseService: 'Choose the service you need',
    scheduleWith: 'Schedule a consultation with',
    selectTimeSlot: 'Select an available time slot',
    provideDetails: 'Please provide additional details for your consultation',
    reviewAppointment: 'Please review your appointment details',
    bookingReceived: 'Your appointment request has been received',
    processing: 'Processing your request...',
    selectToView: 'Select a date to view available time slots',
    back: 'Back',
    continue: 'Continue',
    confirm: 'Confirm Booking',
    done: 'Done',
    inPerson: 'In Person',
    videoCall: 'Video Call',
    phoneCall: 'Phone Call',
    notes: 'Notes (optional)',
    addDetails: 'Add any details or questions you\'d like to discuss during your appointment.',
    with: 'with',
    
    // Resource details
    linkCopied: 'Link copied!',
    resourceLinkCopied: 'Resource link has been copied to clipboard.',
    downloadStarted: 'Download started',
    isBeingDownloaded: 'is being downloaded.',
    share: 'Share',
    copied: 'Copied!',
    download: 'Download',
    print: 'Print',
  },
  
  hi: {
    // Common UI elements
    home: 'होम',
    login: 'लॉगिन',
    signup: 'साइन अप',
    profile: 'प्रोफ़ाइल देखें',
    savedProviders: 'सहेजे गए प्रदाता',
    logout: 'लॉग आउट',
    searchPlaceholder: 'कानूनी पेशेवरों की खोज करें...',
    resources: 'कानूनी संसाधन',
    articles: 'लेख',
    faqs: 'सामान्य प्रश्न',
    templates: 'टेम्पलेट',
    language: 'भाषा',
    
    // Provider details page
    backToResults: 'परिणामों पर वापस जाएं',
    providerNotFound: 'प्रदाता नहीं मिला',
    providerNotExist: 'आप जिस कानूनी सेवा प्रदाता की तलाश कर रहे हैं, वह मौजूद नहीं है या हटा दिया गया है।',
    browseAll: 'सभी प्रदाताओं को ब्राउज़ करें',
    errorLoading: 'प्रदाता लोड करने में त्रुटि',
    couldNotLoad: 'प्रदाता विवरण लोड नहीं किया जा सका। कृपया पुनः प्रयास करें।',
    saveProvider: 'प्रदाता को सहेजें',
    providerSaved: 'प्रदाता सहेज लिया गया',
    providerInfo: 'प्रदाता की जानकारी',
    practiceArea: 'अभ्यास क्षेत्र',
    experience: 'अनुभव',
    languages: 'भाषाएँ',
    rating: 'रेटिंग',
    responseTime: 'प्रतिक्रिया समय',
    location: 'स्थान',
    address: 'पता',
    district: 'जिला',
    call: 'कॉल करें',
    message: 'संदेश',
    about: 'बारे में',
    expertise: 'विशेषज्ञता',
    similarProviders: 'AI अनुशंसित समान प्रदाता',
    viewAll: 'सभी देखें',
    with: 'के साथ',
    
    // Booking dialog
    selectService: 'सेवा चुनें',
    selectDate: 'एक तारीख चुनें',
    chooseTime: 'एक समय चुनें',
    consultationDetails: 'परामर्श विवरण',
    confirmBooking: 'अपनी बुकिंग की पुष्टि करें',
    bookingSubmitted: 'बुकिंग सबमिट की गई',
    chooseService: 'आपको जिस सेवा की आवश्यकता है उसे चुनें',
    scheduleWith: 'के साथ परामर्श शेड्यूल करें',
    
    // Resource details
    linkCopied: 'लिंक कॉपी किया गया!',
    resourceLinkCopied: 'संसाधन लिंक क्लिपबोर्ड पर कॉपी किया गया है।',
    downloadStarted: 'डाउनलोड शुरू हो गया',
    isBeingDownloaded: 'डाउनलोड हो रहा है।',
    share: 'शेयर करें',
    copied: 'कॉपी किया गया!',
    download: 'डाउनलोड करें',
    print: 'प्रिंट करें',
  },
  
  ta: {
    // Common UI elements
    home: 'முகப்பு',
    login: 'உள்நுழைய',
    signup: 'பதிவு செய்யுங்கள்',
    profile: 'சுயவிவரம் காண',
    savedProviders: 'சேமித்த வழங்குநர்கள்',
    logout: 'வெளியேறு',
    searchPlaceholder: 'சட்ட நிபுணர்களைத் தேடுங்கள்...',
    resources: 'சட்ட ஆதாரங்கள்',
    articles: 'கட்டுரைகள்',
    faqs: 'அடிக்கடி கேட்கப்படும் கேள்விகள்',
    templates: 'வார்ப்புருக்கள்',
    language: 'மொழி',
    with: 'உடன்',
    
    // Provider details page
    backToResults: 'முடிவுகளுக்குத் திரும்பு',
    providerNotFound: 'வழங்குநர் கிடைக்கவில்லை',
    providerNotExist: 'நீங்கள் தேடும் சட்ட சேவை வழங்குநர் இல்லை அல்லது அகற்றப்பட்டது.',
    browseAll: 'அனைத்து வழங்குநர்களையும் உலாவு',
    
    // Resource details
    linkCopied: 'இணைப்பு நகலெடுக்கப்பட்டது!',
    resourceLinkCopied: 'ஆதார இணைப்பு கிளிப்போர்டுக்கு நகலெடுக்கப்பட்டது.',
    downloadStarted: 'பதிவிறக்கம் தொடங்கியது',
    isBeingDownloaded: 'பதிவிறக்கப்படுகிறது.',
    share: 'பகிர்',
    copied: 'நகலெடுக்கப்பட்டது!',
    download: 'பதிவிறக்கு',
    print: 'அச்சிடு',
  },
  
  te: {
    // Common UI elements
    home: 'హోమ్',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    profile: 'ప్రొఫైల్ చూడండి',
    savedProviders: 'సేవ్ చేసిన ప్రొవైడర్లు',
    logout: 'లాగౌట్',
    searchPlaceholder: 'న్యాయ నిపుణులను శోధించండి...',
    resources: 'చట్టపరమైన వనరులు',
    articles: 'వ్యాసాలు',
    faqs: 'తరచుగా అడిగే ప్రశ్నలు',
    templates: 'టెంప్లేట్లు',
    language: 'భాష',
    with: 'తో',
    
    // Resource details
    linkCopied: 'లింక్ కాపీ చేయబడింది!',
    resourceLinkCopied: 'వనరు లింక్ క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది.',
    downloadStarted: 'డౌన్‌లోడ్ ప్రారంభమైంది',
    isBeingDownloaded: 'డౌన్‌లోడ్ అవుతోంది.',
    share: 'షేర్ చేయండి',
    copied: 'కాపీ చేయబడింది!',
    download: 'డౌన్‌లోడ్',
    print: 'ముద్రించు',
  },
  
  mr: {
    // Common UI elements
    home: 'मुख्यपृष्ठ',
    login: 'लॉगिन',
    signup: 'साइन अप',
    profile: 'प्रोफाइल पाहा',
    savedProviders: 'जतन केलेले प्रदाते',
    logout: 'लॉगआउट',
    searchPlaceholder: 'कायदेशीर व्यावसायिकांचा शोध घ्या...',
    resources: 'कायदेशीर संसाधने',
    articles: 'लेख',
    faqs: 'सामान्य प्रश्न',
    templates: 'टेम्पलेट्स',
    language: 'भाषा',
    with: 'सह',
    
    // Resource details
    linkCopied: 'लिंक कॉपी केली!',
    resourceLinkCopied: 'संसाधन लिंक क्लिपबोर्डवर कॉपी केली आहे.',
    downloadStarted: 'डाउनलोड सुरू झाले',
    isBeingDownloaded: 'डाउनलोड होत आहे.',
    share: 'शेअर करा',
    copied: 'कॉपी केले!',
    download: 'डाउनलोड करा',
    print: 'प्रिंट करा',
  },
};

export const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  hi: 'हिंदी (Hindi)',
  ta: 'தமிழ் (Tamil)',
  te: 'తెలుగు (Telugu)',
  mr: 'मराठी (Marathi)',
};

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  translate: (key) => key,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const savedLanguage = localStorage.getItem('userLanguage') as SupportedLanguage;
    return savedLanguage || defaultLanguage;
  });

  const setLanguage = (newLanguage: SupportedLanguage) => {
    localStorage.setItem('userLanguage', newLanguage);
    setLanguageState(newLanguage);
  };

  const translate = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};
