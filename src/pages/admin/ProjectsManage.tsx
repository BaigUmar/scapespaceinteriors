import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Project } from '../../types';
import { Trash2, Plus, Edit2, Save, X } from 'lucide-react';

const ProjectsManage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '', category: '', year: '2024', price: '', description: '', imageUrl: '', status: 'draft', order: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'projects'), { ...newProject, order: projects.length });
      setIsAdding(false);
      setNewProject({ title: '', category: '', year: '2024', price: '', description: '', imageUrl: '', status: 'draft', order: 0 });
    } catch (err) {
      console.error(err);
      alert('Failed to add project');
    }
  };

  const toggleStatus = async (project: Project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id), {
        status: project.status === 'public' ? 'draft' : 'public'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Projects</h1>
          <p className="text-brand-stone">Manage your portfolio works.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-brand-charcoal text-white flex items-center gap-2 px-6 py-3 rounded-sm font-medium tracking-widest uppercase hover:bg-brand-gold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white border border-brand-gold p-8 mb-12 shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif">New Project</h2>
            <button type="button" onClick={() => setIsAdding(false)}><X/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="border-b py-2"/>
            <input required placeholder="Category" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="border-b py-2"/>
            <input required placeholder="Year" value={newProject.year} onChange={e => setNewProject({...newProject, year: e.target.value})} className="border-b py-2"/>
            <input placeholder="Price (e.g. $5,000)" value={newProject.price} onChange={e => setNewProject({...newProject, price: e.target.value})} className="border-b py-2"/>
            <input required placeholder="Image URL" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} className="border-b py-2"/>
            <textarea placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="border-b py-2 md:col-span-2 h-24"/>
          </div>
          <button className="mt-8 bg-brand-charcoal text-white px-12 py-4 rounded-sm tracking-widest uppercase">Save Project</button>
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white p-6 border border-brand-stone/10 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-gold transition-colors">
              <img src={project.imageUrl} className="w-32 h-32 object-cover grayscale group-hover:grayscale-0" alt={project.title} />
              <div className="flex-grow">
                <h3 className="text-xl font-serif">{project.title}</h3>
                <p className="text-sm text-brand-stone">{project.category} • {project.year} {project.price && `• ${project.price}`}</p>
                <div className="mt-2 text-xs font-semibold uppercase tracking-widest">
                  Status: <span className={project.status === 'public' ? 'text-green-600' : 'text-orange-600'}>{project.status}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => toggleStatus(project)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title={project.status === 'public' ? 'Set to Draft' : 'Publish'}
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManage;
