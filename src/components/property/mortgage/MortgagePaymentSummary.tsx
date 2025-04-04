
import { formatCurrency } from "@/lib/formatters";

interface MortgagePaymentSummaryProps {
  monthlyPayment: number;
}

const MortgagePaymentSummary = ({ monthlyPayment }: MortgagePaymentSummaryProps) => {
  return (
    <div className="pt-4 border-t border-border">
      <div className="flex justify-between items-center">
        <span className="text-lg font-medium">Mortgage Payment</span>
        <span className="text-2xl font-bold text-primary">{formatCurrency(monthlyPayment)}</span>
      </div>
    </div>
  );
};

export default MortgagePaymentSummary;
