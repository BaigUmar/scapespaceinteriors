import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Instagram, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';
import { cn } from '../lib/utils';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#F9F8F6] border-b border-[#E5E1D8] shadow-[0_10px_30px_rgba(26,26,26,0.04)]">
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden scale-100 active:scale-95 transition-transform text-[#1A1A1A]"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <Link to="/" className="text-xl font-serif font-light tracking-[0.2em] text-[#1A1A1A] uppercase">
          scapespace.interiors
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6">
            <Link to="/" className="font-serif tracking-tight text-[#1A1A1A] hover:text-[#C5A059] transition-colors duration-300">Home</Link>
            <Link to="/discover" className="font-serif tracking-tight text-[#1A1A1A] hover:text-[#C5A059] transition-colors duration-300">Planner</Link>
            <Link to="/projects" className="font-serif tracking-tight text-[#1A1A1A] hover:text-[#C5A059] transition-colors duration-300">Gallery</Link>
          </nav>
          
          <div className="flex items-center gap-6 border-l border-brand-stone/20 pl-6">
            <div className="flex items-center gap-4 mr-2">
              <a 
                href="https://www.instagram.com/scapespace.interiors?igsh=YnJ0dmt5MjY0YWU0" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-charcoal hover:text-brand-gold transition-colors"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/918052910275" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-charcoal hover:text-brand-gold transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
            <a 
              href="https://wa.me/918052910275" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-brand-charcoal text-white px-6 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-brand-gold transition-colors hidden lg:block"
            >
              WhatsApp Consult
            </a>
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link to="/admin" className="text-brand-charcoal hover:scale-105 transition-transform">
                    <Settings className="w-5 h-5" />
                  </Link>
                )}
                <span className="text-sm font-medium">{profile?.displayName}</span>
                <button 
                  onClick={handleLogout}
                  className="text-brand-charcoal hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="scale-100 active:scale-95 transition-transform text-[#1A1A1A]">
                <User className="w-6 h-6" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-brand-cream border-b border-brand-stone/10 p-6 flex flex-col gap-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="font-serif text-lg">Home</Link>
          <Link to="/discover" onClick={() => setIsOpen(false)} className="font-serif text-lg">Planner</Link>
          <Link to="/projects" onClick={() => setIsOpen(false)} className="font-serif text-lg">Gallery</Link>
          <a 
            href="https://wa.me/918052910275" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-serif text-sm bg-brand-gold text-white px-6 py-3 text-center uppercase tracking-widest font-bold flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Consult
          </a>
          {user ? (
            <>
              {isAdmin && <Link to="/admin" onClick={() => setIsOpen(false)} className="font-serif text-lg flex items-center gap-2 text-brand-gold"><Settings className="w-4 h-4"/> Admin</Link>}
              <button 
                onClick={() => { handleLogout(); setIsOpen(false); }}
                className="font-serif text-lg text-left text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)} className="font-serif text-lg">Login</Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
