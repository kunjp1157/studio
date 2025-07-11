
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Mail, KeyRound, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getAllUsers, setLoggedInUser } from '@/lib/data';
import type { UserProfile } from '@/lib/types';

// Placeholder for social icons if not using a library
const GoogleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.19,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.19,22C17.6,22 21.5,18.33 21.5,12.33C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"/></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.81C10.44 7.31 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>;


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
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const allUsers = getAllUsers();
    const foundUser = allUsers.find(user => user.email === email);
    
    if (!foundUser) {
        toast({
            title: 'Login Failed',
            description: 'No account found with this email address. Please sign up.',
            variant: 'destructive',
        });
        setIsLoading(false);
        return;
    }

    let isPasswordCorrect = false;

    if (foundUser.role === 'Admin') {
        if (
            (email === 'kunjp1157@gmail.com' && password === 'Kunj@2810') ||
            (email === 'jinesh2806@gmail.com' && password === 'jinesh2806') ||
            (email === 'shahkiratn007@gmail.com' && password === 'suru@810')
        ) {
            isPasswordCorrect = true;
        }
    } else {
        if (password === 'password123') { // Mock password for all non-admin users
            isPasswordCorrect = true;
        }
    }
    
    setIsLoading(false);
    if (isPasswordCorrect) {
       setLoggedInUser(foundUser); 
       toast({
        title: 'Login Successful',
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      if (foundUser.role === 'Admin') {
          router.push('/admin');
      } else if (foundUser.role === 'FacilityOwner') {
        router.push('/owner');
      } else {
        router.push('/facilities');
      }
      
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary mb-4" />
          <CardTitle className="text-3xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>Log in to access your Sports Arena account.</CardDescription>
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
            <div>
              <Label htmlFor="password"><KeyRound className="inline mr-2 h-4 w-4 text-muted-foreground" />Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                    {/* <Checkbox id="remember-me" />
                    <Label htmlFor="remember-me" className="font-normal">Remember me</Label> */}
                </div>
                <Link href="/account/forgot-password" className="font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <LogIn className="mr-2 h-5 w-5" />}
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" disabled={isLoading}>
              <GoogleIcon /> <span className="ml-2">Google</span>
            </Button>
            <Button variant="outline" disabled={isLoading}>
              <FacebookIcon /> <span className="ml-2">Facebook</span>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/account/signup" className="font-medium text-primary hover:underline">
              Sign up <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
