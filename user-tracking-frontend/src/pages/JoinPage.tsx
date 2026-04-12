import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invitationToken = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [invitedEmail, setInvitedEmail] = useState('');

  useEffect(() => {
    if (!invitationToken) {
      setError('No invitation token found.');
      setIsLoading(false);
      return;
    }

    const verifyToken = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/invite/join/verify?invitationToken=${invitationToken}`);
        setInvitedEmail(response.data); // Assume the API returns the invited email on success
      } catch (err) {
        setError('This invitation is invalid or has expired.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
  }, [invitationToken]);

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential || !invitationToken) {
      setError('Missing invitation or Google credential. Please reopen your invite link.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/api/invite/finalize', {
        invitationToken,
        googleIdToken: credentialResponse.credential,
      });

      const appToken = response.data?.token;
      if (!appToken) {
        setError('Invitation was verified, but no dashboard token was returned. Backend finalize should return `{ token }`.');
        return;
      }

      localStorage.setItem('adminToken', appToken);
      localStorage.setItem('loginTime', Date.now().toString());
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to finalize invitation. The Google account may not match the invited email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-950 px-6 py-24 text-center text-slate-300">Verifying your invitation...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 px-6 py-24">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-rose-400/20 bg-white/5 p-8 text-center text-white backdrop-blur">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-200">Invitation error</p>
          <h1 className="mt-4 text-3xl font-semibold">We could not complete dashboard onboarding.</h1>
          <p className="mt-4 text-slate-300">{error}</p>
          <button
            onClick={() => navigate('/dashboard/login')}
            className="mt-8 rounded-full border border-white/10 px-5 py-3 text-sm text-slate-100 transition hover:border-indigo-400/60"
          >
            Go to dashboard sign-in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-10 lg:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Invitation confirmed</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">You have been invited to the private dashboard workspace.</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Continue with the exact Google account that received the invite. Once the backend returns your dashboard
              token, you will be taken directly into the analytics experience.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <p className="text-sm text-slate-400">Invited account</p>
              <p className="mt-2 text-xl font-medium text-white">{invitedEmail}</p>
              <p className="mt-3 text-sm text-slate-400">
                If you use a different Google identity, the invitation should be rejected by the backend.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl sm:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-amber-200">Secure onboarding</p>
            <h2 className="mt-4 text-2xl font-semibold">Continue with Google</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              We use your Google identity to confirm the invite and exchange it for a dashboard access token.
            </p>

            <div className="mt-8 inline-flex rounded-2xl bg-white p-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google sign-in failed. Please try again.')}
                theme="filled_black"
                size="large"
                text="continue_with"
                shape="pill"
                width="300"
              />
            </div>

            {isSubmitting && <p className="mt-4 text-sm text-indigo-200">Finalizing your dashboard access...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinPage;