import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 border border-brand-stone/10 shadow-sm"
      >
        <h2 className="text-3xl font-serif text-brand-charcoal mb-8 text-center uppercase tracking-widest">Sign In</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-4 mb-6 text-sm border-l-2 border-red-600">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold tracking-widest text-brand-stone uppercase mb-2">Email Address</label>
            <input 
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-brand-stone/20 py-2 focus:border-brand-gold outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest text-brand-stone uppercase mb-2">Password</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-brand-stone/20 py-2 focus:border-brand-gold outline-none transition-colors"
            />
          </div>
          
          <button 
            disabled={loading}
            className="w-full bg-brand-charcoal text-white py-4 rounded-sm font-medium tracking-widest uppercase hover:bg-brand-gold transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b w-1/5 lg:w-1/4"></span>
          <span className="text-xs text-center text-brand-stone uppercase">or</span>
          <span className="border-b w-1/5 lg:w-1/4"></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mt-6 w-full flex items-center justify-center gap-3 border border-brand-stone/20 py-4 rounded-sm font-medium tracking-widest uppercase hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 1.18 7.06L5.84 9.9c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {loading ? 'Processing...' : 'Continue with Google'}
        </button>
        
        <p className="mt-8 text-center text-sm text-brand-stone">
          Don't have an account? <Link to="/register" className="text-brand-gold hover:underline">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
