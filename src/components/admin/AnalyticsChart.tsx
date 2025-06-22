
'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, Pie, PieChart, Sector, Tooltip, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import type { PieSectorDataItem } from 'recharts/types/polar/Pie';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip as ShadChartTooltip, // Renamed to avoid conflict
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useState } from 'react';

interface AnalyticsChartProps<TData extends object> {
  title: string;
  description?: string;
  data: TData[];
  chartConfig: ChartConfig;
  type: 'bar' | 'line' | 'pie';
  dataKey: keyof TData; // For bar/line charts (Y-axis)
  categoryKey: keyof TData; // For bar/line charts (X-axis) or pie chart segments
  valueKey?: keyof TData; // For pie chart values
  colors?: string[]; // For pie chart
}


const DefaultChartTooltipContent = ({ active, payload, label, config }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {config[payload[0].dataKey]?.label || payload[0].dataKey}
            </span>
            <span className="font-bold text-muted-foreground">
              {label}
            </span>
          </div>
          <div className="flex flex-col">
             <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
            <span className="font-bold">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}


export function AnalyticsChart<TData extends object>({
  title,
  description,
  data,
  chartConfig,
  type,
  dataKey,
  categoryKey,
  valueKey, // Only for pie
  colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'],
}: AnalyticsChartProps<TData>) {

  const [activeIndex, setActiveIndex] = useState(0);

  const renderActiveShape = (props: PieSectorDataItem) => {
    const RADIAN = Math.PI / 180;
    const { cx=0, cy=0, midAngle=0, innerRadius=0, outerRadius=0, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="font-semibold text-lg">
          {payload[categoryKey as string]}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} style={{ fill: "hsl(var(--foreground))" }} className="text-sm">{`Bookings: ${value}`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} style={{ fill: "hsl(var(--muted-foreground))" }} className="text-xs">
          {`(Share: ${(percent! * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-primary" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          {type === 'bar' && (
            <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={categoryKey as string}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 3) : value}
              />
              <YAxis />
              <ShadChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey={dataKey as string} fill={`var(--color-${String(dataKey)})`} radius={8}>
                <LabelList
                    position="top"
                    offset={12}
                    fill="hsl(var(--foreground))"
                    fontSize={12}
                />
              </Bar>
            </BarChart>
          )}
          {type === 'line' && (
            <LineChart accessibilityLayer data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={categoryKey as string} tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <ShadChartTooltip cursor={false} content={<DefaultChartTooltipContent config={chartConfig}/>} />
              <Line type="monotone" dataKey={dataKey as string} stroke={`var(--color-${String(dataKey)})`} strokeWidth={2} dot={true} />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          )}
          {type === 'pie' && valueKey && (
             <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                <ShadChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    fill="var(--color-fill)"
                    dataKey={valueKey as string}
                    nameKey={categoryKey as string}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                 >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent nameKey={categoryKey as string} />} />
                </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
