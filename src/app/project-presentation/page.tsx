
'use client';

import React from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Search,
  CalendarCheck,
  UserCircle,
  ShieldCheck,
  Database,
  BrainCircuit,
  BarChart,
  Layers,
  Sparkles,
  Rocket,
  ThumbsUp,
  MountainSnow,
  ClipboardCheck,
  Wrench,
  Cpu,
  Paintbrush,
  Swords,
  CreditCard
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Slide = ({ title, icon: Icon, children }: { title: string, icon: React.ElementType, children: React.ReactNode }) => (
  <Card className="shadow-lg mb-8 w-full animate-fadeInUp">
    <CardHeader>
      <CardTitle className="flex items-center text-2xl">
        <Icon className="mr-3 h-7 w-7 text-primary" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="prose-sm dark:prose-invert max-w-none text-foreground/80 space-y-2">
      {children}
    </CardContent>
  </Card>
);

export default function ProjectPresentationPage() {
  return (
    <div className="bg-background min-h-screen">
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-4xl">
            <header className="text-center mb-12">
                <MountainSnow className="mx-auto h-16 w-16 text-primary mb-4" />
                <h1 className="text-5xl font-bold font-headline">City Sports Hub</h1>
                <p className="text-xl text-muted-foreground mt-2">A Modern Platform for Booking Sports Facilities</p>
                <Separator className="my-6" />
                <p className="text-lg text-muted-foreground">
                    Project Presentation by: [Your Name]
                </p>
                <p className="text-md text-muted-foreground">
                    [Your College/University Name]
                </p>
            </header>

            <Slide title="Introduction & Problem Statement" icon={ClipboardCheck}>
                <p>In many cities, finding and booking a sports facility is a fragmented and frustrating process. Enthusiasts face challenges like:</p>
                <ul className="list-disc pl-5">
                    <li>No central platform to view all available venues.</li>
                    <li>Outdated information on websites or social media.</li>
                    <li>Time-consuming phone calls to check for slot availability.</li>
                    <li>Lack of transparent pricing and secure online payment options.</li>
                </ul>
                <p><strong>City Sports Hub</strong> aims to solve this by providing a single, reliable, and user-friendly application for discovering, booking, and managing sports facility reservations.</p>
            </Slide>

            <Slide title="Project Objectives" icon={ThumbsUp}>
                <ul className="list-disc pl-5">
                    <li>To develop a comprehensive and centralized listing of all sports facilities in a city.</li>
                    <li>To implement an advanced search and filtering system based on sport, location, price, and time.</li>
                    <li>To offer a seamless, real-time booking and secure online payment system.</li>
                    <li>To provide users with personalized accounts to manage their bookings and preferences.</li>
                    <li>To create a robust admin panel for facility owners to manage their venues and schedules.</li>
                    <li>To leverage AI for intelligent features like facility recommendations and weekend planning.</li>
                </ul>
            </Slide>

            <Slide title="Core User Features" icon={Users}>
                <div className="grid md:grid-cols-2 gap-4">
                    <p><Search className="inline-block mr-2 h-4 w-4"/><strong>Advanced Search:</strong> Filter by sport, location, time, and amenities.</p>
                    <p><CalendarCheck className="inline-block mr-2 h-4 w-4"/><strong>Real-Time Booking:</strong> View live availability calendars and book slots instantly.</p>
                    <p><UserCircle className="inline-block mr-2 h-4 w-4"/><strong>User Accounts:</strong> Manage profiles, track booking history, and save favorite venues.</p>
                    <p><CreditCard className="inline-block mr-2 h-4 w-4"/><strong>Secure Payments:</strong> Integrated payment gateway for easy transactions.</p>
                    <p><Sparkles className="inline-block mr-2 h-4 w-4"/><strong>AI Recommendations:</strong> Get personalized facility suggestions.</p>
                    <p><Swords className="inline-block mr-2 h-4 w-4"/><strong>Player Matchmaking:</strong> Find other players for a game.</p>
                </div>
            </Slide>
            
             <Slide title="Admin & Owner Features" icon={ShieldCheck}>
                <ul className="list-disc pl-5">
                    <li><strong>Facility Management:</strong> Admins can add, edit, and remove facilities, including details, photos, and amenities.</li>
                    <li><strong>Booking Management:</strong> View all platform bookings, filter them, and manage their status.</li>
                    <li><strong>Availability Control:</strong> Facility owners can block out time slots for maintenance or private events.</li>
                    <li><strong>Dynamic Pricing & Promotions:</strong> Admins can create rules to adjust prices or offer discounts.</li>
                    <li><strong>User Management:</strong> Admins can view and manage user accounts, roles, and statuses.</li>
                    <li><strong>Analytics Dashboard:</strong> An overview of key metrics like revenue, bookings, and user growth.</li>
                </ul>
            </Slide>

            <Slide title="Technology Stack" icon={Layers}>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold flex items-center"><Cpu className="mr-2 h-4 w-4"/>Frontend & Backend</h4>
                        <ul className="list-disc pl-6 text-sm">
                            <li><strong>Next.js:</strong> A React framework for building fast, server-rendered applications.</li>
                            <li><strong>React:</strong> A component-based library for building user interfaces.</li>
                            <li><strong>TypeScript:</strong> For type safety and improved code quality.</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold flex items-center"><Paintbrush className="mr-2 h-4 w-4"/>UI & Styling</h4>
                        <ul className="list-disc pl-6 text-sm">
                            <li><strong>Tailwind CSS:</strong> A utility-first CSS framework for rapid styling.</li>
                            <li><strong>ShadCN UI:</strong> A collection of beautifully designed, reusable components.</li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="font-semibold flex items-center"><Database className="mr-2 h-4 w-4"/>Database & AI</h4>
                        <ul className="list-disc pl-6 text-sm">
                            <li><strong>Firebase:</strong> Used for Firestore Database, Authentication, and Hosting.</li>
                            <li><strong>Genkit:</strong> Google's open-source framework for building AI-powered features.</li>
                        </ul>
                    </div>
                </div>
            </Slide>
            
            <Slide title="AI-Powered Integrations with Genkit" icon={BrainCircuit}>
                 <p>Genkit was used to create intelligent features that enhance the user experience:</p>
                <ul className="list-disc pl-5">
                    <li><strong>Facility Recommender:</strong> Analyzes user preferences and booking history to suggest the best place to play next.</li>
                    <li><strong>Weekend Planner:</strong> Takes a natural language request (e.g., "a sporty weekend for 2 people") and creates a full itinerary with suggested bookings.</li>
                    <li><strong>AI Presentation Generator:</strong> An admin tool that analyzes live app data (users, bookings) and generates a business summary presentation.</li>
                    <li><strong>Review Summarizer:</strong> Processes all user reviews for a facility and provides a concise list of pros and cons.</li>
                </ul>
            </Slide>

            <Slide title="Future Scope" icon={Rocket}>
                <ul className="list-disc pl-5">
                    <li><strong>Mobile Application:</strong> Develop native iOS and Android apps for a better mobile experience.</li>
                    <li><strong>Social Features:</strong> Allow users to create teams, challenge others, and share their activities on social media.</li>
                    <li><strong>League & Tournament Management:</strong> A dedicated module for organizers to create and manage full-scale leagues.</li>
                    <li><strong>Advanced Analytics for Owners:</strong> Provide facility owners with detailed insights on their revenue, peak hours, and customer demographics.</li>
                    <li><strong>Deeper Payment Integration:</strong> Implement full refund and proration logic for booking modifications.</li>
                </ul>
            </Slide>

             <div className="text-center mt-12">
                <h2 className="text-3xl font-bold font-headline">Thank You!</h2>
                <p className="text-xl text-muted-foreground mt-2">Questions?</p>
            </div>

        </div>
    </div>
  );
}
