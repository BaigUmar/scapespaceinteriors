import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Home as HomeIcon, Layout, ChevronRight, Info, Plus, Minus, MessageCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { Idea } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

const Estimator: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'home' | 'kitchen' | 'wardrobe'>('home');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'ideas'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setIdeas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Idea)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'ideas');
    });
    return () => unsubscribe();
  }, []);

  const filteredIdeas = ideas.filter(idea => idea.category === activeCategory);
  
  const totalPrice = selectedOptions.reduce((sum, id) => {
    const idea = ideas.find(i => i.id === id);
    return sum + (idea?.price || 0);
  }, 0);

  const basePrice = activeCategory === 'home' ? 500000 : activeCategory === 'kitchen' ? 150000 : 80000;

  const toggleOption = (id: string) => {
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const categories = [
    { id: 'home', title: 'Full Home', icon: HomeIcon },
    { id: 'kitchen', title: 'Modular Kitchen', icon: Layout },
    { id: 'wardrobe', title: 'Wardrobes', icon: ChevronRight }
  ];

  if (loading) return <div className="pt-32 px-margin text-brand-stone">Loading planning tool...</div>;

  return (
    <div className="pt-32 pb-20 px-6 md:px-margin max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-semibold tracking-widest text-brand-gold uppercase mb-2 block"
        >
          DESIGN CALCULATOR
        </motion.span>
        <h1 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-4">Space Planner</h1>
        <p className="text-brand-stone max-w-2xl">
          Explore design ideas and get instant estimates for your space transformations. 
          Select a category to start customizing your vision.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-brand-stone/20 mb-12">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id as any);
              setSelectedOptions([]);
            }}
            className={`flex items-center gap-2 px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all relative ${
              activeCategory === cat.id ? 'text-brand-charcoal' : 'text-brand-stone hover:text-brand-gold'
            }`}
          >
            {cat.title}
            {activeCategory === cat.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-[2px] bg-brand-gold"
              />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Ideas Grid */}
        <div className="lg:col-span-2">
          {filteredIdeas.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-brand-stone/20 rounded-sm">
              <p className="text-brand-stone italic">No options available for this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredIdeas.map((idea) => (
                  <motion.div
                    key={idea.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`border rounded-sm overflow-hidden transition-all duration-300 ${
                      selectedOptions.includes(idea.id) ? 'border-brand-gold ring-1 ring-brand-gold' : 'border-brand-stone/10'
                    }`}
                  >
                    <div className="aspect-video overflow-hidden">
                      <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover grayscale-[0.2]" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-serif text-brand-charcoal">{idea.title}</h3>
                        <span className="text-sm font-medium text-brand-gold">₹{idea.price.toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-brand-stone mb-6 line-clamp-2">{idea.description}</p>
                      <button
                        onClick={() => toggleOption(idea.id)}
                        className={`w-full py-3 rounded-sm text-xs font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                          selectedOptions.includes(idea.id)
                            ? 'bg-brand-charcoal text-white'
                            : 'border border-brand-stone/20 text-brand-stone hover:border-brand-gold hover:text-brand-gold'
                        }`}
                      >
                        {selectedOptions.includes(idea.id) ? (
                          <><Minus className="w-3 h-3" /> Remove from Plan</>
                        ) : (
                          <><Plus className="w-3 h-3" /> Add to Plan</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Estimate Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-[#fbf9f8] border border-brand-stone/10 p-8 rounded-sm">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="text-brand-gold w-5 h-5" />
              <h2 className="text-xl font-serif text-brand-charcoal">Estimate Summary</h2>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-brand-stone">Base Package (Est.)</span>
                <span className="text-brand-charcoal font-medium">₹{basePrice.toLocaleString()}</span>
              </div>
              
              {selectedOptions.map(id => {
                const idea = ideas.find(i => i.id === id);
                return (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={id} 
                    className="flex justify-between text-sm"
                  >
                    <span className="text-brand-stone">{idea?.title}</span>
                    <span className="text-brand-charcoal">₹{idea?.price.toLocaleString()}</span>
                  </motion.div>
                );
              })}

              <div className="h-[1px] bg-brand-stone/10 my-4"></div>
              
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-semibold tracking-widest text-brand-gold uppercase block mb-1">TOTAL ESTIMATE</span>
                  <span className="text-2xl font-serif text-brand-charcoal">₹{(basePrice + totalPrice).toLocaleString()}*</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-sm mb-8 flex gap-3">
              <Info className="w-5 h-5 text-brand-gold shrink-0" />
              <p className="text-[10px] text-brand-stone leading-relaxed uppercase tracking-wider">
                *ESTIMATES ARE APPROXIMATE AND BASED ON STANDARD DIMENSIONS. FINAL PRICING MAY VARY BASED ON SITE MEASUREMENTS AND SPECIFIC MATERIAL CHOICE.
              </p>
            </div>

            <div className="space-y-4">
              <a 
                href="/#consult"
                className="w-full bg-brand-charcoal text-white py-4 rounded-sm font-medium tracking-widest uppercase hover:bg-brand-gold transition-colors block text-center"
              >
                Book Free Consult
              </a>
              <a 
                href="https://wa.me/918052910275"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-brand-charcoal text-brand-charcoal py-4 rounded-sm font-medium tracking-widest uppercase hover:bg-brand-charcoal hover:text-white transition-all block text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estimator;
