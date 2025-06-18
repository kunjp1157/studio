
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, ArrowLeft, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);

    toast({
      title: 'Password Reset Email Sent',
      description: `If an account exists for ${email}, you will receive password reset instructions.`,
    });
    router.push('/account/login'); 
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Forgot Your Password?</CardTitle>
          <CardDescription>No worries! Enter your email address below and we'll send you instructions to reset your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email"><Mail className="inline mr-2 h-4 w-4 text-muted-foreground" />Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Send className="mr-2 h-5 w-5" />}
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <Link href="/account/login" className="font-medium text-primary hover:underline flex items-center">
            <ArrowLeft className="inline h-4 w-4 mr-1" /> Back to Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
