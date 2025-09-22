
'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { getDoctorProfile, updateUserProfile, type UserProfile } from '@/services/doctorService';

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        setIsLoading(true);
        const userProfile = await getDoctorProfile(user.uid);

        if (userProfile) {
          setProfile(userProfile);
        } else {
          // If profile doesn't exist, create one with default values
           const defaultProfile: UserProfile = {
            uid: user.uid,
            name: user.displayName || 'Dr. User',
            email: user.email || '',
            specialization: 'General Physician',
            bio: 'Dedicated to providing the best patient care.',
            consultationTimings: 'Mon - Fri, 9 AM - 5 PM',
            availability: 'Available for teleconsultation',
            license: 'Not Verified',
            avatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
          };
          await updateUserProfile(user.uid, defaultProfile);
          setProfile(defaultProfile);
        }
        setIsLoading(false);
      }
    }

    fetchProfile();
  }, [user]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setIsLoading(true);
    try {
      await updateUserProfile(user.uid, profile);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully.',
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (profile) {
      setProfile(prev => ({...prev!, [id]: value}));
    }
  }

  if (isLoading || !profile) {
    return (
       <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>My Profile</CardTitle>
            <CardDescription>
              Update your personal and professional information.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={handleEditClick}>
              <Pencil className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form className="grid gap-6" onSubmit={handleSaveClick}>
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar} alt={`Dr. ${profile.name}`} data-ai-hint="doctor portrait" />
                <AvatarFallback className="text-2xl">{profile.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline" disabled={!isEditing}>Change Photo</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={profile.name} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input id="specialization" value={profile.specialization} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile.email} onChange={handleInputChange} disabled={true} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bio">About Me</Label>
              <Textarea id="bio" placeholder="Tell us a little bit about yourself" value={profile.bio} onChange={handleInputChange} disabled={!isEditing} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="consultationTimings">Consultation Timings</Label>
                <Input id="consultationTimings" value={profile.consultationTimings} onChange={handleInputChange} disabled={!isEditing} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="availability">Availability</Label>
                <Input id="availability" value={profile.availability} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="license">Medical License</Label>
              <Input id="license" value={profile.license} disabled={!isEditing} onChange={handleInputChange} />
            </div>

            {isEditing && (
              <Button type="submit" className="w-full md:w-auto justify-self-start" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Changes'}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
