
"use client";

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Percent, Calendar, Loader2, PlusCircle, Save } from 'lucide-react';

import type { LoanFormValues, SavedPlan } from '@/lib/types';
import { useTranslation } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  totalCourseFee: z.coerce.number().positive({ message: "Total cost must be a positive number." }).max(100000000, "Please enter a smaller amount."),
  personalFunds: z.coerce.number().min(0, { message: "Personal funds cannot be negative." }).max(100000000, "Please enter a smaller amount."),
  rate: z.coerce.number().min(0, { message: "Interest rate cannot be negative." }).max(100, { message: "An interest rate above 100% is unlikely." }),
  term: z.coerce.number().int({ message: "Term must be a whole number." }).positive({ message: "Loan term must be a positive number." }).max(600, "Term is too long."),
}).refine(data => data.totalCourseFee > data.personalFunds, {
    message: "Personal funds cannot be greater than or equal to the total course fee.",
    path: ['personalFunds'],
});

const defaultFormValues: LoanFormValues = {
  totalCourseFee: 180000,
  personalFunds: 50000,
  rate: 3.43,
  term: 6,
  termUnit: 'years',
};

type LoanFormProps = {
  onSubmit: (data: LoanFormValues) => void;
  isLoading: boolean;
  initialValues?: LoanFormValues;
  currentPlan?: SavedPlan | null;
  onPlanSelected: (plan: SavedPlan) => void;
};

export function LoanForm({ onSubmit, isLoading, initialValues, currentPlan, onPlanSelected }: LoanFormProps) {
  const { t, language } = useTranslation();
  const { toast } = useToast();
  const [termUnit, setTermUnit] = useState<'years' | 'months'>(initialValues?.termUnit || 'years');
  const [plans, setPlans] = useState<SavedPlan[]>([]);
  const [newPlanName, setNewPlanName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isNewPlanDialogOpen, setIsNewPlanDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ? {
        ...initialValues,
        termUnit: undefined, // termUnit is managed by state
    } : {
        ...defaultFormValues,
        termUnit: undefined,
    },
  });

  const formData = useWatch({ control: form.control });
  const [totalCourseFee, personalFunds] = form.watch(['totalCourseFee', 'personalFunds']);
  const [loanAmount, setLoanAmount] = useState(0);

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    const fee = Number(totalCourseFee) || 0;
    const funds = Number(personalFunds) || 0;
    const calculatedLoanAmount = fee - funds;
    setLoanAmount(calculatedLoanAmount > 0 ? calculatedLoanAmount : 0);
  }, [totalCourseFee, personalFunds]);

  async function fetchPlans() {
    try {
      const response = await fetch('/api/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    }
  }

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({ ...values, termUnit });
  }
  
  const handleSelectPlan = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      onPlanSelected(plan);
    }
  };

  const savePlan = async (isNew: boolean) => {
    setIsSaving(true);
    const planData: LoanFormValues = {
        ...(formData as Omit<typeof formData, 'termUnit'>),
        term: Number(formData.term),
        totalCourseFee: Number(formData.totalCourseFee),
        personalFunds: Number(formData.personalFunds),
        rate: Number(formData.rate),
        termUnit: termUnit,
    };
    
    try {
      let response;
      if (isNew) {
        if (!newPlanName.trim()) {
           toast({ title: "Error", description: "Plan name is required.", variant: "destructive" });
           return;
        }
        response = await fetch('/api/plans', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newPlanName, formData: planData }),
        });
      } else if (currentPlan) {
          response = await fetch(`/api/plans/${currentPlan.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: currentPlan.name, formData: planData }),
          });
      } else {
         toast({ title: "Error", description: "No plan selected to save.", variant: "destructive" });
         return;
      }

      if (response.ok) {
        toast({ title: "Success", description: `Plan ${isNew ? 'saved' : 'updated'} successfully.` });
        setNewPlanName('');
        setIsNewPlanDialogOpen(false);
        await fetchPlans(); // Refresh plans list
        if(isNew) {
            const newPlan = await response.json();
            onPlanSelected(newPlan);
        }
      } else {
        const errorData = await response.json();
        toast({ title: "Error", description: errorData.error || "Failed to save plan.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">

        <div className="space-y-2">
            <FormLabel>{t('savedPlans')}</FormLabel>
            <div className="flex gap-2">
                <Select onValueChange={handleSelectPlan} value={currentPlan?.id}>
                    <SelectTrigger>
                        <SelectValue placeholder={t('selectPlan')} />
                    </SelectTrigger>
                    <SelectContent>
                        {plans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Dialog open={isNewPlanDialogOpen} onOpenChange={setIsNewPlanDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-10"><PlusCircle className="mr-2 h-4 w-4"/> {t('newPlan')}</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('saveNewPlan')}</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Input 
                                placeholder={t('planName')}
                                value={newPlanName}
                                onChange={(e) => setNewPlanName(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="ghost">{t('cancel')}</Button>
                          </DialogClose>
                          <Button onClick={() => savePlan(true)} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('save')}
                          </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button type="button" onClick={() => savePlan(false)} disabled={!currentPlan || isSaving} className="h-10">
                    <Save className="mr-2 h-4 w-4"/> {t('savePlan')}
                </Button>
            </div>
        </div>


        <FormField
          control={form.control}
          name="totalCourseFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('totalCourseFee')}</FormLabel>
              <div className="relative">
                {language === 'en' ? (
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                ) : (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span>
                )}
                <FormControl>
                  <Input type="number" placeholder="e.g., 180000" className="pl-8" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalFunds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('personalFunds')}</FormLabel>
              <div className="relative">
                {language === 'en' ? (
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                ) : (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span>
                )}
                <FormControl>
                  <Input type="number" placeholder="e.g., 50000" className="pl-8" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>{t('loanAmountRequested')}</FormLabel>
          <div className="relative">
            {language === 'en' ? (
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            ) : (
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">฿</span>
            )}
            <FormControl>
              <Input type="number" readOnly value={loanAmount} className="pl-8 bg-muted/50" />
            </FormControl>
          </div>
        </FormItem>
        
        <FormField
          control={form.control}
          name="rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('annualInterestRate')}</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type="number" step="0.01" placeholder="e.g., 3.43" className="pr-8" {...field} />
                </FormControl>
                <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="term"
          render={({ field }) => (
            <FormItem>
               <FormLabel>{t('loanTerm')}</FormLabel>
               <div className="flex gap-2">
                <div className="relative flex-grow">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <FormControl>
                    <Input type="number" placeholder={termUnit === 'years' ? 'e.g., 6' : 'e.g., 72'} className="pl-8" {...field} />
                    </FormControl>
                </div>
                <Tabs value={termUnit} onValueChange={(value) => setTermUnit(value as 'years' | 'months')} className="w-[150px]">
                  <TabsList className="grid w-full grid-cols-2 h-10">
                      <TabsTrigger value="years">{t('years')}</TabsTrigger>
                      <TabsTrigger value="months">{t('months')}</TabsTrigger>
                  </TabsList>
                </Tabs>
               </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('calculating')}...
            </>
          ) : (
            t('calculateLoanButton')
          )}
        </Button>
      </form>
    </Form>
  );
}
