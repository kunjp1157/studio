'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Facility, Sport, Amenity } from '@/lib/types';
import { mockSports, mockAmenities } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Save, PlusCircle, Trash2, ArrowLeft, UploadCloud } from 'lucide-react';

const facilityFormSchema = z.object({
  name: z.string().min(3, { message: "Facility name must be at least 3 characters." }),
  type: z.enum(['Complex', 'Court', 'Field', 'Studio', 'Pool']),
  address: z.string().min(5, { message: "Address is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  images: z.array(z.string().url({ message: "Please enter a valid URL." })).min(1, { message: "At least one image URL is required."}),
  sports: z.array(z.string()).min(1, { message: "Select at least one sport." }),
  amenities: z.array(z.string()).optional(),
  operatingHours: z.array(z.object({
    day: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:MM)"}),
    close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:MM)"}),
  })).length(7, { message: "Operating hours for all 7 days are required."}),
  pricePerHour: z.coerce.number().min(0, { message: "Price must be a positive number." }),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  capacity: z.coerce.number().min(0).optional().default(0),
  isPopular: z.boolean().optional().default(false),
  dataAiHint: z.string().optional(),
});

type FacilityFormValues = z.infer<typeof facilityFormSchema>;

interface FacilityAdminFormProps {
  initialData?: Facility | null; // For editing
  onSubmitSuccess?: () => void;
}

const defaultOperatingHours = [
  { day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' },
  { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' },
  { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' },
  { day: 'Sun', open: '09:00', close: '20:00' },
] as FacilityFormValues['operatingHours'];


export function FacilityAdminForm({ initialData, onSubmitSuccess }: FacilityAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      sports: initialData.sports.map(s => s.id),
      amenities: initialData.amenities.map(a => a.id),
      operatingHours: initialData.operatingHours.length === 7 ? initialData.operatingHours : defaultOperatingHours,
    } : {
      name: '', type: 'Court', address: '', location: '', description: '',
      images: [''], sports: [], amenities: [], operatingHours: defaultOperatingHours,
      pricePerHour: 0, rating: 0, capacity: 0, isPopular: false, dataAiHint: ''
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control: form.control,
    name: "images"
  });
  
  const { fields: hoursFields } = useFieldArray({
    control: form.control,
    name: "operatingHours"
  });


  const onSubmit = async (data: FacilityFormValues) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Form Data Submitted:", data);
    setIsLoading(false);
    toast({
      title: initialData ? "Facility Updated" : "Facility Created",
      description: `${data.name} has been successfully ${initialData ? 'updated' : 'created'}.`,
    });
    if (onSubmitSuccess) {
      onSubmitSuccess();
    } else {
      router.push('/admin/facilities');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Button type="button" variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Facilities List
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>{initialData ? 'Edit Facility' : 'Add New Facility'}</CardTitle>
            <CardDescription>Fill in the details for the sports facility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Grand City Arena" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel>Facility Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['Complex', 'Court', 'Field', 'Studio', 'Pool'].map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="address" render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input placeholder="123 Main St, City, State ZIP" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Location (City/Area)</FormLabel>
                        <FormControl><Input placeholder="e.g., Metropolis Downtown" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="pricePerHour" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Price Per Hour ($)</FormLabel>
                        <FormControl><Input type="number" placeholder="25" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Detailed description of the facility..." {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Image URLs */}
            <div>
                <FormLabel>Image URLs</FormLabel>
                {imageFields.map((field, index) => (
                    <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}`}
                    render={({ field: imageField }) => (
                        <FormItem className="flex items-center gap-2 mt-2">
                            <FormControl><Input placeholder="https://example.com/image.png" {...imageField} /></FormControl>
                            {imageFields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => appendImage('')} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Image URL
                </Button>
            </div>
             <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                <FormItem>
                  <FormLabel>AI Hint for Images (Optional)</FormLabel>
                  <FormControl><Input placeholder="e.g., soccer field night" {...field} /></FormControl>
                  <FormDescription>Keywords to help AI generate placeholder images if URLs are for placeholders.</FormDescription>
                </FormItem>
              )} />


            {/* Sports Offered */}
            <FormField control={form.control} name="sports" render={() => (
              <FormItem>
                <FormLabel>Sports Offered</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                  {mockSports.map((sport) => (
                    <FormField
                      key={sport.id}
                      control={form.control}
                      name="sports"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(sport.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), sport.id])
                                  : field.onChange(field.value?.filter((value) => value !== sport.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{sport.name}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />
            
            {/* Amenities */}
            <FormField control={form.control} name="amenities" render={() => (
              <FormItem>
                <FormLabel>Amenities</FormLabel>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                  {mockAmenities.map((amenity) => (
                    <FormField
                      key={amenity.id}
                      control={form.control}
                      name="amenities"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), amenity.id])
                                  : field.onChange(field.value?.filter((value) => value !== amenity.id));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{amenity.name}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />
            
            {/* Operating Hours */}
            <div>
                <FormLabel>Operating Hours</FormLabel>
                <div className="space-y-2 mt-2 p-4 border rounded-md">
                {hoursFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-3 gap-2 items-center">
                        <Label className="font-medium">{field.day}</Label>
                        <FormField
                            control={form.control}
                            name={`operatingHours.${index}.open`}
                            render={({ field: openField }) => (
                                <FormItem>
                                    <FormControl><Input type="time" {...openField} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`operatingHours.${index}.close`}
                            render={({ field: closeField }) => (
                                <FormItem>
                                    <FormControl><Input type="time" {...closeField} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
                <FormMessage>{form.formState.errors.operatingHours?.message}</FormMessage>
                </div>
            </div>


            <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="rating" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rating (0-5)</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="capacity" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Capacity (Optional)</FormLabel>
                        <FormControl><Input type="number" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
             <FormField control={form.control} name="isPopular" render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">Mark as Popular</FormLabel>
                        <FormDescription>Popular facilities are highlighted in listings.</FormDescription>
                    </div>
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                </FormItem>
            )} />


          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/facilities')} disabled={isLoading}>
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
