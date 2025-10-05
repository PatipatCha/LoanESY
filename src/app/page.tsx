
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
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-2">
            {t('loanEase')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
        </header>
        <LoanCalculator />
      </div>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} {t('loanEase')}. {t('allRightsReserved')}.</p>
      </footer>
    </main>
  );
}
