import { useState } from 'react';
import { KeyRound, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const ChangePasswordCard = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (newPassword.length < 6) {
      setError('Your new password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('The new passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        throw new Error('Please sign in again before changing your password.');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: sessionData.session.user.email,
        password: currentPassword,
      });
      if (signInError) throw new Error('Your current password is incorrect.', { cause: signInError });

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage('Password updated successfully.');
    } catch (caughtError) {
      setError(caughtError.message || 'Unable to update your password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <KeyRound size={16} className="text-orange-500" />
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Change Password</h2>
      </div>
      {message && <p className="mb-3 text-sm font-semibold text-emerald-700">{message}</p>}
      {error && <p className="mb-3 text-sm font-semibold text-red-700">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input type={showPasswords ? 'text' : 'password'} value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} placeholder="Current password" autoComplete="current-password" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
        <input type={showPasswords ? 'text' : 'password'} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} placeholder="New password" autoComplete="new-password" required className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
        <div className="flex gap-2">
          <input type={showPasswords ? 'text' : 'password'} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Confirm password" autoComplete="new-password" required className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
          <button type="button" onClick={() => setShowPasswords((value) => !value)} className="rounded-xl border border-slate-200 px-3 text-slate-500 hover:bg-slate-50" aria-label={showPasswords ? 'Hide passwords' : 'Show passwords'}>{showPasswords ? <EyeOff size={17} /> : <Eye size={17} />}</button>
        </div>
        <button type="submit" disabled={loading} className="sm:col-span-3 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Updating…' : 'Update Password'}</button>
      </form>
    </section>
  );
};

export default ChangePasswordCard;
