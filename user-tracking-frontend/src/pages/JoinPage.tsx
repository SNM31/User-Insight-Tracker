// src/pages/JoinPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const JoinPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const invitationToken = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [invitedEmail, setInvitedEmail] = useState('');

  // Step 1: Verify the invitation token as soon as the page loads
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

  // Step 2: Handle the Google login and finalize the invitation
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      // Send both tokens to the backend
      const response = await axios.post('http://localhost:8080/api/invitations/finalize', {
        invitationToken: invitationToken,
        googleToken: credentialResponse.credential,
      });

      // On success, save the app's JWT and redirect
      const appToken = response.data.token;
      localStorage.setItem('adminToken', appToken);
      navigate('/dashboard');

    } catch (err) {
      setError('Failed to finalize invitation. The Google account may not match the invited email.');
    }
  };

  // Render different states based on verification status
  if (isLoading) {
    return <div>Verifying your invitation...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>You're invited to join!</h1>
      <p>Please sign in with your Google account ({invitedEmail}) to continue.</p>
      
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => setError('Google login failed.')}
      />
    </div>
  );
};

export default JoinPage;