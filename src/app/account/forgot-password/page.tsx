
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { AnimatedGridBackground } from '@/components/layout/AnimatedGridBackground';
import { Key } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Password Reset Link Sent',
        description: `If an account exists for ${email}, a reset link has been sent.`,
        className: 'bg-green-500 text-white',
      });
      router.push('/account/login');
    }, 1500);
  };

  return (
    <div className="auth-page">
      <AnimatedGridBackground />
      <div className="auth-box">
        <div className="auth-container">
          <div className="auth-form-wrapper">
            <h2 className="auth-title flex items-center gap-2">
              <Key />
              <span>Reset Password</span>
            </h2>
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <button type="submit" className="auth-submit" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size={20} /> : 'Send Reset Link'}
              </button>
              <div className="auth-group">
                <Link href="/account/login">Remembered your password?</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
