
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { SportEvent, Facility, Sport, SiteSettings } from '@/lib/types';
import { addEventAction, updateEventAction } from '@/app/actions'; 
import { getAllFacilitiesAction, getAllSportsAction, getSiteSettingsAction } from '@/app/actions';
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
import { formatISO, parseISO } from 'date-fns';

const eventFormSchema = z.object({
  name: z.string().min(3, { message: "Event name must be at least 3 characters." }),
  facilityId: z.string().min(1, { message: "Please select a facility." }),
  sportId: z.string().min(1, { message: "Please select a sport." }),
  startDate: z.date({ required_error: "Start date is required."}),
  endDate: z.date({ required_error: "End date is required."}),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  entryFee: z.coerce.number().min(0).optional().default(0),
  maxParticipants: z.coerce.number().min(0).optional().default(0),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }).optional().or(z.literal('')),
  imageDataAiHint: z.string().optional(),
}).refine(data => data.endDate >= data.startDate, {
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
    const loadData = async () => {
        const [facilitiesData, sportsData, settingsData] = await Promise.all([
            getAllFacilitiesAction(),
            getAllSportsAction(),
            getSiteSettingsAction()
        ]);
        setFacilities(facilitiesData);
        setSports(sportsData);
        setCurrency(settingsData.defaultCurrency);
    };
    loadData();
  }, []);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      sportId: initialData.sport.id,
      startDate: parseISO(initialData.startDate),
      endDate: parseISO(initialData.endDate),
      entryFee: initialData.entryFee ?? 0,
      maxParticipants: initialData.maxParticipants ?? 0,
      imageUrl: initialData.imageUrl ?? '',
    } : {
      name: '', facilityId: '', sportId: '', description: '',
      entryFee: 0, maxParticipants: 0, imageUrl: '', imageDataAiHint: ''
    },
  });
  
  const toLocalISOString = (date: Date) => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, -1);
    return localISOTime.substring(0, 16);
  }

  const onSubmit = async (data: EventFormValues) => {
    setIsLoading(true);

    try {
        const payload = {
            ...data,
            startDate: data.startDate.toISOString(),
            endDate: data.endDate.toISOString(),
        };

        if (initialData) {
            await updateEventAction({ ...initialData, ...payload });
        } else {
            await addEventAction(payload);
        }
        toast({
            title: initialData ? "Event Updated" : "Event Created",
            description: `${data.name} has been successfully ${initialData ? 'updated' : 'created'}.`,
        });
        
        if (onSubmitSuccess) {
            onSubmitSuccess();
        } else {
            router.push('/admin/events');
        }
    } catch (error) {
        toast({
            title: "Error Saving Event",
            description: error instanceof Error ? error.message : "An unknown error occurred.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
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
                  <FormControl><Input type="datetime-local" value={field.value ? toLocalISOString(field.value) : ''} onChange={(e) => field.onChange(new Date(e.target.value))}/></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="endDate" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><CalendarDays className="mr-2 h-4 w-4 text-muted-foreground"/>End Date & Time</FormLabel>
                  <FormControl><Input type="datetime-local" value={field.value ? toLocalISOString(field.value) : ''} onChange={(e) => field.onChange(new Date(e.target.value))} /></FormControl>
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
