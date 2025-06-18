'use client';

import { PageTitle } from '@/components/shared/PageTitle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Construction } from 'lucide-react';
import { AnalyticsChart } from '@/components/admin/AnalyticsChart';
import { mockReportData } from '@/lib/data';
import type { ChartConfig } from '@/components/ui/chart';

const peakHoursChartConfig = {
  bookings: { label: 'Bookings', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

export default function AdminReportsPage() {

  const peakHoursData = mockReportData.peakHours.map(item => ({...item, hourLabel: `${item.hour}`}));
  
  return (
    <div className="space-y-8">
      <PageTitle title="Reporting & Analytics" description="Gain insights into platform usage, revenue, and booking trends." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnalyticsChart
            title="Peak Booking Hours"
            description="Most popular times for bookings."
            data={peakHoursData}
            chartConfig={peakHoursChartConfig}
            type="bar"
            dataKey="bookings"
            categoryKey="hourLabel"
        />
        <Card className="shadow-lg">
            <CardHeader>
            <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-6 w-6 text-primary" />
                Custom Reports
            </CardTitle>
            <CardDescription>
                This section will provide tools to generate custom reports based on various metrics and filters.
            </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[234px] text-center">
            <Construction className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Report Builder Coming Soon</h3>
            <p className="text-muted-foreground mt-2">
                Advanced reporting tools are under development.
            </p>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
