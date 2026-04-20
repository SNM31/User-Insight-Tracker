import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getDashboardRole, isTokenValid } from '../utils/tokenUtils';

type InviteRole = 'ROLE_ADMIN' | 'ROLE_ADVERTISER';

interface InviteRow {
  email: string;
  role: InviteRole;
}

const ROLE_OPTIONS: { value: InviteRole; label: string }[] = [
  { value: 'ROLE_ADVERTISER', label: 'Advertiser' },
  { value: 'ROLE_ADMIN', label: 'Admin' },
];

const emptyRow = (): InviteRow => ({ email: '', role: 'ROLE_ADVERTISER' });

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const InvitesPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const role = useMemo(() => getDashboardRole(token), [token]);
  const isAdmin = role === 'ROLE_ADMIN';

  const [rows, setRows] = useState<InviteRow[]>([emptyRow()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successEmails, setSuccessEmails] = useState<string[]>([]);

  useEffect(() => {
    if (!token || !isTokenValid(token)) {
      navigate('/dashboard/login', { replace: true });
    }
  }, [token, navigate]);

  const updateRow = (index: number, patch: Partial<InviteRow>) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, emptyRow()]);
  };

  const removeRow = (index: number) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setSuccessEmails([]);

    const normalized = rows.map((row) => ({
      email: row.email.trim(),
      role: row.role,
    }));

    if (normalized.some((row) => !row.email)) {
      setError('Every row needs an email address.');
      return;
    }

    const invalid = normalized.find((row) => !isValidEmail(row.email));
    if (invalid) {
      setError(`"${invalid.email}" is not a valid email address.`);
      return;
    }

    if (normalized.some((row) => row.role !== 'ROLE_ADMIN' && row.role !== 'ROLE_ADVERTISER')) {
      setError('Role must be Admin or Advertiser.');
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/admin/invite/send', normalized, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccessEmails(normalized.map((row) => row.email));
      setRows([emptyRow()]);
    } catch (err) {
      let message = 'Failed to send invites. Please try again.';
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          message = 'Your session does not have permission to send invites. Sign in again as an admin.';
        } else if (typeof err.response?.data === 'string' && err.response.data.trim()) {
          message = err.response.data;
        }
      }
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-rose-400/20 bg-white/5 p-10 text-center backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-200">Access denied</p>
          <h1 className="mt-4 text-3xl font-semibold">Admins only.</h1>
          <p className="mt-4 text-slate-300">
            Only workspace admins can send new invitations. If you believe this is a mistake, contact an existing admin.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-8 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-100 transition hover:border-indigo-400/60"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-indigo-400/60 hover:text-white"
          >
            Back to dashboard
          </button>
          <span className="rounded-full border border-indigo-300/30 bg-indigo-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-indigo-200">
            Admin tools
          </span>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-xl sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Invite team</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight">Onboard new dashboard members.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Add one row per invitee. Each person receives an email with a one-time link that exchanges their Google
            identity for a dashboard token with the role you assign.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 sm:grid-cols-[minmax(0,1fr)_200px_auto] sm:items-end"
              >
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-400">Email</label>
                  <input
                    type="email"
                    value={row.email}
                    onChange={(e) => updateRow(index, { email: e.target.value })}
                    placeholder="teammate@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400/60 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs uppercase tracking-[0.25em] text-slate-400">Role</label>
                  <select
                    value={row.role}
                    onChange={(e) => updateRow(index, { role: e.target.value as InviteRole })}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-white focus:border-indigo-400/60 focus:outline-none"
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-rose-300/60 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={addRow}
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-indigo-400/60 hover:text-white"
              >
                Add another
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send invites'}
              </button>
            </div>

            {error && (
              <p className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            )}
            {successEmails.length > 0 && (
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                <p className="font-medium">Invites sent:</p>
                <ul className="mt-1 list-disc pl-5">
                  {successEmails.map((email) => (
                    <li key={email}>{email}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default InvitesPage;
