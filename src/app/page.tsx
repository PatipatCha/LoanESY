import { LoanCalculator } from '@/components/loan-calculator';

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground mb-2">
            LoanEase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Effortlessly calculate your monthly loan payments and see a detailed
            amortization schedule. Make informed financial decisions with our
            clean and simple tool.
          </p>
        </header>
        <LoanCalculator />
      </div>
      <footer className="text-center py-6 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} LoanEase. All rights reserved.</p>
      </footer>
    </main>
  );
}
