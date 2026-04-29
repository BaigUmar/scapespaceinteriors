import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { ConsultationRequest } from '../../types';
import { CheckCircle, Clock, Trash2, Mail } from 'lucide-react';

const ConsultationsManage: React.FC = () => {
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'consultations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ConsultationRequest)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (id: string, newStatus: ConsultationRequest['status']) => {
    try {
      await updateDoc(doc(db, 'consultations', id), { status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this request?')) return;
    try {
      await deleteDoc(doc(db, 'consultations', id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Inquiries</h1>
        <p className="text-brand-stone">Customer consultation requests.</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-6">
          {requests.length === 0 && <div className="text-center py-20 bg-white border border-brand-stone/10 text-brand-stone">No requests found.</div>}
          {requests.map(req => (
            <div key={req.id} className="bg-white p-8 border border-brand-stone/10 shadow-sm relative group hover:border-brand-gold transition-colors">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      req.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
                      req.status === 'contacted' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-xs text-brand-stone uppercase tracking-widest">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-brand-charcoal">{req.customerEmail}</h3>
                    <p className="text-brand-stone mt-2 italic">"{req.message}"</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => updateStatus(req.id, 'contacted')}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-full transition-colors"
                    title="Mark as Contacted"
                  >
                    <Mail size={20} />
                  </button>
                  <button 
                    onClick={() => updateStatus(req.id, 'completed')}
                    className="p-2 hover:bg-green-50 text-green-600 rounded-full transition-colors"
                    title="Mark as Completed"
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(req.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsultationsManage;
