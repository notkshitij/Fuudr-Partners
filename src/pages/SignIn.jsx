import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthLayout from '../components/AuthLayout';
import { supabase } from '../supabaseClient';

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('partnerUser');
      if (stored) {
        const user = JSON.parse(stored);
        if (!user.opening_time) {
          navigate('/partner/setup-profile', { replace: true });
        } else {
          navigate('/partner/dashboard', { replace: true });
        }
      }
    } catch {
      // Ignore
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const cleanEmail = formData.email.trim().toLowerCase();

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (error || !data) {
        throw new Error('No account found with this email. Please sign up first.');
      }

      // Simple password check via RPC (or direct comparison if stored as plain text in prototype)
      // Try Supabase Auth sign in first
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: formData.password,
      });

      if (authError) {
        // Fallback: check password field directly (for prototype builds using register_partner)
        if (data.password !== formData.password) {
          throw new Error('Incorrect password. Please try again.');
        }
      }

      localStorage.setItem('partnerUser', JSON.stringify(data));

      if (!data.opening_time) {
        navigate('/partner/setup-profile', { replace: true });
      } else {
        navigate('/partner/dashboard', { replace: true });
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout title="Welcome Back" subtitle="Sign in to your partner account">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-800">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-400 pointer-events-none" size={17} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2.5 pl-9 pr-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 text-sm transition duration-200 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                placeholder="restaurant@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-800">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400 pointer-events-none" size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2.5 pl-9 pr-10 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 text-sm transition duration-200 focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-orange-500 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 active:translate-y-0 hover:-translate-y-px transition-all shadow-[0_4px_6px_-1px_rgba(249,115,22,0.2)] hover:shadow-[0_6px_8px_-1px_rgba(249,115,22,0.3)] mt-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            {!loading && <ArrowRight size={17} />}
          </button>

          <div className="text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/partner/signup" className="text-orange-500 font-semibold hover:text-orange-600 transition-colors">
              Register here
            </Link>
          </div>
        </form>
      </AuthLayout>
    </>
  );
};

export default SignIn;
