import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google did not return an ID token. Please try again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/auth/google/login', {
        token: credentialResponse.credential,
      });

      const token = response.data?.token;
      if (token) {
        localStorage.setItem('adminToken', token);
        localStorage.setItem('loginTime', Date.now().toString());
        navigate('/dashboard');
      } else {
        setError('Dashboard token was not returned. Make sure backend Google dashboard login returns `{ token }`.');
      }
    } catch (err) {
      setError('Google dashboard sign-in failed. Use your invited Google account or the configured bootstrap admin email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <div className="flex w-full flex-col justify-between px-6 py-8 sm:px-10 lg:w-1/2 lg:px-14 lg:py-12">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/login')}
              className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200 transition hover:border-indigo-400/60 hover:text-white"
            >
              Back to app login
            </button>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
              Exclusive Access
            </span>
          </div>

          <div className="my-10 max-w-xl">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-indigo-300">Dashboard access</p>
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Sign in with Google to access the analytics lounge.
            </h1>
            <p className="mt-5 text-base leading-7 text-slate-300">
              Normal app users still use username or email plus password. Dashboard access is reserved for invited
              team members and the bootstrap admin account.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">Google-only dashboard sign-in</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">Invite-based onboarding</span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">Bootstrap admin supported</span>
              </div>

              <div className="mt-6 space-y-4">
                <p className="text-sm text-slate-300">
                  If you were invited, use the invite link from your email. If you are the initial admin, sign in
                  here with the configured Google account.
                </p>

                <div className="inline-flex rounded-2xl bg-white p-3">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google sign-in was cancelled or failed. Please try again.')}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="pill"
                    width="300"
                  />
                </div>

                {isLoading && <p className="text-sm text-indigo-200">Verifying your Google identity...</p>}
                {error && <p className="text-sm text-rose-300">{error}</p>}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400">
            Invited team members should open their email invite to complete onboarding through Google.
          </p>
        </div>

        <div className="relative hidden lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.35),_transparent_40%),radial-gradient(circle_at_bottom,_rgba(251,191,36,0.18),_transparent_35%)]" />
          <div className="relative flex w-full items-end p-14">
            <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-300">InsightLooms</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">A private analytics workspace for invited stakeholders.</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <p className="text-sm text-slate-400">Access model</p>
                  <p className="mt-2 text-lg font-medium text-white">Google identity + role-aware dashboard token</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
                  <p className="text-sm text-slate-400">Audience</p>
                  <p className="mt-2 text-lg font-medium text-white">Admins and advertisers invited into the workspace</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;