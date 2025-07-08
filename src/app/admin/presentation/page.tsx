'use client';

import { useState } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, AlertCircle, LayoutTemplate, List, Presentation as PresentationIcon, Lightbulb } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { generatePresentation, type GeneratePresentationOutput } from '@/ai/flows/generate-presentation-flow';
import { Separator } from '@/components/ui/separator';
import { getIconComponent } from '@/components/shared/Icon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Slide = ({ title, bulletPoints, narrative, icon, index }: { title: string; bulletPoints: string[]; narrative?: string; icon?: string; index: number }) => {
  const IconComponent = getIconComponent(icon) || Lightbulb;
  
  return (
    <Card className="shadow-md h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:border-primary/50">
        <CardHeader>
            <CardTitle className="flex items-center text-lg">
                <IconComponent className="mr-3 h-6 w-6 text-primary" />
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
            {narrative && (
                <p className="text-sm text-foreground/90 bg-muted/50 p-3 rounded-md border-l-4 border-primary">
                    {narrative}
                </p>
            )}
            <ul className="space-y-2">
                {bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start">
                        <List className="h-4 w-4 mr-2 mt-1 shrink-0 text-muted-foreground" />
                        <span className="text-sm text-foreground">{point}</span>
                    </li>
                ))}
            </ul>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
            Slide {index + 1}
        </CardFooter>
    </Card>
  );
};

export default function PresentationPage() {
  const [presentation, setPresentation] = useState<GeneratePresentationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState('Quarterly Business Review & Growth Strategy');
  const { toast } = useToast();

  const handleGenerateClick = async () => {
    if (!topic) {
        toast({ title: "Topic required", description: "Please enter a topic for the presentation.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    setError(null);
    setPresentation(null);

    try {
      const result = await generatePresentation({ topic });
      setPresentation(result);
      toast({
        title: "Presentation Generated!",
        description: "Your AI-powered business overview is ready.",
      });
    } catch (err) {
      console.error("AI Presentation Error:", err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate presentation. ${errorMessage}`);
      toast({
        title: "Presentation Error",
        description: "Could not fetch AI presentation. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-8">
        <PageTitle 
            title="AI Presentation Generator"
            description="Generate a business overview presentation based on live application data."
        />

        {!presentation && !isLoading && (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Generate Your Presentation</CardTitle>
                    <CardDescription>Enter a topic below to have the AI analyze your app's data and create a summary presentation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div>
                        <Label htmlFor="topic-input">Presentation Topic</Label>
                        <Input 
                            id="topic-input"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g., Quarterly Business Review"
                        />
                     </div>
                     <Button size="lg" onClick={handleGenerateClick} disabled={!topic}>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Presentation
                    </Button>
                </CardContent>
            </Card>
        )}

        {isLoading && (
            <div className="text-center space-y-4 py-10">
                <LoadingSpinner size={48} />
                <p className="text-muted-foreground">The AI is analyzing data and building your presentation...</p>
                <p className="text-xs text-muted-foreground/80">(This may take up to 30 seconds)</p>
            </div>
        )}

        {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

        {presentation && (
            <div className="space-y-8 animate-fadeInUp">
                <div className="text-center p-6 bg-card rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold font-headline flex items-center justify-center gap-3">
                        <PresentationIcon className="h-8 w-8 text-primary" />
                        {presentation.presentationTitle}
                    </h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">{presentation.summary}</p>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 items-stretch">
                    {presentation.slides.map((slide, index) => (
                        <Slide 
                            key={index} 
                            title={slide.slideTitle} 
                            bulletPoints={slide.bulletPoints}
                            narrative={slide.narrative}
                            icon={slide.icon}
                            index={index} 
                        />
                    ))}
                </div>

                <div className="text-center mt-8">
                    <Button onClick={handleGenerateClick} disabled={isLoading}>
                         <Sparkles className="mr-2 h-5 w-5" />
                         Regenerate Presentation
                    </Button>
                </div>
            </div>
        )}
    </div>
  );
}
