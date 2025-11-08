
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIInfoModal from './AIInfoModal';
import { Toaster } from '@/components/ui/toaster';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect } from 'react';

const Layout = () => {
  const { language } = useLanguage();
  
  // Apply language-specific CSS classes to the body
  useEffect(() => {
    document.body.className = `lang-${language}`;
    
    // Set lang attribute on html tag
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted/50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="fade-in">
          <Outlet />
        </div>
      </main>
      <div className="fixed bottom-4 right-4 z-50">
        <AIInfoModal />
      </div>
      <Footer />
      <Toaster />
    </div>
  );
};

export default Layout;
