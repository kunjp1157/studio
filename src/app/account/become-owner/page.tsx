
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { requestOwnerRoleAction } from '@/app/actions';
import type { UserProfile } from '@/lib/types';
import { HandCoins, User, Fingerprint, Building, Upload, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';

const ownerVerificationSchema = z.object({
  fullName: z.string().min(3, 'Full name is required.'),
  phone: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number.'),
  idNumber: z.string().min(10, 'Please enter a valid ID number (PAN/Aadhar).'),
  facilityName: z.string().min(3, 'Facility name is required.'),
  facilityAddress: z.string().min(10, 'Facility address is required.'),
  identityProof: z.any().optional().refine(fileList => fileList && fileList.length === 1, 'Identity proof is required.'),
  addressProof: z.any().optional().refine(fileList => fileList && fileList.length === 1, 'Address proof is required.'),
  ownershipProof: z.any().optional().refine(fileList => fileList && fileList.length === 1, 'Ownership proof is required.'),
});

type OwnerVerificationFormValues = z.infer<typeof ownerVerificationSchema>;

export default function BecomeOwnerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const form = useForm<OwnerVerificationFormValues>({
    resolver: zodResolver(ownerVerificationSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      idNumber: '',
      facilityName: '',
      facilityAddress: '',
    },
  });

  const identityProofRef = form.register("identityProof");
  const addressProofRef = form.register("addressProof");
  const ownershipProofRef = form.register("ownershipProof");


  useEffect(() => {
    const activeUserStr = sessionStorage.getItem('activeUser');
    if (activeUserStr) {
      const user = JSON.parse(activeUserStr);
      setCurrentUser(user);
      form.reset({
        fullName: user.name || '',
        phone: user.phone || '',
        idNumber: '',
        facilityName: '',
        facilityAddress: '',
      });
    } else {
      router.push('/account/login');
    }
  }, [router, form]);

  const onSubmit = async (data: OwnerVerificationFormValues) => {
    if (!currentUser) {
      toast({ title: 'Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    try {
      // In a real app, you would upload files to a storage service (like S3 or Firebase Storage)
      // and get back URLs. For this demo, we'll just use the file names.
      const requestPayload = {
        fullName: data.fullName,
        phone: data.phone,
        idNumber: data.idNumber,
        facilityName: data.facilityName,
        facilityAddress: data.facilityAddress,
        identityProofPath: (data.identityProof?.[0] as File)?.name || '',
        addressProofPath: (data.addressProof?.[0] as File)?.name || '',
        ownershipProofPath: (data.ownershipProof?.[0] as File)?.name || '',
      };
      
      if(!requestPayload.identityProofPath || !requestPayload.addressProofPath || !requestPayload.ownershipProofPath) {
          toast({ title: 'Missing Documents', description: 'Please upload all three required documents.', variant: 'destructive' });
          setIsLoading(false);
          return;
      }

      const updatedUser = await requestOwnerRoleAction(currentUser.id, requestPayload);

      if (updatedUser) {
        sessionStorage.setItem('activeUser', JSON.stringify(updatedUser));
        window.dispatchEvent(new Event('userChanged'));
        toast({
          title: 'Request Submitted!',
          description: 'Your request to become a facility owner has been submitted for admin approval. You will be notified once it is reviewed.',
        });
        router.push('/account/profile');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not submit your request.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner size={48} />;
  }

  if (currentUser.status === 'PendingApproval' || currentUser.role === 'FacilityOwner') {
      return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-2xl">
          <Alert>
            <HandCoins className="h-4 w-4" />
            <AlertTitle>
              {currentUser.role === 'FacilityOwner' ? 'You are already a Facility Owner' : 'Request Pending'}
            </AlertTitle>
            <AlertDescription>
              {currentUser.role === 'FacilityOwner' 
                ? "You can manage your facilities from the Owner Portal." 
                : "Your request to become a facility owner is currently under review by our team."}
                 <Link href="/account/profile" className="mt-4 inline-block">
                    <Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Profile</Button>
                </Link>
            </AlertDescription>
          </Alert>
        </div>
      );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Become a Facility Owner" description="Please provide your details for verification. This helps us maintain a secure platform." />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8 max-w-4xl mx-auto">
          
          <Card>
            <CardHeader><CardTitle className="flex items-center"><User className="mr-2 h-5 w-5 text-primary" />Personal Information</CardTitle></CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="fullName" render={({ field }) => (
                <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle className="flex items-center"><Fingerprint className="mr-2 h-5 w-5 text-primary" />Identity Verification</CardTitle></CardHeader>
            <CardContent className="space-y-6">
               <FormField control={form.control} name="idNumber" render={({ field }) => (
                <FormItem><FormLabel>PAN / Aadhar Card Number</FormLabel><FormControl><Input placeholder="Your 12-digit Aadhar or 10-digit PAN" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormItem>
                  <FormLabel className="flex items-center"><Upload className="mr-2 h-4 w-4" />Upload Scanned Identity Proof</FormLabel>
                  <FormControl><Input type="file" {...identityProofRef} /></FormControl>
                  <FormMessage>{form.formState.errors.identityProof?.message?.toString()}</FormMessage>
              </FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5 text-primary" />Business Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
               <FormField control={form.control} name="facilityName" render={({ field }) => (
                <FormItem><FormLabel>Facility Name</FormLabel><FormControl><Input placeholder="Name of your sports venue" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormField control={form.control} name="facilityAddress" render={({ field }) => (
                <FormItem><FormLabel>Facility Address</FormLabel><FormControl><Textarea placeholder="Full address of your facility" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <FormItem>
                  <FormLabel className="flex items-center"><Upload className="mr-2 h-4 w-4" />Upload Facility Address Proof (e.g., Utility Bill)</FormLabel>
                  <FormControl><Input type="file" {...addressProofRef} /></FormControl>
                  <FormMessage>{form.formState.errors.addressProof?.message?.toString()}</FormMessage>
              </FormItem>
               <FormItem>
                  <FormLabel className="flex items-center"><Upload className="mr-2 h-4 w-4" />Upload Facility Ownership Proof (e.g., Lease Agreement)</FormLabel>
                  <FormControl><Input type="file" {...ownershipProofRef} /></FormControl>
                  <FormMessage>{form.formState.errors.ownershipProof?.message?.toString()}</FormMessage>
              </FormItem>
            </CardContent>
          </Card>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push('/account/profile')} disabled={isLoading}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : null}
              {isLoading ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
