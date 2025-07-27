
'use client';

import { useState } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call for sending message
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    toast({
      title: 'Message Sent!',
      description: 'Thank you for contacting us. We will get back to you shortly.',
    });
    // Reset form
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageTitle title="Contact Us" description="We'd love to hear from you! Reach out with any questions or feedback." />

      <div className="grid md:grid-cols-2 gap-12 mt-12 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Send Us a Message</CardTitle>
            <CardDescription>Fill out the form below and our team will respond as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" type="text" placeholder="Regarding my booking..." value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message here..." value={message} onChange={(e) => setMessage(e.target.value)} rows={5} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                {isLoading ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-muted/30 transition-all duration-300 hover:shadow-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Our Contact Information</CardTitle>
            <CardDescription>Alternatively, you can reach us through the following channels.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-lg">
            <div className="flex items-start">
              <MapPin className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold">Address</h4>
                <p className="text-muted-foreground">123 Sports Avenue, Koregaon Park, Pune, 411001</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold">Phone</h4>
                <p className="text-muted-foreground">(020) 1234-5678</p>
              </div>
            </div>
            <div className="flex items-start">
              <Mail className="h-8 w-8 text-primary mr-4 mt-1 shrink-0" />
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-muted-foreground">support@sportsarena.com</p>
              </div>
            </div>
             <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-2">Business Hours</h4>
                <p className="text-muted-foreground">Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p className="text-muted-foreground">Saturday: 10:00 AM - 4:00 PM</p>
                <p className="text-muted-foreground">Sunday: Closed</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
