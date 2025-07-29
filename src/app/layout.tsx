
'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster"
import { PageTransitionWrapper } from '@/components/layout/PageTransitionWrapper';
import { usePathname } from 'next/navigation';

// No static metadata here as the component is now client-side

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  
  // Define public paths that should not have the main header/footer
  const publicAuthPaths = [
    '/account/login',
    '/account/signup',
    '/account/forgot-password'
  ];

  const isAdminOrOwnerPath = pathname.startsWith('/admin') || pathname.startsWith('/owner');

  // Determine if the current path is one of the public auth pages
  const isPublicAuthPage = publicAuthPaths.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Sports Arena</title>
        <meta name="description" content="Book sports facilities in your city with ease." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        {!isPublicAuthPage && !isAdminOrOwnerPath && <Header />}
        <main className="flex-grow">
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
        </main>
        {!isPublicAuthPage && !isAdminOrOwnerPath && <Footer />}
        <Toaster />
      </body>
    </html>
  );
}
