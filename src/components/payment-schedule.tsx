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

export function PaymentSchedule({ data }: { data: AmortizationScheduleEntry[] }) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Payment Schedule</CardTitle>
                <CardDescription>The month-by-month breakdown of your loan payments.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[500px] w-full rounded-md border">
                    <Table>
                        <TableHeader className="sticky top-0 bg-secondary">
                            <TableRow>
                                <TableHead className="w-[100px]">Month</TableHead>
                                <TableHead className="text-right">Payment</TableHead>
                                <TableHead className="text-right">Principal</TableHead>
                                <TableHead className="text-right">Interest</TableHead>
                                <TableHead className="text-right">Balance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((entry) => (
                                <TableRow key={entry.month}>
                                    <TableCell className="font-medium">{entry.month}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.monthlyPayment)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.principal)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.interest)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(entry.remainingBalance)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
