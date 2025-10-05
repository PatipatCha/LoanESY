"use client";

import { useState } from 'react';
import { LoanForm } from '@/components/loan-form';
import type { LoanFormValues } from '@/lib/types';
import { LoanSummary } from '@/components/loan-summary';
import { PaymentSchedule } from '@/components/payment-schedule';
import { calculateMonthlyPayment, generateAmortizationSchedule } from '@/lib/loan-utils';
import type { LoanSummaryData, AmortizationScheduleEntry } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function LoanCalculator() {
    const [summary, setSummary] = useState<LoanSummaryData | null>(null);
    const [schedule, setSchedule] = useState<AmortizationScheduleEntry[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleCalculate = async (data: LoanFormValues) => {
        setIsLoading(true);
        setSummary(null);
        setSchedule(null);

        await new Promise(resolve => setTimeout(resolve, 500));

        const principal = data.amount;
        const annualRate = data.rate;
        const termInMonths = data.termUnit === 'years' ? data.term * 12 : data.term;
        const termInYears = data.termUnit === 'years' ? data.term : data.term / 12;

        const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termInMonths);
        
        if (isNaN(monthlyPayment) || !isFinite(monthlyPayment) || monthlyPayment <= 0) {
            toast({
              title: "Calculation Error",
              description: "Could not calculate payment. Please check your inputs.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        const newSchedule = generateAmortizationSchedule(principal, annualRate, termInMonths);
        const totalInterest = newSchedule.reduce((acc, month) => acc + month.interest, 0);
        const totalPayment = principal + totalInterest;

        setSummary({
            loanAmount: principal,
            interestRate: annualRate,
            loanTermInYears: termInYears,
            monthlyPayment: monthlyPayment,
            totalInterest: totalInterest,
            totalPayment: totalPayment
        });
        setSchedule(newSchedule);
        setIsLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-1 lg:sticky top-8">
                <LoanForm onSubmit={handleCalculate} isLoading={isLoading} />
            </div>
            <div className="lg:col-span-2 space-y-8">
                {isLoading && (
                    <Card className="p-6 flex items-center justify-center min-h-[400px] w-full">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">Calculating your loan...</p>
                        </div>
                    </Card>
                )}
                
                <div className={cn('space-y-8 transition-all duration-500 ease-out', (summary && schedule && !isLoading) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none')}>
                    {summary && <LoanSummary data={summary} />}
                    {schedule && <PaymentSchedule data={schedule} />}
                </div>

                {!isLoading && !summary && (
                    <Card className="p-6 flex items-center justify-center min-h-[400px] w-full border-dashed">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-muted-foreground">Your loan details will appear here.</h3>
                            <p className="text-sm text-muted-foreground">Fill out the form to get started.</p>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
