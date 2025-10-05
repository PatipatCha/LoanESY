
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type AmortizationScheduleEntry } from '@/lib/types';
import { formatCurrency } from '@/lib/loan-utils';
import { useTranslation } from '@/context/language-context';

export function PaymentSchedule({ data }: { data: AmortizationScheduleEntry[] }) {
    const { t, language } = useTranslation();
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>{t('paymentSchedule')}</CardTitle>
                <CardDescription>{t('monthByMonthBreakdown')}</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border">
                    <Table>
                        <TableHeader className="sticky top-0 bg-secondary">
                            <TableRow>
                                <TableHead className="w-[100px]">{t('month')}</TableHead>
                                <TableHead className="text-right">{t('payment')}</TableHead>
                                <TableHead className="text-right">{t('principal')}</TableHead>
                                <TableHead className="text-right">{t('interest')}</TableHead>
                                <TableHead className="text-right">{t('balance')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((entry) => (
                                <TableRow key={entry.month}>
                                    <TableCell className="font-medium">{entry.month}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.monthlyPayment, language)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.principal, language)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.interest, language)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.remainingBalance, language)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
