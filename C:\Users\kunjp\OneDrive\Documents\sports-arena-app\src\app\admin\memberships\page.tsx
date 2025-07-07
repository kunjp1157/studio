
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
import type { MembershipPlan, SiteSettings } from '@/lib/types';
import { deleteMembershipPlan as deleteMockMembershipPlan } from '@/lib/data';
import { getSiteSettingsAction, getAllMembershipPlansAction } from '@/app/actions';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Award, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminMembershipsPage() {
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<MembershipPlan | null>(null);
  const { toast } = useToast();
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  const fetchAndSetData = async () => {
    const [freshPlans, settings] = await Promise.all([
      getAllMembershipPlansAction(),
      getSiteSettingsAction(),
    ]);
    setPlans(currentPlans => {
        if (JSON.stringify(currentPlans) !== JSON.stringify(freshPlans)) {
            return freshPlans;
        }
        return currentPlans;
    });
    setCurrency(prev => settings.defaultCurrency !== prev ? settings.defaultCurrency : prev);
  };

  useEffect(() => {
    fetchAndSetData().finally(() => setIsLoading(false));

    const intervalId = setInterval(fetchAndSetData, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const handleDeletePlan = () => {
    if (!planToDelete) return;
    setIsDeleting(true);
    setTimeout(async () => {
      deleteMockMembershipPlan(planToDelete.id);
      toast({
        title: "Membership Plan Deleted",
        description: `"${planToDelete.name}" has been successfully deleted.`,
      });
      await fetchAndSetData(); // Re-fetch data
      setIsDeleting(false);
      setPlanToDelete(null);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="Membership Management" description="Configure and manage membership plans and subscribers." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Award className="mr-2 h-6 w-6 text-primary" />Loading Plans...</CardTitle>
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
       <PageTitle title="Membership Management" description="Configure and manage membership plans and subscribers." />
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <CardTitle className="flex items-center"><Award className="mr-2 h-6 w-6 text-primary"/>Membership Plans</CardTitle>
                <CardDescription>Create, edit, and manage different membership tiers, benefits, and pricing.</CardDescription>
            </div>
            <Link href="/admin/memberships/new">
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Plan</Button>
            </Link>
        </CardHeader>
        <CardContent>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Price/Month</TableHead>
                    <TableHead>Benefits</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {plans.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                        No membership plans found. Add one to get started!
                        </TableCell>
                    </TableRow>
                    ) : (
                    plans.map((plan) => (
                        <TableRow key={plan.id}>
                        <TableCell className="font-medium">{plan.name}</TableCell>
                        <TableCell>{currency ? formatCurrency(plan.pricePerMonth, currency) : <Skeleton className="h-5 w-16" />}</TableCell>
                        <TableCell>
                            <ul className="list-none space-y-1">
                                {plan.benefits.slice(0, 2).map((benefit, index) => (
                                    <li key={index} className="text-xs text-muted-foreground flex items-center">
                                        <CheckCircle className="h-3 w-3 mr-1.5 text-green-500 shrink-0"/> {benefit}
                                    </li>
                                ))}
                                {plan.benefits.length > 2 && <li className="text-xs text-muted-foreground">...and more</li>}
                            </ul>
                        </TableCell>
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
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/memberships/${plan.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onClick={() => setPlanToDelete(plan)}
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

      {planToDelete && (
        <AlertDialog open={!!planToDelete} onOpenChange={(open) => !open && setPlanToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the membership plan "{planToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPlanToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeletePlan} 
                disabled={isDeleting} 
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isDeleting ? <LoadingSpinner size={16} className="mr-2" /> : <Trash2 className="mr-2 h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Yes, delete plan'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
