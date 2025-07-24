
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Send, ArrowLeft, MountainSnow } from 'lucide-react';
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
    <div className="flex items-center justify-center min-h-screen p-4 auth-background">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden animate-fadeInUp bg-card/80 backdrop-blur-lg border-primary/20">
        <CardHeader className="text-center p-8 bg-primary/10">
          <MountainSnow className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-headline text-foreground">Forgot Password?</CardTitle>
          <CardDescription className="text-muted-foreground">We'll send you a link to reset it.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12 rounded-full bg-secondary/50 border-border focus:bg-background focus:border-primary"
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-base font-bold" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} /> : <Send className="mr-2"/>}
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="p-6 justify-center text-sm border-t border-primary/20">
          <Link href="/account/login" className="font-bold text-primary hover:underline flex items-center">
            <ArrowLeft className="inline h-4 w-4 mr-1" /> Back to Log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
