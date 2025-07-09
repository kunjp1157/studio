
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
import type { PromotionRule, SiteSettings } from '@/lib/types';
import { deletePromotionRule, getSiteSettings, listenToAllPromotionRules } from '@/lib/data';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Tag, CheckCircle, XCircle, CalendarDays } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<PromotionRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<PromotionRule | null>(null);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const settings = getSiteSettings();
    setCurrency(settings.defaultCurrency);
    
    const unsubscribe = listenToAllPromotionRules(
        (freshPromos) => {
            setPromotions(freshPromos);
            if (isLoading) setIsLoading(false);
        },
        (error) => {
            console.error("Failed to fetch promotions:", error);
            toast({
                title: "Error",
                description: "Could not load promotions data.",
                variant: "destructive",
            });
            if (isLoading) setIsLoading(false);
        }
    );

    return () => unsubscribe();
  }, [isLoading, toast]);

  const handleDeletePromotion = async () => {
    if (!promotionToDelete) return;
    setIsDeleting(true);
    try {
      await deletePromotionRule(promotionToDelete.id);
      toast({
        title: "Promotion Deleted",
        description: `Promotion "${promotionToDelete.name}" has been successfully deleted.`,
      });
    } catch (error) {
       toast({
        title: "Error",
        description: `Could not delete promotion "${promotionToDelete.name}".`,
        variant: "destructive",
      });
    } finally {
        setIsDeleting(false);
        setPromotionToDelete(null);
    }
  };

  const formatDiscount = (promo: PromotionRule) => {
    if (!currency) return <Skeleton className="h-5 w-20" />;
    return promo.discountType === 'percentage' 
      ? `${promo.discountValue}% off` 
      : `${formatCurrency(promo.discountValue, currency)} off`;
  };

  const formatValidity = (promo: PromotionRule) => {
    if (promo.startDate && promo.endDate) {
      return `${format(parseISO(promo.startDate), 'MMM d, yyyy')} - ${format(parseISO(promo.endDate), 'MMM d, yyyy')}`;
    }
    if (promo.startDate) {
      return `Starts ${format(parseISO(promo.startDate), 'MMM d, yyyy')}`;
    }
    if (promo.endDate) {
      return `Ends ${format(parseISO(promo.endDate), 'MMM d, yyyy')}`;
    }
    return 'Always active (if enabled)';
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <PageTitle title="Promotion & Discount Management" description="Create, manage, and track promotional offers, discount codes, and loyalty programs." />
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Tag className="mr-2 h-6 w-6 text-primary" />Loading Promotions...</CardTitle>
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
      <PageTitle title="Promotion & Discount Management" description="Create, manage, and track promotional offers, discount codes, and loyalty programs." />
      <Card className="shadow-lg">
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="flex items-center"><Tag className="mr-2 h-6 w-6 text-primary" />Promotional Rules & Coupons</CardTitle>
            <CardDescription>Define and oversee discount codes, special offers, and loyalty rewards to engage users and boost bookings.</CardDescription>
          </div>
          <Link href="/admin/promotions/new">
            <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Promotion</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No promotions found. Add one to get started!
                    </TableCell>
                  </TableRow>
                ) : (
                  promotions.map((promo) => (
                    <TableRow key={promo.id}>
                      <TableCell className="font-medium">{promo.name}</TableCell>
                      <TableCell>
                        {promo.code ? <Badge variant="outline">{promo.code}</Badge> : <span className="text-xs text-muted-foreground italic">Automatic</span>}
                      </TableCell>
                      <TableCell>{formatDiscount(promo)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatValidity(promo)}</TableCell>
                      <TableCell className="text-center">
                        {promo.isActive ? 
                          <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : 
                          <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
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
                              <Link href={`/admin/promotions/${promo.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              onClick={() => setPromotionToDelete(promo)}
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

      {promotionToDelete && (
        <AlertDialog open={!!promotionToDelete} onOpenChange={(open) => !open && setPromotionToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the promotion "{promotionToDelete.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPromotionToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeletePromotion} 
                disabled={isDeleting} 
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                {isDeleting ? <LoadingSpinner size={16} className="mr-2" /> : <Trash2 className="mr-2 h-4 w-4" />}
                {isDeleting ? 'Deleting...' : 'Yes, delete promotion'}
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
                <p>Promotion rules allow you to:</p>
                <ul className="list-disc list-inside mt-2 pl-4">
                    <li>Create discount codes (e.g., "SUMMER20" for 20% off).</li>
                    <li>Offer automatic discounts based on certain conditions (e.g., first-time user discount - not yet implemented).</li>
                    <li>Set validity periods, usage limits, and control active status.</li>
                </ul>
                <p className="mt-2 text-xs">The actual application of these promotions during booking is not yet implemented but would involve checking active promotions and applying them to the cart/total price.</p>
            </CardContent>
        </Card>
    </div>
  );
}
