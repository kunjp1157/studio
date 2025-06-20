
'use client';

import { useEffect, useState, useMemo } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { mockReportData, getAllFacilities, getAllUsers, getAllBookings } from '@/lib/data';
import { DollarSign, Users, TrendingUp, Ticket, Building2 } from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import { parseISO, getMonth, getYear, format, subMonths, startOfMonth } from 'date-fns';
import type { Booking } from '@/lib/types';

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
  const [totalFacilities, setTotalFacilities] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalBookingsThisMonth, setTotalBookingsThisMonth] = useState(0);
  const [totalRevenueThisMonth, setTotalRevenueThisMonth] = useState(0);
  
  const [monthlyBookingsData, setMonthlyBookingsData] = useState<Array<{ month: string; bookings: number }>>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<Array<{ month: string; revenue: number }>>([]);
  const [facilityUsageData, setFacilityUsageData] = useState<Array<{ facilityName: string; bookings: number }>>([]);

  useEffect(() => {
    const facilities = getAllFacilities();
    const users = getAllUsers();
    const bookings = getAllBookings();
    
    setTotalFacilities(facilities.length);
    setActiveUsers(users.filter(u => u.status === 'Active').length);

    const now = new Date();
    const currentMonth = getMonth(now);
    const currentYr = getYear(now);

    const bookingsThisMonth = bookings.filter(b => {
      const bookingDate = parseISO(b.bookedAt);
      return getMonth(bookingDate) === currentMonth && getYear(bookingDate) === currentYr && b.status === 'Confirmed';
    });
    setTotalBookingsThisMonth(bookingsThisMonth.length);
    setTotalRevenueThisMonth(bookingsThisMonth.reduce((sum, b) => sum + b.totalPrice, 0));
    
    // Prepare data for last 6 months charts
    const last6Months: { month: string; year: number; monthKey: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      last6Months.push({ month: format(d, 'MMM'), year: getYear(d), monthKey: format(d, 'yyyy-MM') });
    }

    const aggregatedBookings: Record<string, number> = {};
    const aggregatedRevenue: Record<string, number> = {};

    bookings.forEach(booking => {
      if (booking.status === 'Confirmed') {
        const bookingDate = parseISO(booking.bookedAt);
        const monthKey = format(bookingDate, 'yyyy-MM');
        
        if (last6Months.some(m => m.monthKey === monthKey)) {
            aggregatedBookings[monthKey] = (aggregatedBookings[monthKey] || 0) + 1;
            aggregatedRevenue[monthKey] = (aggregatedRevenue[monthKey] || 0) + booking.totalPrice;
        }
      }
    });
    
    setMonthlyBookingsData(last6Months.map(m => ({
      month: m.month,
      bookings: aggregatedBookings[m.monthKey] || 0,
    })));

    setMonthlyRevenueData(last6Months.map(m => ({
      month: m.month,
      revenue: parseFloat((aggregatedRevenue[m.monthKey] || 0).toFixed(2)),
    })));

    // Facility Usage (comes from mockReportData which is now dynamic)
    setFacilityUsageData(mockReportData.facilityUsage);

  }, []);


  return (
    <div className="space-y-8">
      <PageTitle title="Admin Dashboard" description="Overview of City Sports Hub activities and performance." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue (This Month)</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenueThisMonth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            <p className="text-xs text-muted-foreground">+15.2% from last month (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings (This Month)</CardTitle>
            <Ticket className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBookingsThisMonth.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.1% from last month (mock)</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Platform-wide</p>
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
          title="Monthly Bookings (Last 6 Months)"
          description="Total confirmed bookings per month."
          data={monthlyBookingsData}
          chartConfig={bookingsChartConfig}
          type="bar"
          dataKey="bookings"
          categoryKey="month"
        />
        <AnalyticsChart
          title="Monthly Revenue (Last 6 Months)"
          description="Total confirmed revenue per month."
          data={monthlyRevenueData}
          chartConfig={revenueChartConfig}
          type="line"
          dataKey="revenue"
          categoryKey="month"
        />
      </div>
       <div className="grid gap-6 md:grid-cols-1">
         <AnalyticsChart
            title="Facility Usage (All Time Bookings)"
            description="Total bookings per facility."
            data={facilityUsageData}
            chartConfig={facilityUsageChartConfig}
            type="pie"
            categoryKey="facilityName" 
            valueKey="bookings"   
         />
       </div>
    </div>
  );
}

