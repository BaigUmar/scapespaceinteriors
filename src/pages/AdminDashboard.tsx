import React from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, MessageSquare, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

const AdminDashboard: React.FC = () => {
  const cards = [
    { title: 'Project Management', desc: 'Manage gallery items and status', icon: FileText, link: '/admin/projects', color: 'bg-blue-50' },
    { title: 'User Management', desc: 'Control roles and access levels', icon: Users, link: '/admin/users', color: 'bg-purple-50' },
    { title: 'Inquiries', desc: 'Manage consultation requests', icon: MessageSquare, link: '/admin/consultations', color: 'bg-green-50' },
  ];

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Admin Dashboard</h1>
        <p className="text-brand-stone">System configuration and data management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -5 }}
            className="group relative bg-white border border-brand-stone/10 p-8 shadow-sm"
          >
            <div className={`w-12 h-12 ${card.color} flex items-center justify-center mb-6`}>
              <card.icon className="w-6 h-6 text-brand-charcoal" />
            </div>
            <h3 className="text-xl font-serif mb-2">{card.title}</h3>
            <p className="text-sm text-brand-stone mb-8">{card.desc}</p>
            
            <Link 
              to={card.link}
              className="flex items-center gap-2 text-xs font-semibold tracking-widest text-brand-gold uppercase hover:opacity-70 transition-opacity"
            >
              Configure <ChevronRight className="w-3 h-3" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
