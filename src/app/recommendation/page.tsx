'use client';

import { useState } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Wand2, Lightbulb, ThumbsUp, ThumbsDown, AlertCircle, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { recommendFacility, type RecommendFacilityOutput } from '@/ai/flows/facility-recommendation';
import { useToast } from '@/hooks/use-toast';
import { mockUser, mockBookings, getFacilityById } from '@/lib/data'; // For pre-filling example data

export default function RecommendationPage() {
  const [preferences, setPreferences] = useState(
    `I like playing soccer and tennis. Looking for facilities in Metropolis, preferably with good parking and available on weekend afternoons. Budget-friendly options are a plus.`
  );
  
  const pastBookingsString = mockBookings
    .filter(b => b.userId === mockUser.id)
    .slice(0, 2) // Take last 2 bookings for brevity
    .map(b => {
        const facility = getFacilityById(b.facilityId);
        return `- ${b.facilityName} (${facility?.type || 'Unknown Type'}) on ${b.date} from ${b.startTime} to ${b.endTime} for ${facility?.sports.map(s => s.name).join('/') || 'activity'}. Status: ${b.status}.`;
    })
    .join('\n');

  const [pastBookingHistory, setPastBookingHistory] = useState(pastBookingsString || 'No significant past booking history provided.');
  const [recommendation, setRecommendation] = useState<RecommendFacilityOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const result = await recommendFacility({ preferences, pastBookingHistory });
      setRecommendation(result);
    } catch (err) {
      console.error("AI Recommendation Error:", err);
      setError('Failed to get recommendation. Please try again.');
      toast({
        title: "Recommendation Error",
        description: "Could not fetch AI recommendation. Please check your input or try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle 
        title="AI Facility Recommender"
        description="Not sure where to play? Let our AI suggest the perfect facility based on your preferences and history."
      />

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center"><Lightbulb className="mr-2 h-6 w-6 text-primary" /> Tell Us About Yourself</CardTitle>
            <CardDescription>The more details you provide, the better the recommendation!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="preferences" className="text-lg font-medium">Your Preferences</Label>
                <Textarea
                  id="preferences"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g., I love playing basketball indoors, need parking, and prefer evening slots near downtown."
                  rows={5}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="pastBookingHistory" className="text-lg font-medium">Your Past Booking History (Optional)</Label>
                <Textarea
                  id="pastBookingHistory"
                  value={pastBookingHistory}
                  onChange={(e) => setPastBookingHistory(e.target.value)}
                  placeholder="e.g., Booked Grand Arena (Soccer) on 2023-05-10, 6 PM. Enjoyed the floodlights but found it a bit pricey."
                  rows={5}
                  className="mt-2"
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size={24} className="mr-2" /> : <Wand2 className="mr-2 h-6 w-6" />}
                {isLoading ? 'Thinking...' : 'Get Recommendation'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && !recommendation && (
            <Card className="shadow-lg animate-pulse">
                <CardHeader>
                    <div className="h-8 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                </CardContent>
            </Card>
          )}

          {recommendation && !isLoading && (
            <Card className="shadow-xl border-2 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center"><Sparkles className="mr-2 h-7 w-7 text-yellow-400 fill-yellow-400" /> AI Recommendation</CardTitle>
                <CardDescription>Here's a facility we think you'll love!</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold text-primary">{recommendation.facilityName}</h3>
                <p><strong className="font-medium">Type:</strong> {recommendation.facilityType}</p>
                <p><strong className="font-medium">Location:</strong> {recommendation.location}</p>
                <div>
                  <strong className="font-medium">Reason:</strong>
                  <p className="text-muted-foreground italic mt-1 bg-secondary p-3 rounded-md">{recommendation.reason}</p>
                </div>
              </CardContent>
              <CardFooter className="flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" onClick={() => { setRecommendation(null); setError(null); }}><ThumbsDown className="mr-2 h-4 w-4" /> Not Quite</Button>
                <Button onClick={() => toast({ title: "Great Choice!", description: "This facility has been noted. (Mock action)"})}><ThumbsUp className="mr-2 h-4 w-4" /> Sounds Good!</Button>
              </CardFooter>
            </Card>
          )}

          {!recommendation && !isLoading && !error && (
             <Card className="shadow-lg text-center py-10">
                <CardContent>
                    <Sparkles className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">Your personalized recommendation will appear here.</p>
                </CardContent>
             </Card>
          )}
        </div>
      </div>
    </div>
  );
}
