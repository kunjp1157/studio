
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Sport, Amenity, Facility, FacilityOperatingHours, SportPrice, UserProfile } from '@/lib/types';
import { addFacilityAction, updateFacilityAction } from '@/app/actions';
import { getAllSportsAction, getAllAmenitiesAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Save, ArrowLeft, Trash2, PlusCircle, Building2, Info, MapPin, DollarSign, ListChecks, Clock, Dices, ImageIcon, UploadCloud } from 'lucide-react';
import { getIconComponent } from '@/components/shared/Icon';
import Image from 'next/image';
import { Label } from '@/components/ui/label';

const operatingHoursSchema = z.object({
  day: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
  open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time (HH:MM)" }),
  close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time (HH:MM)" }),
});

const sportPriceSchema = z.object({
    sportId: z.string(),
    price: z.coerce.number().min(0, "Price must be non-negative."),
    pricingModel: z.enum(['per_hour_flat', 'per_hour_per_person']).default('per_hour_flat'),
});

const facilityFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  type: z.enum(['Complex', 'Court', 'Field', 'Studio', 'Pool', 'Box Cricket']),
  address: z.string().min(10, "Address is too short."),
  city: z.string().min(2, "City is required."),
  location: z.string().min(2, "Location/Area is required."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  sports: z.array(z.string()).min(1, "Select at least one sport."),
  amenities: z.array(z.string()).optional(),
  isIndoor: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  capacity: z.coerce.number().optional(),
  imageUrl: z.string().optional().or(z.literal('')),
  imageDataAiHint: z.string().optional(),
  operatingHours: z.array(operatingHoursSchema).min(1, "Please define operating hours for at least one day."),
  sportPrices: z.array(sportPriceSchema).min(1, "Please set a price for at least one selected sport."),
});

type FacilityFormValues = z.infer<typeof facilityFormSchema>;

interface FacilityAdminFormProps {
  initialData?: Facility;
  ownerId?: string; // Optional ownerId for when an owner creates a facility
  onSubmitSuccess?: () => void;
  currentUserRole?: 'Admin' | 'FacilityOwner' | 'User';
}

const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function FacilityAdminForm({ initialData, ownerId, onSubmitSuccess, currentUserRole = 'Admin' }: FacilityAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [allSports, setAllSports] = useState<Sport[]>([]);
  const [allAmenities, setAllAmenities] = useState<AmenityType[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: initialData ? {
        ...initialData,
        sports: initialData.sports.map(s => s.id),
        amenities: initialData.amenities.map(a => a.id),
        capacity: initialData.capacity ?? undefined,
        imageUrl: initialData.imageUrl ?? '',
        imageDataAiHint: initialData.dataAiHint ?? '',
    } : {
        name: '', type: 'Complex', address: '', city: 'Pune', location: '', description: '',
        sports: [], amenities: [], isIndoor: false, isPopular: false, operatingHours: [], sportPrices: []
    },
  });

   const { fields: hoursFields, append: appendHour, remove: removeHour } = useFieldArray({
    control: form.control, name: "operatingHours"
  });
  const { fields: priceFields, append: appendPrice, remove: removePrice } = useFieldArray({
    control: form.control, name: "sportPrices"
  });

  const watchedSports = form.watch("sports");

  useEffect(() => {
    const currentPrices = form.getValues("sportPrices") || [];
    const newPrices: SportPrice[] = [];
    
    // Keep existing prices for selected sports
    currentPrices.forEach(price => {
        if (watchedSports.includes(price.sportId)) {
            newPrices.push(price);
        }
    });

    // Add new price fields for newly selected sports
    watchedSports.forEach(sportId => {
        if (!newPrices.some(p => p.sportId === sportId)) {
            const sport = allSports.find(s => s.id === sportId);
            newPrices.push({
                sportId: sportId,
                price: 0,
                pricingModel: 'per_hour_flat'
            });
        }
    });
    
    // This direct update might be tricky. Let's manage it manually.
    const sportIdsInForm = currentPrices.map(p => p.sportId);
    const sportIdsToSet = newPrices.map(p => p.sportId);

    if (JSON.stringify(sportIdsInForm.sort()) !== JSON.stringify(sportIdsToSet.sort())) {
        form.setValue('sportPrices', newPrices, { shouldValidate: true });
    }

  }, [watchedSports, form, allSports]);

  useEffect(() => {
    const loadData = async () => {
        const [sportsData, amenitiesData] = await Promise.all([
            getAllSportsAction(),
            getAllAmenitiesAction()
        ]);
        setAllSports(sportsData);
        setAllAmenities(amenitiesData);
    };
    loadData();
  }, []);
  
  const addAllWeekHours = () => {
    const existingDays = hoursFields.map(field => field.day);
    days.forEach(day => {
        if (!existingDays.includes(day)) {
            appendHour({ day, open: '08:00', close: '22:00' });
        }
    })
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({ title: 'File too large', description: 'Please select an image smaller than 5MB.', variant: 'destructive' });
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        form.setValue('imageUrl', result, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    }
  };


  const onSubmit = async (data: FacilityFormValues) => {
    setIsLoading(true);
    const payload = { ...data, ownerId: ownerId, status: ownerId ? 'PendingApproval' : 'Active' };
    
    try {
      if (initialData) {
        await updateFacilityAction({ ...payload, id: initialData.id });
      } else {
        await addFacilityAction(payload);
      }
      toast({
        title: initialData ? "Facility Updated" : "Facility Added",
        description: `${data.name} has been successfully ${initialData ? 'updated' : 'added'}.`,
      });
      
      // Trigger a global event to notify other components of data change
      window.dispatchEvent(new Event('dataChanged'));

      if(onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        // Default behavior for admin
        router.push('/admin/facilities');
      }

    } catch (error) {
      toast({
        title: "Error Saving Facility",
        description: "An unknown error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
             <Card>
                <CardHeader><CardTitle className="flex items-center"><Building2 className="mr-2 h-5 w-5 text-primary" />Basic Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                     <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem><FormLabel>Facility Name</FormLabel><FormControl><Input placeholder="e.g., Grand Sports Arena" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem><FormLabel>Facility Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select facility type" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Complex">Complex</SelectItem>
                            <SelectItem value="Court">Court</SelectItem>
                            <SelectItem value="Field">Field</SelectItem>
                            <SelectItem value="Studio">Studio</SelectItem>
                             <SelectItem value="Pool">Pool</SelectItem>
                             <SelectItem value="Box Cricket">Box Cricket</SelectItem>
                          </SelectContent>
                        </Select><FormMessage /></FormItem>
                    )} />
                     <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Detailed description of the facility..." {...field} rows={4}/></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center"><MapPin className="mr-2 h-5 w-5 text-primary" />Location Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="address" render={({ field }) => (
                        <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input placeholder="123, Main Street" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <div className="grid grid-cols-2 gap-4">
                         <FormField control={form.control} name="city" render={({ field }) => (
                            <FormItem><FormLabel>City</FormLabel><FormControl><Input placeholder="e.g., Pune" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="location" render={({ field }) => (
                            <FormItem><FormLabel>Area / Location</FormLabel><FormControl><Input placeholder="e.g., Koregaon Park" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>
                </CardContent>
             </Card>
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-primary" />Facility Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="w-full aspect-video relative bg-muted rounded-md overflow-hidden flex items-center justify-center">
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Facility preview" fill className="object-cover" />
                      ) : (
                        <p className="text-muted-foreground">Image preview will appear here</p>
                      )}
                    </div>
                    <Input
                      id="image-upload"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/png, image/jpeg, image/gif, image/webp"
                    />
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                      <UploadCloud className="mr-2 h-4 w-4" /> Upload Image
                    </Button>
                     <FormField control={form.control} name="imageDataAiHint" render={({ field }) => (
                        <FormItem>
                            <FormLabel>AI Hint for Image (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g., soccer stadium at night" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                     )} />
                </CardContent>
             </Card>
          </div>
          <div className="md:col-span-1 space-y-8">
            <Card>
                <CardHeader><CardTitle className="flex items-center"><Dices className="mr-2 h-5 w-5 text-primary" />Sports & Pricing</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="sports" render={() => (
                      <FormItem>
                        <FormLabel>Available Sports</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {allSports.map(sport => (
                            <FormField key={sport.id} control={form.control} name="sports" render={({ field }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <FormControl><Checkbox checked={field.value?.includes(sport.id)} onCheckedChange={checked => {
                                  return checked ? field.onChange([...(field.value || []), sport.id]) : field.onChange(field.value?.filter(id => id !== sport.id))
                                }} /></FormControl>
                                <FormLabel className="font-normal">{sport.name}</FormLabel>
                              </FormItem>
                            )} />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="space-y-2 pt-4">
                      {priceFields.map((field, index) => (
                        <div key={field.id} className="p-2 border rounded-md space-y-2 bg-muted/20">
                          <Label className="font-semibold">{allSports.find(s => s.id === field.sportId)?.name}</Label>
                          <div className="grid grid-cols-2 gap-2">
                             <FormField control={form.control} name={`sportPrices.${index}.price`} render={({ field: priceField }) => (
                                <FormItem><FormLabel className="text-xs">Price/hr</FormLabel><FormControl><Input type="number" step="0.01" {...priceField} /></FormControl><FormMessage /></FormItem>
                             )} />
                             <FormField control={form.control} name={`sportPrices.${index}.pricingModel`} render={({ field: modelField }) => (
                                <FormItem><FormLabel className="text-xs">Model</FormLabel><Select onValueChange={modelField.onChange} defaultValue={modelField.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent><SelectItem value="per_hour_flat">Per Hour</SelectItem><SelectItem value="per_hour_per_person">Per Person/Hour</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                             )} />
                          </div>
                        </div>
                      ))}
                    </div>
                     <FormMessage>{form.formState.errors.sportPrices?.root?.message || form.formState.errors.sportPrices?.message}</FormMessage>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="flex items-center"><Clock className="mr-2 h-5 w-5 text-primary" />Operating Hours</CardTitle>
                        <Button type="button" size="sm" variant="outline" onClick={addAllWeekHours}>All Week</Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-2">
                    {hoursFields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <Input value={field.day} readOnly className="w-20 font-medium" />
                            <Input type="time" {...form.register(`operatingHours.${index}.open`)} />
                            <span>-</span>
                            <Input type="time" {...form.register(`operatingHours.${index}.close`)} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeHour(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    ))}
                    <Button type="button" size="sm" variant="secondary" onClick={() => appendHour({ day: 'Mon', open: '08:00', close: '22:00'})}><PlusCircle className="mr-2 h-4 w-4" /> Add Day</Button>
                    <FormMessage>{form.formState.errors.operatingHours?.message}</FormMessage>
                </CardContent>
            </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Amenities</CardTitle></CardHeader>
                <CardContent>
                    <FormField control={form.control} name="amenities" render={() => (
                      <FormItem>
                        <div className="grid grid-cols-2 gap-2">
                          {allAmenities.map(amenity => {
                            const Icon = getIconComponent(amenity.iconName);
                            return (
                               <FormField key={amenity.id} control={form.control} name="amenities" render={({ field }) => (
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                    <FormControl><Checkbox checked={field.value?.includes(amenity.id)} onCheckedChange={checked => {
                                    return checked ? field.onChange([...(field.value || []), amenity.id]) : field.onChange(field.value?.filter(id => id !== amenity.id))
                                    }} /></FormControl>
                                    <FormLabel className="font-normal flex items-center gap-1.5"><Icon className="h-4 w-4 text-muted-foreground"/> {amenity.name}</FormLabel>
                                </FormItem>
                                )} />
                            )
                          })}
                        </div>
                      </FormItem>
                    )} />
                </CardContent>
             </Card>
             <Card>
                <CardHeader><CardTitle className="flex items-center"><Info className="mr-2 h-5 w-5 text-primary" />Other Details</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <FormField control={form.control} name="isIndoor" render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Indoor Facility</FormLabel></FormItem>
                    )} />
                    {currentUserRole === 'Admin' && <FormField control={form.control} name="isPopular" render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="font-normal">Mark as Popular</FormLabel></FormItem>
                    )} />}
                    <FormField control={form.control} name="capacity" render={({ field }) => (
                      <FormItem><FormLabel>Capacity (Optional)</FormLabel><FormControl><Input type="number" placeholder="e.g., 50" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                </CardContent>
             </Card>
          </div>
        </div>
        <div className="flex justify-end space-x-2 sticky bottom-0 bg-background py-4 px-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {initialData ? 'Save Changes' : 'Create Facility'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
