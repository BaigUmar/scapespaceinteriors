import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { Project } from '../types';
import { handleFirestoreError, OperationType } from '../lib/error-handler';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'), 
      where('status', '==', 'public'), 
      orderBy('order', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="pt-32 pb-20 px-6 md:px-margin max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs font-semibold tracking-widest text-brand-gold uppercase mb-2 block"
        >
          CURATED PORTFOLIO
        </motion.span>
        <h1 className="text-4xl md:text-5xl font-serif text-brand-charcoal mb-4">Spatial Explorations</h1>
        <p className="text-brand-stone max-w-2xl leading-relaxed">
          A collection of our residential and commercial projects, where architectural precision meets bespoke interior craftsmanship.
        </p>
      </div>

      {loading ? (
        <div className="text-brand-stone italic">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-brand-stone/20 rounded-sm">
          <p className="text-brand-stone italic">Our portfolio is currently being updated. Please check back shortly.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden border border-brand-stone/10 transition-all duration-500 group-hover:border-brand-gold">
                <img 
                  alt={project.title}
                  className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  src={project.imageUrl}
                />
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">{project.category}</span>
                  <span className="text-xs text-brand-stone">{project.year}</span>
                </div>
                <h3 className="text-xl font-serif text-brand-charcoal mt-2 group-hover:text-brand-gold transition-colors">{project.title}</h3>
                <p className="text-sm text-brand-stone mt-3 line-clamp-3 leading-relaxed">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
