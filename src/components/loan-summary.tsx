import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type LoanSummaryData } from '@/lib/types';
import { formatCurrency } from '@/lib/loan-utils';

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col space-y-1 rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
    );
}

export function LoanSummary({ data }: { data: LoanSummaryData }) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Loan Summary</CardTitle>
                <CardDescription>A breakdown of your loan costs over time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SummaryItem label="Monthly Payment" value={formatCurrency(data.monthlyPayment)} />
                    <SummaryItem label="Total Interest" value={formatCurrency(data.totalInterest)} />
                    <SummaryItem label="Total Cost" value={formatCurrency(data.totalPayment)} />
                </div>
                 <div className="text-sm text-muted-foreground pt-4">
                    Based on a loan of <span className="font-semibold text-foreground">{formatCurrency(data.loanAmount)}</span> at <span className="font-semibold text-foreground">{data.interestRate.toFixed(2)}%</span> over <span className="font-semibold text-foreground">{data.loanTermInYears.toFixed(2)} years</span>.
                </div>
            </CardContent>
        </Card>
    );
}
