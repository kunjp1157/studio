
'use client';
import Link from 'next/link';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MountainSnow, LayoutDashboard, Building2, Users, Settings, LogOut, Award, CalendarDays as EventIcon, Ticket, DollarSign, Tag, LayoutTemplate } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import type { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const activeUserStr = sessionStorage.getItem('activeUser');
    if (activeUserStr) {
        const user: UserProfile = JSON.parse(activeUserStr);
        setCurrentUser(user);
        if (user.role === 'Admin') {
            setIsAuthorized(true);
        } else {
            toast({
                title: "Access Denied",
                description: "You must be an administrator to access this page.",
                variant: "destructive",
            });
            router.replace('/facilities');
        }
    } else {
        // Handle case where no user is logged in
        toast({
            title: "Authentication Required",
            description: "Please log in as an admin to continue.",
            variant: "destructive",
        });
        router.replace('/facilities'); // Or a login page if you had one
    }
    setIsLoading(false);
  }, [router, toast]);


  const isActive = (path: string) => pathname === path || (path !== '/admin' && pathname.startsWith(path));

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="none" className="border-r">
        <SidebarHeader className="p-4 border-b">
          <Link href="/admin" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <MountainSnow className="h-7 w-7 text-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden font-headline">Admin Hub</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/admin/dashboard">
                <SidebarMenuButton isActive={isActive('/admin/dashboard')} tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:justify-center">Management</SidebarGroupLabel>
              <SidebarMenuItem>
                <Link href="/admin/facilities">
                  <SidebarMenuButton isActive={isActive('/admin/facilities')} tooltip="Facilities">
                    <Building2 />
                    <span>Facilities</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/admin/bookings">
                    <SidebarMenuButton isActive={isActive('/admin/bookings')} tooltip="Bookings">
                        <Ticket />
                        <span>Bookings</span>
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/users">
                  <SidebarMenuButton isActive={isActive('/admin/users')} tooltip="Users">
                    <Users />
                    <span>Users</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/memberships">
                  <SidebarMenuButton isActive={isActive('/admin/memberships')} tooltip="Memberships">
                    <Award />
                    <span>Memberships</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/events">
                  <SidebarMenuButton isActive={isActive('/admin/events')} tooltip="Events">
                    <EventIcon />
                    <span>Events</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/pricing">
                  <SidebarMenuButton isActive={isActive('/admin/pricing')} tooltip="Pricing Rules">
                    <DollarSign />
                    <span>Pricing Rules</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/promotions">
                  <SidebarMenuButton isActive={isActive('/admin/promotions')} tooltip="Promotions">
                    <Tag />
                    <span>Promotions</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel className="group-data-[collapsible=icon]:justify-center">Insights & Settings</SidebarGroupLabel>
                <SidebarMenuItem>
                    <Link href="/admin/presentation">
                      <SidebarMenuButton isActive={isActive('/admin/presentation')} tooltip="AI Presentation">
                          <LayoutTemplate />
                          <span>AI Presentation</span>
                      </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href="/admin/settings">
                    <SidebarMenuButton isActive={isActive('/admin/settings')} tooltip="Settings">
                        <Settings />
                        <span>Settings</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarGroup>

          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t group-data-[collapsible=icon]:p-2">
           <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10">
                <AvatarImage src={currentUser.profilePictureUrl || undefined} alt="Admin User" />
                <AvatarFallback>AU</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="mt-2 w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:aspect-square" onClick={() => router.push('/facilities')}>
            <LogOut className="group-data-[collapsible=icon]:m-auto"/>
            <span className="ml-2 group-data-[collapsible=icon]:hidden">Exit Admin</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-0">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm md:hidden">
            <SidebarTrigger />
            <Link href="/admin" className="flex items-center gap-2">
              <MountainSnow className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold font-headline">Admin Hub</span>
            </Link>
        </header>
        <main className="flex-1 p-6 bg-muted/30 min-h-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
