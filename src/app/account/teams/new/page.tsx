
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { mockUser, createTeam } from '@/lib/data';
import { mockSports } from '@/lib/mock-data';
import type { Sport } from '@/lib/types';
import { ArrowLeft, Dices, User, Save } from 'lucide-react';

const createTeamSchema = z.object({
  name: z.string().min(3, { message: "Team name must be at least 3 characters long." }).max(50, { message: "Team name cannot exceed 50 characters." }),
  sportId: z.string({ required_error: "Please select a primary sport for your team." }),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export default function CreateTeamPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
      sportId: '',
    },
  });

  const onSubmit = async (data: CreateTeamFormValues) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
        const newTeam = createTeam({ ...data, captainId: mockUser.id });
        toast({
            title: "Team Created!",
            description: `Your new team, "${newTeam.name}", has been successfully created.`,
        });
        router.push('/account/teams');
    } catch (error) {
        toast({
            title: "Error Creating Team",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
        });
        setIsLoading(false);
    }
  };


  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-2xl">
      <div className="flex justify-between items-center mb-8">
        <PageTitle title="Create a New Team" description="Assemble your squad and get ready to play." />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
           <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Team Details</CardTitle>
                    <CardDescription>Choose a name and primary sport for your new team.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4"/>Team Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., The All-Stars" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="sportId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center"><Dices className="mr-2 h-4 w-4"/>Primary Sport</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a sport" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    {mockSports.map((sport) => (
                                        <SelectItem key={sport.id} value={sport.id}>
                                            {sport.name}
                                        </SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
           </Card>
           <div className="flex justify-end space-x-3">
             <Link href="/account/teams" passHref>
                <Button type="button" variant="outline" disabled={isLoading}><ArrowLeft className="mr-2 h-4 w-4"/> Cancel</Button>
             </Link>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
              Create Team
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
