export type LoanFormValues = {
  amount: number;
  rate: number;
  term: number;
  termUnit: 'years' | 'months';
};

export type AmortizationScheduleEntry = {
  month: number;
  monthlyPayment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
};

export type LoanSummaryData = {
  loanAmount: number;
  interestRate: number;
  loanTermInYears: number;
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
};
