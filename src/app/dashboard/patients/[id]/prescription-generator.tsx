'use client';

import { useActionState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { createPrescription, type PrescriptionFormState } from './prescription-actions';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';

import { FileText, Loader2, Sparkles, Pill,ClipboardList, CalendarPlus } from 'lucide-react';

const initialState: PrescriptionFormState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/80">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Generate New Prescription
        </>
      )}
    </Button>
  );
}

export default function PrescriptionGenerator() {
  const [state, formAction] = useActionState(createPrescription, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
   const healthRecords = typeof document !== 'undefined' ? (document.querySelector('textarea[name="healthRecords"]') as HTMLTextAreaElement)?.value : '';


  useEffect(() => {
    if (state.message && state.message !== 'success') {
      toast({
        variant: 'destructive',
        title: 'Error Generating Prescription',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> AI Prescription Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">
          Use the patient's health records above to generate a digital prescription.
        </p>
        <form ref={formRef} action={formAction}>
           <input type="hidden" name="healthRecords" value={healthRecords} />
          <SubmitButton />
        </form>

        {state.prescription && (
          <Alert className="mt-6 border-primary/50 text-primary">
            <Sparkles className="h-4 w-4 !text-primary" />
            <AlertTitle className="font-bold">Generated Prescription</AlertTitle>
            <AlertDescription className="text-foreground mt-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold flex items-center gap-2 mb-2"><Pill className="h-4 w-4"/> Medications</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Frequency</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {state.prescription.medications.map((med, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{med.name}</TableCell>
                          <TableCell>{med.dosage}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Separator />
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><ClipboardList className="h-4 w-4"/> Instructions</h3>
                    <p className="text-sm">{state.prescription.instructions}</p>
                </div>
                <Separator />
                <div>
                    <h3 className="font-semibold flex items-center gap-2 mb-2"><CalendarPlus className="h-4 w-4"/> Follow-Up</h3>
                    <p className="text-sm">{state.prescription.followUp}</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
