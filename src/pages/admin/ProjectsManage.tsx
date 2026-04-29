import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Project } from '../../types';
import { Trash2, Plus, Edit2, X } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../../lib/error-handler';

const ProjectsManage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '', category: '', year: new Date().getFullYear().toString(), price: '', description: '', imageUrl: '', status: 'public', order: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'projects');
    });
    return () => unsubscribe();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Remove id from the payload to avoid Firestore errors
      const { id, ...dataToSave } = newProject as Project & { id?: string };
      
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), dataToSave);
        setEditingId(null);
      } else {
        await addDoc(collection(db, 'projects'), { ...dataToSave, order: projects.length });
      }
      setIsAdding(false);
      setNewProject({ title: '', category: '', year: '2024', price: '', description: '', imageUrl: '', status: 'public', order: 0 });
    } catch (err) {
      handleFirestoreError(err, editingId ? OperationType.UPDATE : OperationType.CREATE, 'projects');
    }
  };

  const handleEdit = (project: Project) => {
    setNewProject(project);
    setEditingId(project.id);
    setIsAdding(true);
  };

  const toggleStatus = async (project: Project) => {
    try {
      await updateDoc(doc(db, 'projects', project.id), {
        status: project.status === 'public' ? 'draft' : 'public'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${project.id}`);
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setDeletingId(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `projects/${id}`);
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
          onClick={() => {
            setEditingId(null);
            setNewProject({ title: '', category: '', year: new Date().getFullYear().toString(), price: '', description: '', imageUrl: '', status: 'public', order: projects.length });
            setIsAdding(true);
          }}
          className="bg-brand-charcoal text-white flex items-center gap-2 px-6 py-3 rounded-sm font-medium tracking-widest uppercase hover:bg-brand-gold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-white border border-brand-gold p-8 mb-12 shadow-md">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-serif">{editingId ? 'Edit Project' : 'New Project'}</h2>
            <button type="button" onClick={() => setIsAdding(false)}><X/></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input required placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} className="border-b py-2"/>
            <input required placeholder="Category" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})} className="border-b py-2"/>
            <input required placeholder="Year" value={newProject.year} onChange={e => setNewProject({...newProject, year: e.target.value})} className="border-b py-2"/>
            <input placeholder="Price (Optional)" value={newProject.price} onChange={e => setNewProject({...newProject, price: e.target.value})} className="border-b py-2"/>
            <input required placeholder="Image URL" value={newProject.imageUrl} onChange={e => setNewProject({...newProject, imageUrl: e.target.value})} className="border-b py-2"/>
            <textarea required placeholder="Description" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} className="border-b py-2 md:col-span-2 h-24"/>
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
                {deletingId === project.id ? (
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="bg-red-600 text-white px-3 py-1 text-[10px] font-bold uppercase rounded-sm hover:bg-red-700 transition-colors"
                    >
                      Confirm
                    </button>
                    <button 
                      onClick={() => setDeletingId(null)}
                      className="text-brand-stone text-[10px] font-bold uppercase hover:text-brand-charcoal transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button 
                      onClick={() => handleEdit(project)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Edit Details"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => toggleStatus(project)}
                      className={`px-3 py-1 text-[10px] font-bold tracking-tighter uppercase border rounded-full transition-all ${
                        project.status === 'public' 
                          ? 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white' 
                          : 'border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white'
                      }`}
                    >
                      {project.status === 'public' ? 'Live' : 'Draft'}
                    </button>
                    <button 
                      onClick={() => setDeletingId(project.id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsManage;
