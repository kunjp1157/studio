'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { mockReportData } from '@/lib/data';
import { DollarSign, Users, TrendingUp, Ticket, Building2 } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';

const bookingsChartConfig = {
  bookings: { label: 'Bookings', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const facilityUsageChartConfig = {
    bookings: { label: "Bookings", color: "hsl(var(--chart-1))" },
    facilityName: { label: "Facility" }
} satisfies ChartConfig;


export default function AdminDashboardPage() {
  const totalFacilities = 4; // Mock data, replace with actual count
  const activeUsers = 150; // Mock data

  const monthlyBookingsData = [
    { month: 'Jan', bookings: 186 }, { month: 'Feb', bookings: 205 },
    { month: 'Mar', bookings: 237 }, { month: 'Apr', bookings: 173 },
    { month: 'May', bookings: 209 }, { month: 'Jun', bookings: 214 },
  ];

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 8000 }, { month: 'Feb', revenue: 9500 },
    { month: 'Mar', revenue: 11200 }, { month: 'Apr', revenue: 9800 },
    { month: 'May', revenue: 12000 }, { month: 'Jun', revenue: 12500 },
  ];

  return (
    <div className="space-y-8">
      <PageTitle title="Admin Dashboard" description="Overview of City Sports Hub activities and performance." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${mockReportData.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockReportData.totalBookings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">+5 since yesterday</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listed Facilities</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFacilities}</div>
            <p className="text-xs text-muted-foreground">Managed & active</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <AnalyticsChart
          title="Monthly Bookings"
          description="Total bookings per month for the last 6 months."
          data={monthlyBookingsData}
          chartConfig={bookingsChartConfig}
          type="bar"
          dataKey="bookings"
          categoryKey="month"
        />
        <AnalyticsChart
          title="Monthly Revenue"
          description="Total revenue per month for the last 6 months."
          data={monthlyRevenueData}
          chartConfig={revenueChartConfig}
          type="line"
          dataKey="revenue"
          categoryKey="month"
        />
      </div>
       <div className="grid gap-6 md:grid-cols-1">
         <AnalyticsChart
            title="Facility Usage"
            description="Bookings per facility."
            data={mockReportData.facilityUsage}
            chartConfig={facilityUsageChartConfig}
            type="pie"
            categoryKey="facilityName" // Name for Pie segments
            valueKey="bookings"    // Value for Pie segments
         />
       </div>
    </div>
  );
}
