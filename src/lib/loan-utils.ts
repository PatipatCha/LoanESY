
import type { AmortizationScheduleEntry } from './types';
import type { Language } from '@/context/language-context';


export function calculateMonthlyPayment(principal: number, annualRate: number, termInMonths: number): number {
  if (principal <= 0 || annualRate < 0 || termInMonths <= 0) {
    return 0;
  }

  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return principal / termInMonths;
  }
  
  const payment =
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, termInMonths)) /
    (Math.pow(1 + monthlyRate, termInMonths) - 1);

  return payment;
}

export function generateAmortizationSchedule(principal: number, annualRate: number, termInMonths: number): AmortizationScheduleEntry[] {
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termInMonths);
    if (isNaN(monthlyPayment) || !isFinite(monthlyPayment) || monthlyPayment <= 0) return [];
    
    const schedule: AmortizationScheduleEntry[] = [];
    let remainingBalance = principal;
    const monthlyRate = annualRate / 100 / 12;

    for (let month = 1; month <= termInMonths; month++) {
        const interestPaid = remainingBalance * monthlyRate;
        let principalPaid = monthlyPayment - interestPaid;
        
        if (remainingBalance < monthlyPayment) {
            principalPaid = remainingBalance;
        }

        remainingBalance -= principalPaid;
        
        schedule.push({
            month,
            monthlyPayment: interestPaid + principalPaid,
            principal: principalPaid,
            interest: interestPaid,
            remainingBalance: remainingBalance < 0 ? 0 : remainingBalance,
        });

        if (remainingBalance <= 0) {
          break;
        }
    }

    // Adjust the last payment for precision errors
    if (schedule.length > 0) {
      const lastEntry = schedule[schedule.length - 1];
      if (lastEntry.remainingBalance > 0) {
          lastEntry.principal += lastEntry.remainingBalance;
          lastEntry.monthlyPayment += lastEntry.remainingBalance;
          lastEntry.remainingBalance = 0;
      }
    }

    return schedule;
}

export function formatCurrency(amount: number, lang: Language = 'en'): string {
    const options: Intl.NumberFormatOptions = {
        style: 'currency',
        minimumFractionDigits: 2,
    };

    if (lang === 'th') {
        options.currency = 'THB';
        // Thai Baht symbol is often not needed when locale is th-TH
        // The browser will handle it.
        return new Intl.NumberFormat('th-TH', options).format(amount);
    }

    options.currency = 'USD';
    return new Intl.NumberFormat('en-US', options).format(amount);
}
