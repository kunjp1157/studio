
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Facility, Sport, Amenity, RentalEquipment, FacilityOperatingHours, SiteSettings, SportPrice } from '@/lib/types';
import { mockSports, mockAmenities } from '@/lib/mock-data';
import { addFacility, updateFacility, getSiteSettings, getSportById } from '@/lib/data';
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
import { Save, PlusCircle, Trash2, ArrowLeft, UploadCloud, PackageSearch, Building2, MapPinIcon, DollarSign, Info, Image as ImageIcon, Users, SunMoon, TrendingUpIcon, ClockIcon, Zap, Dices, LayoutPanelLeft, LocateFixed, Star, Sparkles, Building as BuildingIcon } from 'lucide-react';
import { generateImageFromPrompt } from '@/ai/flows/generate-image-flow';
import { formatCurrency } from '@/lib/utils';


const rentalEquipmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: "Equipment name is required." }),
  pricePerItem: z.coerce.number().min(0, { message: "Price must be non-negative." }),
  priceType: z.enum(['per_booking', 'per_hour']),
  stock: z.coerce.number().int().min(0, { message: "Stock must be a non-negative integer." }),
  imageUrl: z.string().url({ message: "Must be a valid URL." }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

const facilityFormSchema = z.object({
  name: z.string().min(3, { message: "Facility name must be at least 3 characters." }),
  type: z.enum(['Complex', 'Court', 'Field', 'Studio', 'Pool', 'Box Cricket']),
  address: z.string().min(5, { message: "Address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  location: z.string().min(2, { message: "Area / Neighborhood is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  images: z.array(z.string().url({ message: "Please enter a valid URL or leave empty if not applicable." }).or(z.literal(''))).min(1, { message: "At least one image URL is required (can be placeholder). Use https://placehold.co/800x450.png for placeholders."}).transform(arr => arr.filter(img => img.trim() !== '')),
  sports: z.array(z.string()).min(1, { message: "Select at least one sport." }),
  sportPrices: z.array(z.object({
    sportId: z.string(),
    pricePerHour: z.coerce.number().min(0, "Price must be non-negative."),
  })).optional().default([]),
  amenities: z.array(z.string()).optional().default([]),
  operatingHours: z.array(z.object({
    day: z.enum(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']),
    open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:MM)"}),
    close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: "Invalid time format (HH:MM)"}),
  })).length(7, { message: "Operating hours for all 7 days are required."}),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
  capacity: z.coerce.number().min(0).optional().default(0),
  isPopular: z.boolean().optional().default(false),
  isIndoor: z.boolean().optional().default(false),
  dataAiHint: z.string().optional(),
  availableEquipment: z.array(rentalEquipmentSchema).optional().default([]),
  ownerId: z.string().optional(),
}).refine(data => {
    const selectedSportIds = new Set(data.sports);
    const pricedSportIds = new Set(data.sportPrices.map(p => p.sportId));
    for (const sportId of selectedSportIds) {
      if (!pricedSportIds.has(sportId)) {
        return false; // A selected sport is missing a price
      }
    }
    return true;
}, {
    message: "A price must be set for every selected sport. Please check the Sport Prices section.",
    path: ["sportPrices"],
});

type FacilityFormValues = z.infer<typeof facilityFormSchema>;

interface FacilityAdminFormProps {
  initialData?: Facility | null; 
  onSubmitSuccess?: () => void;
  ownerId?: string;
}

const defaultOperatingHours: FacilityOperatingHours[] = [
  { day: 'Mon', open: '08:00', close: '22:00' }, { day: 'Tue', open: '08:00', close: '22:00' },
  { day: 'Wed', open: '08:00', close: '22:00' }, { day: 'Thu', open: '08:00', close: '22:00' },
  { day: 'Fri', open: '08:00', close: '23:00' }, { day: 'Sat', open: '09:00', close: '23:00' },
  { day: 'Sun', open: '09:00', close: '20:00' },
];


export function FacilityAdminForm({ initialData, onSubmitSuccess, ownerId }: FacilityAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currency, setCurrency] = useState<SiteSettings['defaultCurrency'] | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageGenPrompt, setImageGenPrompt] = useState('');

  useEffect(() => {
    const settings = getSiteSettings();
    setCurrency(settings.defaultCurrency);
  }, []);

  const form = useForm<FacilityFormValues>({
    resolver: zodResolver(facilityFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      sports: initialData.sports.map(s => s.id),
      sportPrices: initialData.sportPrices || [],
      amenities: initialData.amenities.map(a => a.id),
      operatingHours: initialData.operatingHours?.length === 7 ? initialData.operatingHours : defaultOperatingHours,
      images: initialData.images.length > 0 ? initialData.images : [''],
      isIndoor: initialData.isIndoor ?? false,
      rating: initialData.rating ?? 0,
      capacity: initialData.capacity ?? 0,
      isPopular: initialData.isPopular ?? false,
      dataAiHint: initialData.dataAiHint ?? '',
      availableEquipment: initialData.availableEquipment || [],
      ownerId: initialData.ownerId,
    } : {
      name: '', type: 'Court', address: '', city: '', location: '', description: '',
      images: [''], sports: [], sportPrices: [], amenities: [], operatingHours: defaultOperatingHours,
      rating: 0, capacity: 0, isPopular: false, isIndoor: false, dataAiHint: '',
      availableEquipment: [],
      ownerId: ownerId,
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

  const { fields: equipmentFields, append: appendEquipment, remove: removeEquipment } = useFieldArray({
    control: form.control,
    name: "availableEquipment"
  });

  const selectedSportIds = form.watch('sports');
  const sportPrices = form.watch('sportPrices');

  useEffect(() => {
    const currentPricesMap = new Map((form.getValues('sportPrices') || []).map(p => [p.sportId, p]));
    let needsUpdate = false;
    
    // Add new prices for newly selected sports
    selectedSportIds.forEach(sportId => {
        if (!currentPricesMap.has(sportId)) {
            currentPricesMap.set(sportId, { sportId, pricePerHour: 0 });
            needsUpdate = true;
        }
    });

    // Remove prices for deselected sports
    currentPricesMap.forEach((_value, sportId) => {
        if (!selectedSportIds.includes(sportId)) {
            currentPricesMap.delete(sportId);
            needsUpdate = true;
        }
    });

    if (needsUpdate) {
        form.setValue('sportPrices', Array.from(currentPricesMap.values()), { shouldValidate: true, shouldDirty: true });
    }
  }, [selectedSportIds, form]);

  const handleGenerateImage = async () => {
      if (!imageGenPrompt) {
          toast({ title: 'Prompt is empty', description: 'Please describe the image you want to generate.', variant: 'destructive' });
          return;
      }
      setIsGeneratingImage(true);
      try {
          const result = await generateImageFromPrompt({ prompt: imageGenPrompt });
          if (result.imageUrl) {
              const currentImages = form.getValues('images');
              const emptyIndex = currentImages.findIndex(img => !img || img.trim() === '');
              if (emptyIndex !== -1) {
                  form.setValue(`images.${emptyIndex}`, result.imageUrl, { shouldValidate: true, shouldDirty: true });
              } else {
                  appendImage(result.imageUrl);
              }
              toast({ title: 'Image Generated!', description: 'The AI-generated image has been added to your facility images.', className: 'bg-green-500 text-white' });
          }
      } catch (error) {
          console.error("Image generation failed", error);
          toast({ title: 'Image Generation Failed', description: 'Could not generate the image. Please try again.', variant: 'destructive' });
      } finally {
          setIsGeneratingImage(false);
      }
  };

  const onSubmit = async (data: FacilityFormValues) => {
    setIsLoading(true);

    const facilityPayload = {
      ...data,
      sports: data.sports.map(id => getSportById(id)).filter(Boolean) as Sport[],
      amenities: data.amenities.map(id => getAmenityById(id)).filter(Boolean) as Amenity[],
    };

    try {
        if (initialData) {
            await updateFacility({ ...facilityPayload, id: initialData.id } as Facility);
        } else {
            // @ts-ignore
            await addFacility(facilityPayload);
        }

        toast({
            title: initialData ? "Facility Updated" : "Facility Created",
            description: `${data.name} has been successfully saved.`,
        });
        
        if (onSubmitSuccess) {
            onSubmitSuccess();
        } else {
            router.push('/admin/facilities');
        }
    } catch (error) {
        console.error("Error saving facility:", error);
        toast({
            title: "Error",
            description: "Failed to save facility. Please try again.",
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><Building2 className="mr-2 h-5 w-5 text-primary"/>{initialData ? 'Edit Facility' : 'Add New Facility'}</CardTitle>
            <CardDescription>Fill in the details for the sports facility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Facility Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Grand City Arena" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="type" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Building2 className="mr-2 h-4 w-4 text-muted-foreground"/>Facility Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {['Complex', 'Court', 'Field', 'Studio', 'Pool', 'Box Cricket'].map(type => (
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
                <FormLabel className="flex items-center"><MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Full Address</FormLabel>
                <FormControl><Input placeholder="123 Main St, State ZIP" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
             <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="city" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><BuildingIcon className="mr-2 h-4 w-4 text-muted-foreground"/>City</FormLabel>
                        <FormControl><Input placeholder="e.g., Metropolis" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Area / Neighborhood</FormLabel>
                        <FormControl><Input placeholder="e.g., Downtown" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <FormField control={form.control} name="description" render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground"/>Description</FormLabel>
                <FormControl><Textarea placeholder="Detailed description of the facility..." {...field} rows={4} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div>
                <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Image URLs</FormLabel>
                <FormDescription>Add URLs for facility images. Use https://placehold.co/ for placeholders if needed.</FormDescription>
                {imageFields.map((field, index) => (
                    <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}`}
                    render={({ field: imageField }) => (
                        <FormItem className="flex items-center gap-2 mt-2">
                            <FormControl><Input placeholder="https://example.com/image.png" {...imageField} /></FormControl>
                            {imageFields.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                        </FormItem>
                    )}
                    />
                ))}
                 <FormMessage>{form.formState.errors.images?.root?.message || form.formState.errors.images?.[0]?.message}</FormMessage>
                <Button type="button" variant="outline" size="sm" onClick={() => appendImage('')} className="mt-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Image URL
                </Button>
            </div>
             <FormField control={form.control} name="dataAiHint" render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><UploadCloud className="mr-2 h-4 w-4 text-muted-foreground"/>AI Hint for Images (Optional)</FormLabel>
                  <FormControl><Input placeholder="e.g., soccer field night" {...field} /></FormControl>
                  <FormDescription>Keywords to help AI generate placeholder images if URLs are for placeholders.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
            
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary"/> AI Image Generator (Optional)</CardTitle>
                  <CardDescription>Don't have a good photo? Describe your facility and let AI create one for you. The generated image will be added to the Image URLs list above.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                  <div>
                      <Label htmlFor="image-gen-prompt">Image Description</Label>
                      <Textarea
                          id="image-gen-prompt"
                          placeholder="e.g., A modern indoor basketball court with bright lights and polished wooden floors, empty."
                          value={imageGenPrompt}
                          onChange={(e) => setImageGenPrompt(e.target.value)}
                          rows={3}
                          disabled={isGeneratingImage}
                      />
                  </div>
                  <Button type="button" onClick={handleGenerateImage} disabled={isGeneratingImage || !imageGenPrompt}>
                      {isGeneratingImage ? <LoadingSpinner size={20} className="mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                      {isGeneratingImage ? 'Generating...' : 'Generate Image'}
                  </Button>
              </CardContent>
            </Card>


            <FormField control={form.control} name="sports" render={() => (
              <FormItem>
                <FormLabel className="flex items-center"><Zap className="mr-2 h-4 w-4 text-muted-foreground"/>Sports Offered</FormLabel>
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
            
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center'><DollarSign className="mr-2 h-5 w-5 text-primary"/>Sport Prices</CardTitle>
                <CardDescription>Set the price per hour for each sport offered at the facility.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {sportPrices.map((price, index) => {
                    const sport = getSportById(price.sportId);
                    if (!sport) return null;
                    return(
                      <FormField
                        key={price.sportId}
                        control={form.control}
                        name={`sportPrices.${index}.pricePerHour`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{sport.name} Price Per Hour ({currency})</FormLabel>
                            <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )
                  })}
                  {selectedSportIds?.length === 0 && <p className="text-sm text-muted-foreground">Select one or more sports to set their prices.</p>}
                  <FormMessage>{form.formState.errors.sportPrices?.root?.message}</FormMessage>
              </CardContent>
            </Card>

            <FormField control={form.control} name="amenities" render={() => (
              <FormItem>
                <FormLabel className="flex items-center"><Dices className="mr-2 h-4 w-4 text-muted-foreground"/>Amenities</FormLabel>
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
            
            <div>
                <FormLabel className="flex items-center"><ClockIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Operating Hours</FormLabel>
                <div className="space-y-2 mt-2 p-4 border rounded-md">
                {hoursFields.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-[minmax(0,_1fr)_minmax(0,_1fr)_minmax(0,_1fr)] gap-2 items-center">
                        <Label className="font-medium">{item.day}</Label>
                        <FormField
                            control={form.control}
                            name={`operatingHours.${index}.open`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input type="time" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`operatingHours.${index}.close`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl><Input type="time" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
                <FormMessage>{form.formState.errors.operatingHours?.message || form.formState.errors.operatingHours?.root?.message}</FormMessage>
                </div>
            </div>


            <div className="grid md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="rating" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><Star className="mr-2 h-4 w-4 text-muted-foreground"/>Rating (0-5, Optional)</FormLabel>
                        <FormControl><Input type="number" step="0.1" {...field} /></FormControl>
                        <FormDescription>Leave at 0 if not applicable. Will be auto-calculated from reviews.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="capacity" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground"/>Capacity (Optional)</FormLabel>
                        <FormControl><Input type="number" placeholder="0 for not specified" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <FormField control={form.control} name="isPopular" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center"><TrendingUpIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Mark as Popular</FormLabel>
                          <FormDescription>Popular facilities are highlighted.</FormDescription>
                      </div>
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
              )} />
              <FormField control={form.control} name="isIndoor" render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                          <FormLabel className="text-base flex items-center"><SunMoon className="mr-2 h-4 w-4 text-muted-foreground"/>Indoor Facility</FormLabel>
                          <FormDescription>Check if this is an indoor facility.</FormDescription>
                      </div>
                      <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
              )} />
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="flex items-center"><PackageSearch className="mr-2 h-5 w-5 text-primary" /> Manage Rental Equipment</CardTitle>
                    <CardDescription>Define and manage rental equipment available at this facility.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {equipmentFields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg space-y-4 relative bg-muted/30">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7"
                                onClick={() => removeEquipment(index)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Remove Equipment</span>
                            </Button>
                            <FormField
                                control={form.control}
                                name={`availableEquipment.${index}.name`}
                                render={({ field }) => (
                                    <FormItem><FormLabel>Equipment Name</FormLabel><FormControl><Input placeholder="e.g., Soccer Ball" {...field} /></FormControl><FormMessage /></FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField control={form.control} name={`availableEquipment.${index}.pricePerItem`} render={({ field }) => (
                                    <FormItem><FormLabel>Price ({currency})</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`availableEquipment.${index}.priceType`} render={({ field }) => (
                                    <FormItem><FormLabel>Price Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="per_booking">Per Booking</SelectItem><SelectItem value="per_hour">Per Hour</SelectItem></SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name={`availableEquipment.${index}.stock`} render={({ field }) => (
                                    <FormItem><FormLabel>Stock</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name={`availableEquipment.${index}.imageUrl`} render={({ field }) => (
                                <FormItem><FormLabel>Image URL (Optional)</FormLabel><FormControl><Input placeholder="https://placehold.co/100x100.png" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </div>
                    ))}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => appendEquipment({ name: '', pricePerItem: 0, priceType: 'per_booking', stock: 1, imageUrl: '', dataAiHint: '' })}
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Equipment
                    </Button>
                </CardContent>
            </Card>

          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
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
