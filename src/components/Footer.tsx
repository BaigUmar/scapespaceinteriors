import React from 'react';
import { Home, LayoutGrid, Calendar, PencilRuler, Instagram, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <>
      <footer className="bg-[#F9F8F6] py-lg border-t border-brand-stone/10">
        <div className="max-w-7xl mx-auto px-margin flex flex-col md:flex-row justify-between items-center gap-lg">
          <div className="text-lg font-serif font-light tracking-[0.2em] text-[#1A1A1A] uppercase">
            scapespace.interiors
          </div>
          <div className="flex gap-lg">
            <a className="flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-stone hover:text-brand-gold transition-colors" href="https://www.instagram.com/scapespace.interiors?igsh=YnJ0dmt5MjY0YWU0" target="_blank" rel="noopener noreferrer">
              <Instagram className="w-4 h-4" /> INSTAGRAM
            </a>
            <a className="flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-stone hover:text-brand-gold transition-colors" href="https://wa.me/918052910275" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" /> WHATSAPP
            </a>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-brand-stone opacity-50">
            © 2024 scapespace. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-[#F9F8F6] border-t border-[#E5E1D8] shadow-[0_-5px_20px_rgba(26,26,26,0.02)]">
        <a className="flex flex-col items-center justify-center text-[#C5A059] font-semibold relative" href="/">
          <Home className="w-5 h-5" />
          <span className="font-serif text-[10px] uppercase tracking-widest mt-1">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#1A1A1A] opacity-70 hover:opacity-100 transition-all font-semibold" href="#services">
          <PencilRuler size={20} />
          <span className="font-serif text-[10px] uppercase tracking-widest mt-1">Services</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#1A1A1A] opacity-70 hover:opacity-100 transition-all font-semibold" href="#projects">
          <LayoutGrid size={20} />
          <span className="font-serif text-[10px] uppercase tracking-widest mt-1">Gallery</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#1A1A1A] opacity-70 hover:opacity-100 transition-all font-semibold" href="#consult">
          <Calendar size={20} />
          <span className="font-serif text-[10px] uppercase tracking-widest mt-1">Bookings</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#1A1A1A] opacity-70 hover:opacity-100 transition-all font-semibold" href="https://wa.me/918052910275" target="_blank" rel="noopener noreferrer">
          <MessageCircle size={20} />
          <span className="font-serif text-[10px] uppercase tracking-widest mt-1">WhatsApp</span>
        </a>
      </nav>
    </>
  );
};

export default Footer;
