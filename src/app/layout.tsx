
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
  const isAuthPage = pathname.startsWith('/account');
  const isHomePage = pathname === '/';
  const isSpecialBg = (isAuthPage && !pathname.startsWith('/account/profile') && !pathname.startsWith('/account/bookings') && !pathname.startsWith('/account/favorites') && !pathname.startsWith('/account/teams') && !pathname.startsWith('/account/payment-methods')) || isHomePage;


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Sports Arena</title>
        <meta name="description" content="Book sports facilities in your city with ease." />
      </head>
      <body className={cn(
          "font-sans antialiased min-h-screen flex flex-col",
          inter.variable,
          isSpecialBg ? 'bg-black' : ''
      )}>
        {!isAdminOrOwnerPath && !isSpecialBg && <Header />}
        <main className="flex-grow">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </main>
        {!isAdminOrOwnerPath && !isSpecialBg && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
