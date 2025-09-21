import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { doctor } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>
            Update your personal and professional information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={doctor.avatar} alt={`Dr. ${doctor.name}`} data-ai-hint="doctor portrait" />
                    <AvatarFallback className="text-2xl">{doctor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue={`Dr. ${doctor.name}`} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input id="specialization" defaultValue={doctor.specialization} />
                </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="doctor@arogyadoc.com" />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="bio">About Me</Label>
                <Textarea id="bio" placeholder="Tell us a little bit about yourself" defaultValue="Experienced Cardiologist dedicated to providing top-notch patient care."/>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="consultation-timings">Consultation Timings</Label>
                    <Input id="consultation-timings" defaultValue="Mon - Fri, 9 AM - 5 PM" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Input id="availability" defaultValue="Available for teleconsultation" />
                </div>
            </div>
             <div className="grid gap-2">
                    <Label htmlFor="license">Medical License</Label>
                    <Input id="license" defaultValue="Verified (Reg. #12345)" disabled />
            </div>

            <Button type="submit" className="w-full md:w-auto justify-self-start">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
