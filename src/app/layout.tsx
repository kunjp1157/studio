
'use client';

import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster"
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  const isAdminOrOwnerPath = pathname.startsWith('/admin') || pathname.startsWith('/owner');
  const isAuthPage = pathname.startsWith('/account/login') || pathname.startsWith('/account/signup') || pathname.startsWith('/account/forgot-password');
  const isHomePage = pathname === '/';


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Sports Arena</title>
        <meta name="description" content="Book sports facilities in your city with ease." />
      </head>
      <body className={cn(
          "font-sans antialiased min-h-screen flex flex-col",
          inter.variable,
          isAuthPage ? 'auth-page' : 'bg-background'
      )}>
        {!isAdminOrOwnerPath && !isAuthPage && !isHomePage && <Header />}
        <main className="flex-grow">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </main>
        {!isAdminOrOwnerPath && !isAuthPage && !isHomePage && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
