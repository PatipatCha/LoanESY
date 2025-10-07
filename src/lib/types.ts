import type { ObjectId } from 'mongodb';

export type LoanFormValues = {
  totalCourseFee: number;
  personalFunds: number;
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

// MongoDB will add the `_id` property. We make it optional here
// because we will be deleting it before sending it to the client.
// The client-side code will use the `id` property.
export type SavedPlan = {
  _id?: ObjectId;
  id: string;
  name: string;
  formData: LoanFormValues;
};
