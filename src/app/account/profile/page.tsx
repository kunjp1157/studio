
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { mockUser, mockSports, mockMembershipPlans } from '@/lib/data';
import type { UserProfile as UserProfileType, Sport, MembershipPlan, Achievement } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Save, Edit3, Mail, Phone, Heart, Award, Zap, Medal, Gem, Sparkles, ShieldCheck, History } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching user data
    setTimeout(() => {
      setUser(mockUser);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  
  const handleSelectChange = (name: keyof UserProfileType, value: string) => {
    if (!user) return;
    setUser({ ...user, [name]: value as UserProfileType[keyof UserProfileType] });
  };

  const handlePreferredSportsChange = (sportId: string) => {
    if (!user) return;
    const currentPreferredSports = user.preferredSports || [];
    const sport = mockSports.find(s => s.id === sportId);
    if (!sport) return;

    const isAlreadyPreferred = currentPreferredSports.some(s => s.id === sportId);
    let updatedSports: Sport[];

    if (isAlreadyPreferred) {
      updatedSports = currentPreferredSports.filter(s => s.id !== sportId);
    } else {
      updatedSports = [...currentPreferredSports, sport];
    }
    setUser({ ...user, preferredSports: updatedSports });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate saving data
    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully saved.",
      });
    }, 1000);
  };

  if (isLoading && !user) {
    return <div className="container mx-auto py-12 px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-200px)]"><LoadingSpinner size={48} /></div>;
  }

  if (!user) {
    return <div className="container mx-auto py-12 px-4 md:px-6">Error loading profile.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex justify-between items-center mb-8">
        <PageTitle title="My Profile" description="View and manage your account details, preferences, and achievements." />
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-6">
              <div className="relative">
                  <Avatar className="h-24 w-24 border-2 border-primary shadow-md">
                  <AvatarImage src={user.profilePictureUrl} alt={user.name} data-ai-hint={user.dataAiHint || "user avatar"} />
                  <AvatarFallback className="text-3xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                      <Button variant="outline" size="icon" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-background hover:bg-muted" onClick={() => toast({title: "Feature Coming Soon!"})}>
                          <UploadCloud className="h-4 w-4" />
                          <span className="sr-only">Change photo</span>
                      </Button>
                  )}
              </div>
              <div>
                <CardTitle className="text-3xl font-headline">{user.name}</CardTitle>
                <CardDescription className="flex items-center text-base mt-1">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {user.email}
                </CardDescription>
                {user.phone && 
                  <CardDescription className="flex items-center text-base mt-1">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {user.phone}
                  </CardDescription>
                }
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8 mt-6">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <Label htmlFor="name" className="text-base">Full Name</Label>
                  <Input id="name" name="name" value={user.name} onChange={handleInputChange} disabled={!isEditing} className="mt-1 text-base p-3"/>
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">Email Address</Label>
                  <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} disabled={!isEditing} className="mt-1 text-base p-3"/>
                </div>
                <div>
                  <Label htmlFor="phone" className="text-base">Phone Number (Optional)</Label>
                  <Input id="phone" name="phone" type="tel" value={user.phone || ''} onChange={handleInputChange} disabled={!isEditing} className="mt-1 text-base p-3"/>
                </div>
                <div>
                  <Label htmlFor="membershipLevel" className="text-base flex items-center"><ShieldCheck className="inline mr-2 h-5 w-5 text-primary" />Membership Level</Label>
                  <Select 
                      name="membershipLevel" 
                      value={user.membershipLevel} 
                      onValueChange={(value) => handleSelectChange('membershipLevel', value)}
                      disabled={!isEditing}
                  >
                    <SelectTrigger id="membershipLevel" className="mt-1 text-base p-3 h-auto">
                      <SelectValue placeholder="Select membership" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockMembershipPlans.map(plan => (
                        <SelectItem key={plan.id} value={plan.name} className="text-base">{plan.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-base flex items-center"><Heart className="inline mr-2 h-5 w-5 text-destructive" />Preferred Sports</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2 p-4 border rounded-md bg-muted/30">
                  {mockSports.map(sport => {
                      const SportIcon = sport.icon || Zap;
                      return (
                          <div key={sport.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-background transition-colors">
                              <Checkbox
                              id={`sport-${sport.id}`}
                              checked={user.preferredSports?.some(s => s.id === sport.id) || false}
                              onCheckedChange={() => handlePreferredSportsChange(sport.id)}
                              disabled={!isEditing}
                              className="h-5 w-5"
                              />
                              <Label htmlFor={`sport-${sport.id}`} className={`text-base font-normal cursor-pointer flex items-center ${isEditing ? '' : 'text-muted-foreground'}`}>
                                <SportIcon className="mr-2 h-5 w-5 text-primary" /> {sport.name}
                              </Label>
                          </div>
                      );
                  })}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="outline" size="lg" onClick={() => { setIsEditing(false); setUser(mockUser); /* Reset changes */ }}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading} size="lg">
                    {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-5 w-5" />}
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Gem className="mr-2 h-6 w-6 text-primary" /> Loyalty Points</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center">
                        <p className="text-5xl font-bold text-primary">{user.loyaltyPoints || 0}</p>
                        <p className="text-muted-foreground mt-1">Points Earned</p>
                    </div>
                    <Button variant="link" className="w-full mt-4 text-sm p-0">Learn how to earn & redeem points (Coming Soon)</Button>
                </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center"><Award className="mr-2 h-6 w-6 text-yellow-500" /> Achievements</CardTitle>
                    <CardDescription>Badges you've unlocked on your sports journey!</CardDescription>
                </CardHeader>
                <CardContent>
                    {user.achievements && user.achievements.length > 0 ? (
                        <TooltipProvider>
                        <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {user.achievements.map(ach => {
                                const AchievementIcon = ach.icon || Medal;
                                return (
                                    <li key={ach.id} className="flex flex-col items-center text-center">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className={`p-3 rounded-full border-2 ${ach.unlockedAt ? 'border-yellow-500 bg-yellow-500/10' : 'border-muted bg-muted/50'}`}>
                                                <AchievementIcon className={`h-8 w-8 ${ach.unlockedAt ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="font-semibold">{ach.name}</p>
                                            <p className="text-xs text-muted-foreground">{ach.description}</p>
                                            {ach.unlockedAt && <p className="text-xs text-muted-foreground">Unlocked: {format(new Date(ach.unlockedAt), 'MMM d, yyyy')}</p>}
                                        </TooltipContent>
                                    </Tooltip>
                                    <span className={`mt-1.5 text-xs font-medium ${ach.unlockedAt ? 'text-foreground' : 'text-muted-foreground'}`}>{ach.name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                        </TooltipProvider>
                    ) : (
                        <p className="text-muted-foreground text-sm text-center py-4">No achievements unlocked yet. Keep playing!</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
