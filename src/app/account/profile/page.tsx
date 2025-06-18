'use client';

import { useState, useEffect } from 'react';
import { PageTitle } from '@/components/shared/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockUser, mockSports, mockMembershipPlans } from '@/lib/data';
import type { UserProfile as UserProfileType, Sport, MembershipPlan } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Save, Edit3, Mail, Phone, Heart, Award } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

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
        <PageTitle title="My Profile" description="View and manage your account details." />
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.profilePictureUrl} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> {user.email}
              </CardDescription>
              {user.phone && 
                <CardDescription className="flex items-center mt-1">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" /> {user.phone}
                </CardDescription>
              }
            </div>
          </div>
          {isEditing && (
            <Button variant="outline" size="sm" className="mt-4 w-fit">
              <UploadCloud className="mr-2 h-4 w-4" /> Change Photo
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={user.name} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={user.email} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input id="phone" name="phone" type="tel" value={user.phone || ''} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div>
                <Label htmlFor="membershipLevel"><Award className="inline mr-2 h-4 w-4" />Membership Level</Label>
                 <Select 
                    name="membershipLevel" 
                    value={user.membershipLevel} 
                    onValueChange={(value) => handleSelectChange('membershipLevel', value)}
                    disabled={!isEditing}
                >
                  <SelectTrigger id="membershipLevel">
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMembershipPlans.map(plan => (
                      <SelectItem key={plan.id} value={plan.name}>{plan.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label><Heart className="inline mr-2 h-4 w-4" />Preferred Sports</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2 p-4 border rounded-md">
                {mockSports.map(sport => (
                  <div key={sport.id} className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      id={`sport-${sport.id}`}
                      checked={user.preferredSports?.some(s => s.id === sport.id) || false}
                      onChange={() => handlePreferredSportsChange(sport.id)}
                      disabled={!isEditing}
                      className="h-4 w-4"
                    />
                    <Label htmlFor={`sport-${sport.id}`} className="text-sm font-normal cursor-pointer">
                      {sport.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {isEditing && (
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setUser(mockUser); /* Reset changes */ }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <LoadingSpinner size={20} className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
