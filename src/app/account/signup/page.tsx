
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Mail, KeyRound, User, ArrowRight, Eye, EyeOff, MountainSnow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { addUser, getUserByEmail } from '@/lib/data';
import { UserRole, UserStatus } from '@/lib/types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        title: 'Weak Password',
        description: 'Password should be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);

    try {
      const userExists = await getUserByEmail(email);
      if (userExists) {
        toast({
            title: 'Account Already Exists',
            description: 'An account with this email already exists. Please log in instead.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await addUser({
        id: firebaseUser.uid,
        name,
        email,
        role: 'User' as UserRole,
        status: 'Active' as UserStatus,
        joinedAt: new Date().toISOString(),
        achievements: [],
        favoriteFacilities: [],
        isProfilePublic: true,
        loyaltyPoints: 0,
        teamIds: [],
        skillLevels: [],
      });

      toast({
        title: 'Signup Successful!',
        description: 'Your account has been created. You can now log in.',
        className: 'bg-green-500 text-white',
      });
      router.push('/account/login');

    } catch (error: any) {
      console.error("Signup Error:", error);
      let description = 'An unexpected error occurred. Please try again.';
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email address is already in use by another account.';
      } else if (error.code === 'auth/weak-password') {
        description = 'The password is too weak. Please choose a stronger password.';
      }
      toast({
        title: 'Signup Failed',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 auth-background">
      <Card className="w-full max-w-md shadow-2xl overflow-hidden animate-fadeInUp">
        <CardHeader className="text-center p-8 bg-pink-500/10 backdrop-blur-sm">
          <MountainSnow className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-headline text-primary-foreground/90">Create Your Account</CardTitle>
          <CardDescription className="text-primary-foreground/70">Join Sports Arena today!</CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10 h-12 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-12 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary"
              />
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 h-12 rounded-full bg-gray-100 border-transparent focus:bg-white focus:border-primary pr-12"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 text-gray-400 hover:bg-gray-200"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
                <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
              </Button>
            </div>
            <Button type="submit" className="w-full h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-base font-bold" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} /> : 'Create Account'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-white p-6 justify-center text-sm border-t">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/account/login" className="font-bold text-purple-600 hover:underline">
              Log in <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
