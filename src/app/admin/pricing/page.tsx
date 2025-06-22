
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import type { PricingRule, SiteSettings } from '@/lib/types';
import { getAllPricingRules, deletePricingRule as deleteMockPricingRule, getSiteSettings } from '@/lib/data';
import { PlusCircle, MoreHorizontal, Edit, Trash2, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPricingPage() {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<PricingRule | null>(null);
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency']>('USD');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTimeout(() => {
      setRules(getAllPricingRules());
      setIsLoading(false);
    }, 300);
    
    const settingsInterval = setInterval(() => {
      const currentSettings = getSiteSettings();
      setCurrency(prev => currentSettings.defaultCurrency !== prev ? currentSettings.defaultCurrency : prev);
    }, 3000);
    return () => clearInterval(settingsInterval);
  }, []);

  const handleDeleteRule = () => {
    if (!ruleToDelete) return;
    setIsDeleting(true);
    setTimeout(() => {
      deleteMockPricingRule(ruleToDelete.id);
      setRules(prevRules => prevRules.filter(r => r.id !== ruleToDelete.id));
      toast({
        title: "Pricing Rule Deleted",
        description: `"${ruleToDelete.name}" has been successfully deleted.`,
      });
      setIsDeleting(false);
      setRuleToDelete(null);
    }, 1000);
  };

  const formatAdjustment = (rule: PricingRule) => {
    if (!isMounted) return <Skeleton className="h-5 w-24" />;
    switch (rule.adjustmentType) {
      case 'percentage_increase': return `+${rule.value}%`;
      case 'percentage_decrease': return `-${rule.value}%`;
      case 'fixed_increase': return `+${formatCurrency(rule.value, currency)}`;
      case 'fixed_decrease': return `-${formatCurrency(rule.value, currency)}`;
      case 'fixed_price': return `Set to ${formatCurrency(rule.value, currency)}`;
      default: return 'N/A';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="Dynamic Pricing Management" description="Configure and manage pricing rules for facilities." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Loading Rules...</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center min-h-[300px]">
            <LoadingSpinner size={48} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageTitle title="Dynamic Pricing Management" description="Configure and manage pricing rules for facilities." />
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" />Pricing Rules Engine</CardTitle>
            <CardDescription>Define rules to dynamically adjust facility prices based on various conditions.</CardDescription>
          </div>
          <Link href="/admin/pricing/new">
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Rule</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Adjustment</TableHead>
                  <TableHead>Conditions</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-center">Priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No pricing rules found. Add one to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{formatAdjustment(rule)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {rule.daysOfWeek && rule.daysOfWeek.length > 0 && <div>Days: {rule.daysOfWeek.join(', ')}</div>}
                        {rule.timeRange && <div>Time: {rule.timeRange.start} - {rule.timeRange.end}</div>}
                        {rule.dateRange && <div>Date: {format(parseISO(rule.dateRange.start), 'MMM d')} - {format(parseISO(rule.dateRange.end), 'MMM d, yyyy')}</div>}
                        {!rule.daysOfWeek && !rule.timeRange && !rule.dateRange && <span className="italic">Always Applies</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        {rule.isActive ? 
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : 
                          <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                      </TableCell>
                      <TableCell className="text-center">{rule.priority ?? 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <Link href={`/admin/pricing/${rule.id}/edit`} legacyBehavior passHref>
                              <DropdownMenuItem asChild><a><Edit className="mr-2 h-4 w-4" /> Edit</a></DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => setRuleToDelete(rule)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {ruleToDelete && (
        <AlertDialog open={!!ruleToDelete} onOpenChange={(open) => !open && setRuleToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the pricing rule "{ruleToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setRuleToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteRule} 
                disabled={isDeleting} 
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isDeleting ? <LoadingSpinner size={16} className="mr-2" /> : <Trash2 className="mr-2 h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Yes, delete rule'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
       <Card className="mt-8 shadow-sm border-dashed">
            <CardHeader>
                <CardTitle className="text-lg">Conceptual Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                <p>Dynamic pricing rules allow you to:</p>
                <ul className="list-disc list-inside mt-2 pl-4">
                    <li>Set higher prices for weekend evenings.</li>
                    <li>Offer discounts for off-peak weekday mornings.</li>
                    <li>Adjust prices based on demand or special events (via date ranges).</li>
                    <li>Define rules with priorities to handle overlaps (lower numbers apply first).</li>
                </ul>
                <p className="mt-2 text-xs">The actual booking price will be calculated by applying these rules to the facility's base price. (Note: Price calculation logic is not yet implemented in the booking flow).</p>
            </CardContent>
        </Card>
    </div>
  );
}
