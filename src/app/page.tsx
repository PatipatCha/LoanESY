
"use client";
import { LoanCalculator } from '@/components/loan-calculator';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/context/language-context';


export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen w-full">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <LoanCalculator />
      </div>
    </main>
  );
}
