
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { type LoanSummaryData } from '@/lib/types';
import { formatCurrency } from '@/lib/loan-utils';
import { useTranslation } from '@/context/language-context';

function SummaryItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col space-y-1 rounded-lg bg-secondary p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
        </div>
    );
}

export function LoanSummary({ data }: { data: LoanSummaryData }) {
    const { t, language } = useTranslation();

    const formattedLoanAmount = formatCurrency(data.loanAmount, language);
    const formattedMonthlyPayment = formatCurrency(data.monthlyPayment, language);
    const formattedTotalInterest = formatCurrency(data.totalInterest, language);
    const formattedTotalPayment = formatCurrency(data.totalPayment, language);

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{t('loanSummary')}</CardTitle>
                <CardDescription>{t('loanCostBreakdown')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SummaryItem label={t('monthlyPayment')} value={formattedMonthlyPayment} />
                    <SummaryItem label={t('totalInterest')} value={formattedTotalInterest} />
                    <SummaryItem label={t('totalCost')} value={formattedTotalPayment} />
                </div>
                 <div className="text-sm text-muted-foreground pt-4">
                    {t('summaryBasedOn', {
                        loanAmount: formattedLoanAmount,
                        interestRate: data.interestRate.toFixed(2),
                        loanTerm: data.loanTermInYears.toFixed(2),
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
