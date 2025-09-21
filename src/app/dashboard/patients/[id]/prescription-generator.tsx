
'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { createPrescription, type PrescriptionFormState } from './prescription-actions';
import type { GeneratePrescriptionOutput } from '@/ai/flows/ai-generate-prescription';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

import { FileText, Loader2, Sparkles, PlusCircle, Trash2, Save, XCircle, Printer } from 'lucide-react';

const initialState: PrescriptionFormState = {
  message: '',
};

type Medication = {
  name: string;
  dosage: string;
  frequency: string;
};

function AIGenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-accent text-accent-foreground hover:bg-accent/80">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" /> Generate with AI
        </>
      )}
    </Button>
  );
}

export default function PrescriptionGenerator({ healthRecords }: { healthRecords: string }) {
  const [state, formAction] = useActionState(createPrescription, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [prescription, setPrescription] = useState<GeneratePrescriptionOutput>({
    medications: [],
    instructions: '',
    followUp: '',
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (state.message && state.message !== 'success') {
      toast({
        variant: 'destructive',
        title: 'Error Generating Prescription',
        description: state.message,
      });
    }
    if (state.message === 'success' && state.prescription) {
        setPrescription(state.prescription);
        toast({
            title: 'AI Prescription Generated',
            description: 'The prescription has been populated with AI suggestions. Please review and edit as needed.',
        });
    }
  }, [state, toast]);

  const handleMedicationChange = (index: number, field: keyof Medication, value: string) => {
    const updatedMedications = [...prescription.medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setPrescription({ ...prescription, medications: updatedMedications });
  };

  const addMedication = () => {
    setPrescription({
      ...prescription,
      medications: [...prescription.medications, { name: '', dosage: '', frequency: '' }],
    });
  };

  const removeMedication = (index: number) => {
    const updatedMedications = prescription.medications.filter((_, i) => i !== index);
    setPrescription({ ...prescription, medications: updatedMedications });
  };
  
  const handleOpenPreview = () => {
    const isPrescriptionEmpty = 
      prescription.medications.every(med => !med.name && !med.dosage && !med.frequency) &&
      !prescription.instructions &&
      !prescription.followUp;

    if (isPrescriptionEmpty) {
      toast({
        variant: 'destructive',
        title: 'Empty Prescription',
        description: 'Please add at least one medication or instruction before saving.',
      });
      return;
    }
    setIsPreviewOpen(true);
  };

  const handleConfirmSave = () => {
    // Implement actual save logic here, e.g., send to a database
    setIsPreviewOpen(false);
    toast({
        title: 'Prescription Saved',
        description: 'The prescription has been saved successfully.',
    });
  };


  const clearForm = () => {
    setPrescription({
        medications: [],
        instructions: '',
        followUp: '',
    });
  }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" /> Prescription
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4">
          Create a prescription manually or use AI to generate suggestions based on the health records.
        </p>
        
        <form ref={formRef} action={formAction} className="mb-6">
           <input type="hidden" name="healthRecords" value={healthRecords || ''} />
          <AIGenerateButton />
        </form>

        <div className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-2">Medications</h3>
                <div className="space-y-4">
                    {prescription.medications.map((med, index) => (
                        <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-3 border rounded-lg relative">
                            <div className="md:col-span-4 flex justify-end">
                                <Button variant="ghost" size="icon" className="absolute -top-1 -right-1 h-6 w-6" onClick={() => removeMedication(index)}>
                                    <Trash2 className="h-4 w-4 text-destructive"/>
                                </Button>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor={`med-name-${index}`}>Name</Label>
                                <Input id={`med-name-${index}`} value={med.name} onChange={(e) => handleMedicationChange(index, 'name', e.target.value)} placeholder="e.g., Paracetamol"/>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                                <Input id={`med-dosage-${index}`} value={med.dosage} onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)} placeholder="e.g., 500mg"/>
                            </div>
                            <div className="grid gap-1.5 col-span-full md:col-span-2">
                                <Label htmlFor={`med-frequency-${index}`}>Frequency</Label>
                                <Input id={`med-frequency-${index}`} value={med.frequency} onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)} placeholder="e.g., Twice a day after meals"/>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="outline" size="sm" className="mt-4" onClick={addMedication}>
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Medication
                </Button>
            </div>

            <div>
                 <Label htmlFor="instructions" className="font-semibold text-lg">Instructions</Label>
                 <Textarea id="instructions" value={prescription.instructions} onChange={(e) => setPrescription({...prescription, instructions: e.target.value})} placeholder="e.g., Take with plenty of water. Complete the full course." className="mt-2"/>
            </div>

            <div>
                 <Label htmlFor="followUp" className="font-semibold text-lg">Follow-Up</Label>
                 <Input id="followUp" value={prescription.followUp} onChange={(e) => setPrescription({...prescription, followUp: e.target.value})} placeholder="e.g., Follow up in 2 weeks or if symptoms worsen." className="mt-2"/>
            </div>
        </div>

        <div className="mt-6 flex gap-2">
            <Button onClick={handleOpenPreview}><Save className="mr-2 h-4 w-4"/> Save Prescription</Button>
            <Button variant="outline" onClick={clearForm}><XCircle className="mr-2 h-4 w-4"/> Clear</Button>
        </div>
      </CardContent>
    </Card>

    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="text-2xl font-headline">Prescription Preview</DialogTitle>
                <DialogDescription>
                    Please review the prescription details below before saving.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
                <div>
                    <h3 className="font-semibold text-lg mb-2 border-b pb-1">Medications</h3>
                    {prescription.medications.filter(m => m.name).length > 0 ? (
                        <ul className="space-y-3">
                            {prescription.medications.filter(m => m.name).map((med, index) => (
                                <li key={index} className="grid grid-cols-3 gap-1 text-sm">
                                    <span className="font-medium col-span-3">{med.name}</span>
                                    <span className="text-muted-foreground">{med.dosage}</span>
                                    <span className="text-muted-foreground col-span-2">{med.frequency}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground">No medications prescribed.</p>
                    )}
                </div>

                 <div>
                    <h3 className="font-semibold text-lg mb-2 border-b pb-1">Instructions</h3>
                    <p className="text-sm text-muted-foreground">{prescription.instructions || 'No special instructions.'}</p>
                </div>

                <div>
                    <h3 className="font-semibold text-lg mb-2 border-b pb-1">Follow-Up</h3>
                    <p className="text-sm text-muted-foreground">{prescription.followUp || 'No follow-up scheduled.'}</p>
                </div>
            </div>
            <DialogFooter className="sm:justify-between">
                <div>
                  <Button variant="outline"><Printer className="mr-2 h-4 w-4"/> Print</Button>
                </div>
                <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Edit
                        </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleConfirmSave}>Confirm & Save</Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
