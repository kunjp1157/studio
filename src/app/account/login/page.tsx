
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, KeyRound, ArrowRight, Eye, EyeOff, MountainSnow, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { setLoggedInUser, getUserByEmail } from '@/lib/data';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const InfoPanel = () => (
    <div className="relative hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-orange-400 to-pink-600 p-8 text-white rounded-l-2xl">
        <div>
            <div className="flex items-center gap-3">
                <MountainSnow className="h-10 w-10" />
                <h1 className="text-3xl font-bold font-headline">City Sports Hub</h1>
            </div>
            <p className="mt-4 text-lg">Your ultimate destination for booking sports facilities.</p>
        </div>
        <div>
            <h2 className="text-2xl font-semibold mb-4">What's New?</h2>
            <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><CheckCircle size={18} /><span>Discover and book facilities in real-time.</span></li>
                <li className="flex items-center gap-2"><CheckCircle size={18} /><span>Find players with our new Matchmaking feature.</span></li>
                <li className="flex items-center gap-2"><CheckCircle size={18} /><span>Plan your entire sporty weekend with our AI Planner.</span></li>
                <li className="flex items-center gap-2"><CheckCircle size={18} /><span>Compete and climb the new loyalty points Leaderboard.</span></li>
            </ul>
        </div>
        <div className="text-xs opacity-70">
            &copy; {new Date().getFullYear()} City Sports Hub. All Rights Reserved.
        </div>
    </div>
);


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
      <div className="w-full max-w-4xl flex bg-card rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp">
        <InfoPanel />
        <div className="w-full lg:w-1/2 p-8 md:p-12">
            <CardTitle className="text-3xl font-bold text-primary mb-2">Sign In</CardTitle>
            <CardDescription className="text-muted-foreground mb-8">Welcome back! Please enter your details.</CardDescription>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="text-sm font-medium text-muted-foreground" htmlFor="email">Email</label>
                    <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="pl-10 h-11 bg-muted/50 border-border"
                        />
                    </div>
                </div>
                <div>
                     <label className="text-sm font-medium text-muted-foreground" htmlFor="password">Password</label>
                    <div className="relative mt-1">
                        <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="pl-10 h-11 bg-muted/50 border-border pr-12"
                        />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:bg-muted"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                        </Button>
                    </div>
                </div>
                <div className="flex items-center justify-end text-sm">
                    <Link href="/account/forgot-password" className="font-medium text-primary hover:underline">
                    Forgot password?
                    </Link>
                </div>
                <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size={20} /> : <LogIn className="mr-2"/>}
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link href="/account/signup" className="font-bold text-primary hover:underline">
                    Sign up <ArrowRight className="inline h-4 w-4" />
                    </Link>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
