'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doctor } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    // Add save logic here
    setIsEditing(false);
  };


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
                    <AvatarImage src={doctor.avatar} alt={`Dr. ${doctor.name}`} data-ai-hint="doctor portrait" />
                    <AvatarFallback className="text-2xl">{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline" disabled={!isEditing}>Change Photo</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={`Dr. ${doctor.name}`} disabled={!isEditing} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" defaultValue={doctor.specialization} disabled={!isEditing}/>
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="doctor@arogyadoc.com" disabled={!isEditing} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea id="bio" placeholder="Tell us a little bit about yourself" defaultValue="Experienced Cardiologist dedicated to providing top-notch patient care." disabled={!isEditing}/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="consultation-timings">Consultation Timings</Label>
                    <Input id="consultation-timings" defaultValue="Mon - Fri, 9 AM - 5 PM" disabled={!isEditing}/>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Input id="availability" defaultValue="Available for teleconsultation" disabled={!isEditing}/>
                </div>
            </div>
             <div className="grid gap-2">
                    <Label htmlFor="license">Medical License</Label>
                    <Input id="license" defaultValue="Verified (Reg. #12345)" disabled />
            </div>

            {isEditing && (
                <Button type="submit" className="w-full md:w-auto justify-self-start">Save Changes</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
