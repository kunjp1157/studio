
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, KeyRound, ArrowRight, Eye, EyeOff, MountainSnow } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { setLoggedInUser, getUserByEmail } from '@/lib/data';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const foundUser = await getUserByEmail(userCredential.user.email!);
      
      if (!foundUser) throw new Error("User profile not found after authentication.");
      
      setLoggedInUser(foundUser);
      
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      if (foundUser.role === 'Admin') router.push('/admin');
      else if (foundUser.role === 'FacilityOwner') router.push('/owner');
      else router.push('/facilities');

    } catch (error: any) {
      console.error("Login Error:", error);
      let description = 'Invalid email or password. Please try again.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes("User profile not found")) {
        description = "Authentication succeeded, but we couldn't find your user profile. Please contact support.";
      }
      toast({
        title: 'Login Failed',
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
          <CardTitle className="text-3xl font-headline text-primary-foreground/90">Welcome Back!</CardTitle>
          <CardDescription className="text-primary-foreground/70">Log in to access Sports Arena.</CardDescription>
        </CardHeader>
        <CardContent className="px-8 py-6 bg-white">
          <form onSubmit={handleSubmit} className="space-y-4">
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
             <div className="flex items-center justify-end text-sm">
                <Link href="/account/forgot-password" className="font-medium text-purple-600 hover:text-purple-800">
                  Forgot password?
                </Link>
            </div>
            <Button type="submit" className="w-full h-12 rounded-full bg-purple-600 hover:bg-purple-700 text-base font-bold" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} /> : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="bg-white p-6 justify-center text-sm border-t">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/account/signup" className="font-bold text-purple-600 hover:underline">
              Sign up <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
