
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { SportEvent, Facility, Sport, SiteSettings } from '@/lib/types';
import { getAllSports, getAllFacilities, getSportById, addEvent, updateEvent, getSiteSettings } from '@/lib/data'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Save, ArrowLeft, CalendarDays, DollarSign, Users, ImageIcon, Info, Zap } from 'lucide-react';

const eventFormSchema = z.object({
  name: z.string().min(3, { message: "Event name must be at least 3 characters." }),
  facilityId: z.string().min(1, { message: "Please select a facility." }),
  sportId: z.string().min(1, { message: "Please select a sport." }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid start date format." }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid end date format." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  entryFee: z.coerce.number().min(0).optional().default(0),
  maxParticipants: z.coerce.number().min(0).optional().default(0),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  imageDataAiHint: z.string().optional(),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: "End date cannot be before start date.",
  path: ["endDate"],
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface EventAdminFormProps {
  initialData?: SportEvent | null;
  onSubmitSuccess?: () => void;
}

export function EventAdminForm({ initialData, onSubmitSuccess }: EventAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);

  useEffect(() => {
    // Simulate fetching facilities and sports for select dropdowns
    setFacilities(getAllFacilities());
    setSports(getAllSports());
    
    const settingsInterval = setInterval(() => {
      const currentSettings = getSiteSettings();
      setCurrency(prev => currentSettings.defaultCurrency !== prev ? currentSettings.defaultCurrency : prev);
    }, 3000);
    const currentSettings = getSiteSettings();
    setCurrency(currentSettings.defaultCurrency);
    
    return () => clearInterval(settingsInterval);
  }, []);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      sportId: initialData.sport.id, // Store sport ID for the form
      startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().substring(0, 16) : '', // Format for datetime-local
      endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().substring(0, 16) : '', // Format for datetime-local
      entryFee: initialData.entryFee ?? 0,
      maxParticipants: initialData.maxParticipants ?? 0,
      imageUrl: initialData.imageUrl ?? '',
    } : {
      name: '', facilityId: '', sportId: '', startDate: '', endDate: '', description: '',
      entryFee: 0, maxParticipants: 0, imageUrl: '', imageDataAiHint: ''
    },
  });

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form Data Submitted:", data);

    // Prepare data for mock functions (add/updateEvent)
    const eventPayload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    
    if (initialData) {
      // Update existing event
      // The updateEvent function in data.ts will handle fetching sport by sportId
      // @ts-ignore // registeredParticipants is not in form but part of SportEvent
      updateEvent({ ...initialData, ...eventPayload }); 
    } else {
      // Create new event
      addEvent(eventPayload as Omit<SportEvent, 'id' | 'sport' | 'registeredParticipants'> & { sportId: string });
    }

    setIsLoading(false);
    toast({
      title: initialData ? "Event Updated" : "Event Created",
      description: `${data.name} has been successfully ${initialData ? 'updated' : 'created'}.`,
    });
    
    if (onSubmitSuccess) {
      onSubmitSuccess();
    } else {
      router.push('/admin/events');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Button type="button" variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events List
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{initialData ? 'Edit Event' : 'Add New Event'}</CardTitle>
            <CardDescription>Fill in the details for the sports event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Event Name</FormLabel>
                <FormControl><Input placeholder="e.g., Summer Soccer Championship" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="facilityId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Facility</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select facility" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {facilities.map(facility => (
                        <SelectItem key={facility.id} value={facility.id}>{facility.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="sportId" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Zap className="mr-2 h-4 w-4 text-muted-foreground"/>Sport</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {sports.map(sport => (
                        <SelectItem key={sport.id} value={sport.id}>{sport.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="startDate" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>Start Date & Time</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>End Date & Time</FormLabel>
                  <FormControl><Input type="datetime-local" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Description</FormLabel>
                <FormControl><Textarea placeholder="Detailed description of the event..." {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="entryFee" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center"><DollarSign className="mr-2 h-4 w-4 text-muted-foreground"/>Entry Fee ({currency})</FormLabel>
                    <FormControl><Input type="number" placeholder="0 for free entry" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
                <FormField control={form.control} name="maxParticipants" render={({ field }) => (
                <FormItem>
                    <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground"/>Max Participants</FormLabel>
                    <FormControl><Input type="number" placeholder="0 for unlimited" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
                )} />
            </div>

            <FormField control={form.control} name="imageUrl" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Image URL (Optional)</FormLabel>
                <FormControl><Input placeholder="https://example.com/event-image.png" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="imageDataAiHint" render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Hint for Image (Optional)</FormLabel>
                  <FormControl><Input placeholder="e.g., soccer tournament sunny day" {...field} /></FormControl>
                  <FormDescription>Keywords if using a placeholder URL that needs AI generation guidance.</FormDescription>
                </FormItem>
              )} />

          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/events')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {initialData ? 'Save Changes' : 'Create Event'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
