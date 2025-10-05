
"use client";
import { LoanCalculator } from '@/components/loan-calculator';
import { useTranslation } from '@/context/language-context';


export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <LoanCalculator />
      </div>
    </main>
  );
}
