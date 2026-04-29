import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Project } from '../types';

const Home: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'), 
      where('status', '==', 'public'), 
      orderBy('order', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjectsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });
    return () => unsubscribe();
  }, []);

  const handleConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'consultations'), {
        customerName: 'Visitor',
        customerEmail: email,
        message: 'Request via Newsletter/Hero Footer',
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setSubmitted(true);
      setEmail('');
    } catch (error) {
      console.error("Error submitting consultation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const specializations = [
    {
      title: "Modular Kitchen",
      desc: "Precision-engineered culinary sanctuaries.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCaNkzIKxDY8N77FL1ELaGgtOLa10LCd5PNxCiykqNJQQ7ECsSOOGDZ_wkXk1fAE7f3s2sqkSTMrBqVrep07vZVue1KkaxK1YQ7s9Lm7ixLw0JBmuy542bTgEV5OeUtiaKOawNvksfeadAT3A-uVd3hvlHYm6dtJ7NfzsMPXKM6hhyKXW2ocJsq94wLyEX1Q1ZPTdIIXN_BMDq0TX96Wfk5yHt5zFwtKQ4fsikeUOv6gmj6oZJk6LLd_tneHR1KU-Mj9WVRKqkmsgI"
    },
    {
      title: "Wardrobes",
      desc: "Bespoke storage systems for modern living.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIrKwusca3Eq3-FaBua7agyHnmFBpF_n6WpAcDpLvsopO74pcUcBeqCdGHKLfYPcv9jnKlL3Iq6T_lrtw3RIxJxJ5heAbexnrV_7ZnxNdJREpkzRtbKS7Ec7-lVXH9ya2sV89iDZShYcrlP1hzy7H6ngcU9zmhzfnxxCrn080PbIHHpQBCxVvqChCVXUUMwQ1eaklKMqqonAx8AJkXPM0OkGo_7blJ32yuew29l2hlo-7GrM_GArpT8GnqnoYmT1iBFSJOB-S7YAQ"
    },
    {
      title: "Full Home",
      desc: "Complete spatial transformation & design.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-G2tGDZ_r-ObsSNgiF-Wx9qpglQ475Pm0YIuGXTPjb6FxfQKsxHlTV9H7oSReCeHAzIq2UsJZ43_3UMzO1XFtCzhvARtrgSkjSU8RfkCFPI-RxP8TE_kJGS46Zqvboz9wINxdjuSq3i2A5i1yiO6kfyeD8dN0KP16kxQZpTcPc4HJHahOgnHPSekQur3WKiwqyw_joIukCJct2_gx1j-SzEyGrdF63OUqYArSSXx3wPf56vAvlrvYCPvITKGzBc3ftFmdbrRJ1GY"
    }
  ];

  const displayProjects = projectsList.length > 0 ? projectsList : [
    {
      id: '1',
      title: "Project Zenith",
      category: "RESIDENTIAL / 2023",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5r4gWsNxSJw3TyITYzLyVGom0R2da1SxkqZ6TE3zRxN0cmH9Ual3YQtSUWP1_x_g9hyzOd6z35oh3gGWB0iB1a-mrL_trKdky_UxYMrWlDWMhlwBenaM10SJKjsajg2JocHedAAc5xCSY8cAunzBpn53NU8C4sk3rhSYeedC_1TH9RkPW6nxEoteg5xDgQ6ynZDagOoHQZOP5n3Uiq8aImmW9Cbcndqf3Lys8q3qLPgnoeosda4SUW0CLftLg4nOrerLqGK_mdnc"
    },
    {
      id: '2',
      title: "The Gilded Kitchen",
      category: "INTERIOR ARCHITECTURE / 2024",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7aFJHX_xVajD3bLCFthx6paFufPymiRWdCp3DUzAXLD4OoKz-VlPEdyJr5NVJXCFgR6ZxFMIJexgLw47M0dgkokSjc3sIBVLuD8E6DQySX-2G6MF5OVbpLK5_V2sGoYnrQ_99LaMECnx6CmGE02aIYnE4rWHqF0goDSD2Lyi5O3Lwehja_yz0Dj2j58dvRgWPy9jdt88GB55Kb0Y8weg1irQ5xkLkCEtNe4yqLdywo_O38aEkzqQYN0aX0W04iEEk0QxfjbwLVLM"
    }
  ];

  return (
    <div className="pt-16 pb-20 md:pb-0">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-hidden py-24 md:py-32 bg-[#fbf9f8]">
        <div className="relative z-10 text-center px-6 md:px-margin max-w-4xl">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold tracking-widest text-brand-gold uppercase mb-2 block"
          >
            ESTABLISHED 2024
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif text-brand-charcoal mb-8 leading-tight"
          >
            Architectural Serenity & Bespoke Interior Design
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-brand-stone mx-auto mb-12 max-w-3xl leading-relaxed"
          >
            We specialize in creating intentional, high-end residential spaces that balance architectural precision with the warmth of a curated home. Our approach is defined by a commitment to minimalist luxury and structural harmony.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center"
          >
            <a 
              href="#consult"
              className="bg-brand-charcoal text-white px-12 py-4 rounded-sm font-medium tracking-widest uppercase hover:bg-brand-gold transition-colors duration-300"
            >
              START CONSULTATION
            </a>
          </motion.div>
        </div>
      </section>

      {/* Specializations */}
      <section id="services" className="py-20 px-6 md:px-margin max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-brand-charcoal">Our Specializations</h2>
          <div className="h-[2px] w-12 bg-brand-gold mx-auto mt-4"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {specializations.map((item, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden border border-brand-stone/10 mb-6 transition-all duration-500 group-hover:border-brand-gold">
                <img 
                  alt={item.title}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  src={item.img}
                />
              </div>
              <h3 className="text-xl font-serif text-brand-charcoal group-hover:text-brand-gold transition-colors">{item.title}</h3>
              <p className="text-sm text-brand-stone mt-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Methodology */}
      <section className="bg-[#efeded] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-margin">
          <div className="mb-12">
            <span className="text-xs font-semibold tracking-widest text-brand-gold uppercase">OUR METHODOLOGY</span>
            <h2 className="text-3xl font-serif text-brand-charcoal mt-2">The scapespace Process</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 border-l border-brand-stone/20 pl-4 md:border-l-0 md:pl-0">
            {[
              { num: "01", title: "Consult", desc: "An in-depth dialogue to understand your spatial needs, lifestyle patterns, and aesthetic aspirations." },
              { num: "02", title: "Plan", desc: "Architectural drafting and material selection curated for structural harmony and functional longevity." },
              { num: "03", title: "Build", desc: "Seamless execution by master craftsmen, ensuring every detail aligns with our minimalist vision." }
            ].map((step, idx) => (
              <div key={idx} className="relative md:pt-4">
                <div className="hidden md:block absolute top-0 left-0 w-full h-[1px] bg-brand-stone/20"></div>
                <div className="flex items-start gap-4">
                  <span className="text-5xl font-serif text-brand-gold opacity-20">{step.num}</span>
                  <div>
                    <h4 className="text-xl font-serif text-brand-charcoal mb-2">{step.title}</h4>
                    <p className="text-md text-brand-stone">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selected Projects */}
      <section id="projects" className="py-20 px-6 md:px-margin max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif text-brand-charcoal">Selected Projects</h2>
            <p className="text-md text-brand-stone mt-2">A curation of our recent spatial explorations.</p>
          </div>
          <button className="text-xs font-semibold tracking-widest text-brand-gold underline underline-offset-8 hover:opacity-70 transition-all uppercase">VIEW ALL PROJECTS</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project: any, idx) => (
            <motion.div key={idx} className="group">
              <div className="aspect-video overflow-hidden mb-6 shadow-[0_10px_30px_rgba(26,26,26,0.04)] border border-brand-stone/10">
                <img 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src={project.imageUrl || project.img}
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-brand-gold uppercase">{project.category}</span>
                  <h4 className="text-xl font-serif text-brand-charcoal mt-1">{project.title}</h4>
                </div>
                {project.price && (
                  <span className="text-sm font-semibold text-brand-charcoal bg-brand-gold/10 px-3 py-1 rounded-full">
                    {project.price}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section id="consult" className="bg-brand-charcoal text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-serif mb-12">Let's craft your space.</h2>
          {submitted ? (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-brand-gold font-serif text-xl"
            >
              Thank you. We will be in touch shortly.
            </motion.div>
          ) : (
            <form onSubmit={handleConsultation} className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <input 
                required
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-b border-white/20 text-white font-medium tracking-widest w-full md:w-80 py-4 focus:border-brand-gold focus:outline-none transition-colors placeholder:text-white/40 uppercase text-xs"
              />
              <button 
                disabled={isSubmitting}
                className="bg-brand-gold text-white px-12 py-4 rounded-sm font-medium tracking-widest uppercase hover:bg-white hover:text-brand-charcoal transition-colors w-full md:w-auto disabled:opacity-50"
              >
                {isSubmitting ? 'SENDING...' : 'GET STARTED'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
