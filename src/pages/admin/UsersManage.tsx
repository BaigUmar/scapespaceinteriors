import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, query, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../../types';
import { Shield, ShieldAlert, User } from 'lucide-react';

const UsersManage: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data() } as UserProfile)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleRole = async (user: UserProfile) => {
    const newRole: UserRole = user.role === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Change ${user.displayName}'s role to ${newRole}?`)) return;
    
    try {
      await updateDoc(doc(db, 'users', user.uid), { role: newRole });
    } catch (err) {
      console.error(err);
      alert('Permission denied or update failed');
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-brand-charcoal mb-2">Users</h1>
        <p className="text-brand-stone">Manage user roles and permissions.</p>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white border border-brand-stone/10 rounded-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-stone/10 bg-gray-50">
                <th className="p-4 text-xs font-semibold tracking-widest text-brand-stone uppercase">User</th>
                <th className="p-4 text-xs font-semibold tracking-widest text-brand-stone uppercase">Email</th>
                <th className="p-4 text-xs font-semibold tracking-widest text-brand-stone uppercase">Role</th>
                <th className="p-4 text-xs font-semibold tracking-widest text-brand-stone uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.uid} className="border-b border-brand-stone/10 hover:bg-brand-cream/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-charcoal text-white flex items-center justify-center text-xs">
                        {user.displayName.charAt(0)}
                      </div>
                      <span className="font-medium">{user.displayName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-brand-stone">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleRole(user)}
                      className="text-xs font-semibold tracking-widest text-brand-gold uppercase hover:opacity-70 flex items-center gap-2"
                    >
                      {user.role === 'admin' ? <ShieldAlert size={14}/> : <Shield size={14}/>} 
                      Toggle Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManage;
