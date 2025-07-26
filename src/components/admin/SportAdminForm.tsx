
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Sport } from '@/lib/types';
import { addSportAction, updateSportAction } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Save, ArrowLeft, Dices, Info, ImageIcon, UploadCloud } from 'lucide-react';
import { Textarea } from '../ui/textarea';

const sportFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  iconName: z.string().optional(),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imageDataAiHint: z.string().optional(),
});

type SportFormValues = z.infer<typeof sportFormSchema>;

interface SportAdminFormProps {
  initialData?: Sport | null;
}

export function SportAdminForm({ initialData }: SportAdminFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SportFormValues>({
    resolver: zodResolver(sportFormSchema),
    defaultValues: initialData || {
      name: '',
      iconName: '',
      imageUrl: '',
      imageDataAiHint: '',
    },
  });

  const onSubmit = async (data: SportFormValues) => {
    setIsLoading(true);
    try {
      if (initialData) {
        await updateSportAction(initialData.id, data);
        toast({ title: 'Sport Updated', description: `"${data.name}" has been successfully updated.` });
      } else {
        await addSportAction(data);
        toast({ title: 'Sport Created', description: `"${data.name}" has been added.` });
      }
      router.push('/admin/sports');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save sport.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Button type="button" variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sports List
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>{initialData ? 'Edit Sport' : 'Add New Sport'}</CardTitle>
            <CardDescription>Fill in the details for the sport.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Info className="mr-2 h-4 w-4 text-muted-foreground" />Sport Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Volleyball" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><Dices className="mr-2 h-4 w-4 text-muted-foreground" />Icon Name</FormLabel>
                  <FormControl><Input placeholder="e.g., Dribbble (from Lucide icons)" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" />Image URL</FormLabel>
                  <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageDataAiHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center"><UploadCloud className="mr-2 h-4 w-4 text-muted-foreground" />AI Hint for Image</FormLabel>
                  <FormControl><Input placeholder="e.g., volleyball net beach" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => router.push('/admin/sports')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
            {initialData ? 'Save Changes' : 'Create Sport'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
