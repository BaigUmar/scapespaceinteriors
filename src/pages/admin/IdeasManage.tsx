import React, { useState, useEffect } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Idea } from '../../types';
import { Trash2, Plus, Edit2, X } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

const IdeasManage: React.FC = () => {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newIdea, setNewIdea] = useState<Partial<Idea>>({
    title: '', category: 'home', price: 0, description: '', imageUrl: ''
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...dataToSave } = newIdea as Idea & { id?: string };
      const ideaData = {
        ...dataToSave,
        price: Number(newIdea.price),
        createdAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDoc(doc(db, 'ideas', editingId), ideaData);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'ideas'), ideaData);
      }
      setIsAdding(false);
      setNewIdea({ title: '', category: 'home', price: 0, description: '', imageUrl: '' });
    } catch (err) {
      handleFirestoreError(err, editingId ? OperationType.UPDATE : OperationType.CREATE, 'ideas');
    }
  };

  const handleEdit = (idea: Idea) => {
    setNewIdea(idea);
    setEditingId(idea.id);
    setIsAdding(true);
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'ideas', id));
      setDeletingId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `ideas/${id}`);
    }
  };

  if (loading) return <div className="p-8">Loading ideas...</div>;

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-serif text-brand-charcoal">Design Ideas & Pricing</h1>
          <p className="text-brand-stone">Manage estimator options and modification prices.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null);
            setNewIdea({ title: '', category: 'home', price: 0, description: '', imageUrl: '' });
            setIsAdding(true);
          }}
          className="bg-brand-charcoal text-white flex items-center gap-2 px-6 py-3 rounded-sm font-medium tracking-widest uppercase hover:bg-brand-gold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Idea
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white border border-brand-gold p-8 mb-12 shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif">{editingId ? 'Edit Idea' : 'New Idea'}</h2>
            <button type="button" onClick={() => setIsAdding(false)}><X/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input 
              placeholder="Title" 
              className="border p-4 w-full" 
              value={newIdea.title} 
              onChange={e => setNewIdea({...newIdea, title: e.target.value})}
              required
            />
            <select 
              className="border p-4 w-full" 
              value={newIdea.category} 
              onChange={e => setNewIdea({...newIdea, category: e.target.value as any})}
              required
            >
              <option value="home">Full Home</option>
              <option value="kitchen">Modular Kitchen</option>
              <option value="wardrobe">Wardrobe</option>
            </select>
            <input 
              placeholder="Price (Number)" 
              type="number"
              className="border p-4 w-full" 
              value={newIdea.price} 
              onChange={e => setNewIdea({...newIdea, price: Number(e.target.value)})}
              required
            />
            <input 
              placeholder="Image URL" 
              className="border p-4 w-full" 
              value={newIdea.imageUrl} 
              onChange={e => setNewIdea({...newIdea, imageUrl: e.target.value})}
              required
            />
            <textarea 
              placeholder="Description" 
              className="border p-4 w-full md:col-span-2 h-32" 
              value={newIdea.description} 
              onChange={e => setNewIdea({...newIdea, description: e.target.value})}
            />
          </div>
          <button className="mt-8 bg-brand-charcoal text-white px-8 py-4 w-full uppercase tracking-widest font-bold">
            {editingId ? 'Save Changes' : 'Publish Idea'}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ideas.map(idea => (
          <div key={idea.id} className="bg-white border border-brand-stone/10 overflow-hidden flex flex-col">
            <div className="aspect-video bg-gray-100">
              <img src={idea.imageUrl} alt={idea.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">{idea.category}</span>
                <span className="text-sm font-medium text-brand-charcoal">₹{idea.price.toLocaleString()}</span>
              </div>
              <h3 className="text-xl font-serif text-brand-charcoal mb-4">{idea.title}</h3>
              <div className="flex gap-4 mt-auto">
                {deletingId === idea.id ? (
                  <div className="flex items-center gap-3 w-full">
                    <button 
                      onClick={() => handleDelete(idea.id)}
                      className="flex-1 bg-red-600 text-white py-2 text-[10px] font-bold uppercase rounded-sm hover:bg-red-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => setDeletingId(null)}
                      className="flex-1 border border-brand-stone/20 py-2 text-[10px] font-bold uppercase text-brand-stone hover:text-brand-charcoal transition-colors text-center"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleEdit(idea)}
                      className="flex-1 border border-brand-stone/20 py-2 text-xs font-semibold uppercase tracking-widest hover:border-brand-gold hover:text-brand-gold transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                    <button 
                      onClick={() => setDeletingId(idea.id)}
                      className="p-2 border border-brand-stone/20 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Idea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IdeasManage;
