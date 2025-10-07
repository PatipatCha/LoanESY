
"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { type AmortizationScheduleEntry } from '@/lib/types';
import { formatCurrency } from '@/lib/loan-utils';
import { useTranslation } from '@/context/language-context';

export function PaymentChart({ data }: { data: AmortizationScheduleEntry[] }) {
    const { t, language } = useTranslation();

    const chartConfig = {
      remainingBalance: {
        label: t('balance'),
        color: "hsl(var(--chart-1))",
      },
      principal: {
        label: t('principal'),
        color: "hsl(var(--chart-2))",
      },
      interest: {
        label: t('interest'),
        color: "hsl(var(--chart-3))",
      },
    }

    return (
        <ChartContainer config={chartConfig} className="h-full w-full">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `${t('monthAbbreviation')} ${value}`}
                />
                 <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => formatCurrency(Number(value), language).replace(/(\.00|฿|,| |\$)/g, '')}
                />
                <Tooltip
                    cursor={false}
                    content={
                        <ChartTooltipContent
                            formatter={(value, name) => (
                                <div className="flex flex-col">
                                    <span className="text-xs text-muted-foreground">{chartConfig[name as keyof typeof chartConfig].label}</span>
                                    <span className="font-bold">{formatCurrency(Number(value), language)}</span>
                                </div>
                            )}
                            labelFormatter={(label) => `${t('month')} ${label}`}
                        />
                    }
                />
                 <Legend />
                <Line
                    dataKey="remainingBalance"
                    type="monotone"
                    stroke={chartConfig.remainingBalance.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.remainingBalance.label}
                />
                <Line
                    dataKey="principal"
                    type="monotone"
                    stroke={chartConfig.principal.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.principal.label}
                />
                <Line
                    dataKey="interest"
                    type="monotone"
                    stroke={chartConfig.interest.color}
                    strokeWidth={2}
                    dot={false}
                    name={chartConfig.interest.label}
                />
            </LineChart>
        </ChartContainer>
    );
}
