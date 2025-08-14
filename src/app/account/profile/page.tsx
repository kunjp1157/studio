
'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { mockUser, mockMembershipPlans } from '@/lib/data';
import { mockSports } from '@/lib/mock-data';
import type { UserProfile as UserProfileType, Sport, MembershipPlan, Achievement, UserSkill, SkillLevel } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Save, Edit3, Mail, Phone, Heart, Award, Zap, Medal, Gem, Sparkles, ShieldCheck, History, UserCircle, ClockIcon, Dumbbell, Shield } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { getIconComponent } from '@/components/shared/Icon';

const skillLevelsOptions: {value: SkillLevel | "Not Specified", label: string}[] = [
    { value: "Not Specified", label: "Not Specified" },
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
];

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfileType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const activeUserStr = sessionStorage.getItem('activeUser');
    if (activeUserStr) {
        setUser(JSON.parse(activeUserStr));
    }
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!user) return;
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
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

  const handleSkillLevelChange = (sportId: string, sportName: string, level: string) => {
    if (!user) return;
    let currentSkills = [...(user.skillLevels || [])];
    const existingSkillIndex = currentSkills.findIndex(skill => skill.sportId === sportId);

    if (level === "Not Specified") {
      if (existingSkillIndex !== -1) {
        currentSkills.splice(existingSkillIndex, 1);
      }
    } else {
      const newSkill: UserSkill = { sportId, sportName, level: level as SkillLevel };
      if (existingSkillIndex !== -1) {
        currentSkills[existingSkillIndex] = newSkill;
      } else {
        currentSkills.push(newSkill);
      }
    }
    setUser({ ...user, skillLevels: currentSkills });
  };
  
   const handleSwitchChange = (checked: boolean) => {
    if (!user) return;
    setUser({ ...user, isProfilePublic: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsEditing(false);
      setIsLoading(false);
      
      if (user) {
        // In a real app, this would be an API call. Here we update session storage
        sessionStorage.setItem('activeUser', JSON.stringify(user));
        // And notify other components
        window.dispatchEvent(new Event('userChanged'));
      }

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully saved.",
      });
    }, 1000);
  };

  if (isLoading) {
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
                  <AvatarImage src={user.profilePictureUrl} alt={user.name} />
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
              <section>
                <h3 className="text-xl font-semibold mb-4 font-headline flex items-center"><UserCircle className="mr-2 h-5 w-5 text-primary" />Basic Information</h3>
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
                        <Input 
                            id="membershipLevel" 
                            value={user.membershipLevel || 'Basic'} 
                            disabled 
                            className="mt-1 text-base p-3 bg-muted/50 font-medium"
                        />
                    </div>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 font-headline flex items-center"><Sparkles className="mr-2 h-5 w-5 text-primary" />Personal Details</h3>
                 <div>
                  <Label htmlFor="bio" className="text-base">Bio (Optional)</Label>
                  {isEditing ? (
                    <Textarea id="bio" name="bio" placeholder="Tell us a bit about yourself..." value={user.bio || ''} onChange={handleInputChange} className="mt-1 text-base p-3" rows={4}/>
                  ) : (
                    <p className="mt-1 text-muted-foreground bg-muted/30 p-3 rounded-md min-h-[60px]">{user.bio || 'No bio provided.'}</p>
                  )}
                </div>
                <div className="mt-6">
                  <Label htmlFor="preferredPlayingTimes" className="text-base">Preferred Playing Times (Optional)</Label>
                  {isEditing ? (
                    <Input id="preferredPlayingTimes" name="preferredPlayingTimes" placeholder="e.g., Weekends, Weekday evenings" value={user.preferredPlayingTimes || ''} onChange={handleInputChange} className="mt-1 text-base p-3"/>
                  ) : (
                    <p className="mt-1 text-muted-foreground bg-muted/30 p-3 rounded-md min-h-[40px]">{user.preferredPlayingTimes || 'Not specified.'}</p>
                  )}
                </div>
              </section>
              
              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 font-headline flex items-center"><Heart className="mr-2 h-5 w-5 text-primary" />Sports Preferences</h3>
                <div>
                  <Label className="text-base">Preferred Sports</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2 p-4 border rounded-md bg-muted/30">
                    {mockSports.map(sport => {
                        const SportIcon = getIconComponent(sport.iconName) || Zap;
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
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 font-headline flex items-center"><Dumbbell className="mr-2 h-5 w-5 text-primary" />Skill Levels</h3>
                <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                {isEditing ? (
                    mockSports.map(sport => {
                        const currentSkill = user.skillLevels?.find(s => s.sportId === sport.id)?.level || "Not Specified";
                        const SportIcon = getIconComponent(sport.iconName) || Zap;
                        return (
                            <div key={`skill-${sport.id}`} className="grid grid-cols-[1fr_auto] items-center gap-4">
                                <Label htmlFor={`skill-level-${sport.id}`} className="text-base font-normal flex items-center">
                                   <SportIcon className="mr-2 h-5 w-5 text-primary" /> {sport.name}
                                </Label>
                                <Select 
                                    value={currentSkill} 
                                    onValueChange={(value) => handleSkillLevelChange(sport.id, sport.name, value)}
                                >
                                <SelectTrigger id={`skill-level-${sport.id}`} className="w-[180px] text-sm">
                                    <SelectValue placeholder="Set level" />
                                </SelectTrigger>
                                <SelectContent>
                                    {skillLevelsOptions.map(option => (
                                    <SelectItem key={option.value} value={option.value} className="text-sm">
                                        {option.label}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                            </div>
                        );
                    })
                ) : (
                    user.skillLevels && user.skillLevels.length > 0 ? (
                        <ul className="list-none space-y-2">
                        {user.skillLevels.map(skill => {
                            const sportDetails = mockSports.find(s => s.id === skill.sportId);
                            const SportIcon = getIconComponent(sportDetails?.iconName) || Zap;
                            return (
                                <li key={skill.sportId} className="flex items-center text-base text-muted-foreground">
                                    <SportIcon className="mr-2 h-5 w-5 text-primary" />
                                    {skill.sportName}: <span className="font-medium text-foreground ml-1">{skill.level}</span>
                                </li>
                            );
                        })}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground text-sm">No skill levels specified.</p>
                    )
                )}
                </div>
              </section>
              
              <Separator />

              <section>
                <h3 className="text-xl font-semibold mb-4 font-headline flex items-center"><Shield className="mr-2 h-5 w-5 text-primary" /> Privacy Settings</h3>
                 <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/30">
                    <div className="space-y-0.5">
                        <Label htmlFor="public-profile-switch" className="text-base font-normal">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">Allow other users to view your profile, achievements, and skill levels.</p>
                    </div>
                    <Switch
                        id="public-profile-switch"
                        checked={user.isProfilePublic}
                        onCheckedChange={handleSwitchChange}
                        disabled={!isEditing}
                    />
                </div>
              </section>

              {isEditing && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="outline" size="lg" onClick={() => { setIsEditing(false); setUser(user); /* Reset changes */ }}>
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
                                const AchievementIcon = getIconComponent(ach.iconName) || Medal;
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
