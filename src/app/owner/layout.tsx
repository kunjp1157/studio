
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
import { Building, LayoutDashboard, Ticket, CalendarClock, BarChart2, Settings, LogOut, HandCoins } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { mockUser } from '@/lib/data'; // Assuming owner uses a similar mock user for now

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || (path !== '/owner' && pathname.startsWith(path));

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r bg-sidebar text-sidebar-foreground">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <Link href="/owner" className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <HandCoins className="h-7 w-7 text-sidebar-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden font-headline">Owner Portal</span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/owner">
                <SidebarMenuButton isActive={isActive('/owner')} tooltip="Dashboard">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>

            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:justify-center">Management</SidebarGroupLabel>
              <SidebarMenuItem>
                <Link href="/owner/my-facilities">
                  <SidebarMenuButton isActive={isActive('/owner/my-facilities')} tooltip="My Facilities">
                    <Building />
                    <span>My Facilities</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/owner/my-bookings">
                    <SidebarMenuButton isActive={isActive('/owner/my-bookings')} tooltip="Facility Bookings">
                        <Ticket />
                        <span>Facility Bookings</span>
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/owner/availability">
                  <SidebarMenuButton isActive={isActive('/owner/availability')} tooltip="Manage Availability">
                    <CalendarClock />
                    <span>Availability</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="group-data-[collapsible=icon]:justify-center">Insights & Settings</SidebarGroupLabel>
              <SidebarMenuItem>
                <Link href="/owner/reports">
                  <SidebarMenuButton isActive={isActive('/owner/reports')} tooltip="Owner Reports">
                    <BarChart2 />
                    <span>Reports</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
               {/* 
                Placeholder for future owner settings - can be uncommented when page is ready
               <SidebarMenuItem>
                <Link href="/owner/settings">
                  <SidebarMenuButton isActive={isActive('/owner/settings')} tooltip="Owner Settings">
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem> 
              */}
            </SidebarGroup>

          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[collapsible=icon]:p-2">
           <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10">
                <AvatarImage src={mockUser.profilePictureUrl || undefined} alt="Facility Owner" />
                <AvatarFallback>FO</AvatarFallback>
            </Avatar>
            <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground/80">Facility Owner</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="mt-2 w-full justify-start group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:aspect-square hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <LogOut className="group-data-[collapsible=icon]:m-auto"/>
            <span className="ml-2 group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-0">
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm md:hidden">
            <SidebarTrigger />
            <Link href="/owner" className="flex items-center gap-2">
              <HandCoins className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold font-headline">Owner Portal</span>
            </Link>
        </header>
        <main className="flex-1 p-6 bg-muted/30 min-h-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
