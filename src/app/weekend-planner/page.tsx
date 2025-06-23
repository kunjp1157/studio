'use client';

import { useState } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wand2, Lightbulb, ThumbsDown, AlertCircle, Sparkles, Activity, DollarSign, Search } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { planWeekend, type PlanWeekendOutput } from '@/ai/flows/weekend-planner';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function WeekendPlannerPage() {
  const [request, setRequest] = useState(
    'My two friends and I want to have a sporty weekend in Metropolis. We love soccer but are open to trying tennis. We are free on Saturday and Sunday afternoons. Our total budget for activities is around $150.'
  );
  
  const [plan, setPlan] = useState<PlanWeekendOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await planWeekend({ request });
      setPlan(result);
    } catch (err) {
      console.error("AI Weekend Planner Error:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get a plan. ${errorMessage}`);
      toast({
        title: "Planner Error",
        description: `Could not fetch AI plan. Please check your request or try again later.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTryAnother = () => {
    setPlan(null);
    setError(null);
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="AI Weekend Planner"
        description="Describe your perfect sporty weekend, and let our AI create a custom itinerary for you!"
      />

      <div className="grid md:grid-cols-2 gap-12 items-start mt-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-primary" /> Describe Your Ideal Weekend</CardTitle>
            <CardDescription>Include details like number of people, preferred sports, budget, and times you're available.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="request" className="text-lg font-medium">Your Request</Label>
                <Textarea
                  id="request"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="e.g., A relaxed weekend for two. We enjoy badminton and swimming. Available Saturday morning and Sunday evening..."
                  rows={6}
                  className="mt-2 text-base"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size={24} className="mr-2" /> : <Wand2 className="mr-2 h-6 w-6" />}
                {isLoading ? 'Planning Your Weekend...' : 'Generate Plan'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 md:mt-0">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <Card className="shadow-lg animate-pulse">
                <CardHeader>
                    <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                </CardContent>
            </Card>
          )}

          {plan && !isLoading && (
            <Card className="shadow-xl border-2 border-primary animate-fadeInUp">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center"><Sparkles className="mr-2 h-7 w-7 text-yellow-400 fill-yellow-400" /> Your AI-Generated Weekend Plan</CardTitle>
                 <CardDescription>{plan.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.plan.map((item, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-background/50">
                        <h3 className="font-bold text-lg text-primary">{item.day} - {item.time}</h3>
                        <p className="font-semibold text-md flex items-center gap-2"><Activity /> {item.activity} at {item.facilityName}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2"><DollarSign size={14}/> Estimated Cost: ${item.estimatedCost}</p>
                        <p className="text-sm italic text-muted-foreground mt-2 p-2 bg-muted rounded-md">{item.reason}</p>
                    </div>
                ))}
              </CardContent>
              <CardFooter className="flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={handleTryAnother}><ThumbsDown className="mr-2 h-4 w-4" /> Let's Try Again</Button>
                <Link href="/facilities">
                    <Button><Search className="mr-2 h-4 w-4" /> Find & Book Facilities</Button>
                </Link>
              </CardFooter>
            </Card>
          )}

          {!plan && !isLoading && !error && (
             <Card className="shadow-lg text-center py-12 bg-muted/40 border-dashed">
                <CardContent>
                    <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium text-foreground">Your Weekend Itinerary Awaits</h3>
                    <p className="text-muted-foreground mt-1">Enter your preferences and let our AI craft the perfect plan for you.</p>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
