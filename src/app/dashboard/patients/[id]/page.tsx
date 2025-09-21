
'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { patients } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SymptomSummarizer from './symptom-summarizer';
import { Button } from '@/components/ui/button';
import { MessageSquare, Video } from 'lucide-react';
import PrescriptionGenerator from './prescription-generator';

export default function PatientDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const patient = patients.find((p) => p.id === id);
  const [healthRecords, setHealthRecords] = useState(patient?.healthRecords || '');

  if (!patient) {
    notFound();
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person portrait" />
              <AvatarFallback className="text-3xl">{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="font-headline text-2xl">{patient.name}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Age</span>
                    <span>{patient.age}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Gender</span>
                    <span>{patient.gender}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Visit</span>
                    <span>{patient.lastVisit}</span>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <Button className="flex-1" variant="outline"><MessageSquare className="mr-2 h-4 w-4"/> Chat</Button>
                <Button className="flex-1"><Video className="mr-2 h-4 w-4"/> Video Call</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <SymptomSummarizer 
          healthRecords={healthRecords} 
          onHealthRecordsChange={setHealthRecords}
        />
        
        <div className="mt-6">
          <PrescriptionGenerator healthRecords={healthRecords} />
        </div>
      </div>
    </div>
  );
}
