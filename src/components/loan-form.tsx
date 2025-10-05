
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Percent, Calendar, Loader2 } from 'lucide-react';

import type { LoanFormValues } from '@/lib/types';
import { useTranslation } from '@/context/language-context';
import { formatCurrency } from '@/lib/loan-utils';
import { cn } from '@/lib/utils';


const formSchema = z.object({
  totalCourseFee: z.coerce.number().positive({ message: "Total cost must be a positive number." }).max(100000000, "Please enter a smaller amount."),
  personalFunds: z.coerce.number().min(0, { message: "Personal funds cannot be negative." }).max(100000000, "Please enter a smaller amount."),
  rate: z.coerce.number().min(0, { message: "Interest rate cannot be negative." }).max(100, { message: "An interest rate above 100% is unlikely." }),
  term: z.coerce.number().int({ message: "Term must be a whole number." }).positive({ message: "Loan term must be a positive number." }).max(600, "Term is too long."),
}).refine(data => data.totalCourseFee > data.personalFunds, {
    message: "Personal funds cannot be greater than or equal to the total course fee.",
    path: ['personalFunds'],
});


type LoanFormProps = {
  onSubmit: (data: LoanFormValues) => void;
  isLoading: boolean;
};

export function LoanForm({ onSubmit, isLoading }: LoanFormProps) {
  const { t, language } = useTranslation();
  const [termUnit, setTermUnit] = useState<'years' | 'months'>('years');
  const [calculatedLoanAmount, setCalculatedLoanAmount] = useState(95000);


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalCourseFee: 100000,
      personalFunds: 5000,
      rate: 5,
      term: 5,
    },
  });

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    const { totalCourseFee, personalFunds } = watchedValues;
    if (typeof totalCourseFee === 'number' && typeof personalFunds === 'number' && totalCourseFee > personalFunds) {
        setCalculatedLoanAmount(totalCourseFee - personalFunds);
    } else {
        setCalculatedLoanAmount(0);
    }
  }, [watchedValues]);


  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit({ ...values, termUnit });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>{t('loanDetails')}</CardTitle>
        <CardDescription>{t('enterLoanInfo')}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                      <Input type="number" placeholder="e.g., 100000" className="pl-8" {...field} />
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
                      <Input type="number" placeholder="e.g., 5000" className="pl-8" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('annualInterestRate')}</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 5" className="pr-8" {...field} />
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
                        <Input type="number" placeholder={termUnit === 'years' ? 'e.g., 5' : 'e.g., 60'} className="pl-8" {...field} />
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
      </CardContent>
       <CardFooter className={cn("bg-secondary/50 p-4 transition-opacity", calculatedLoanAmount > 0 ? 'opacity-100' : 'opacity-50')}>
        <div className="w-full">
            <p className="text-sm text-muted-foreground">{t('loanAmountToCalculate')}</p>
            <p className="text-2xl font-bold text-foreground">
                {formatCurrency(calculatedLoanAmount, language)}
            </p>
        </div>
      </CardFooter>
    </Card>
  );
}
