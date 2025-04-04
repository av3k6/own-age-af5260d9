
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MortgagePaymentSummaryProps {
  monthlyPayment: number;
  paymentFrequency: string;
}

const MortgagePaymentSummary = ({ monthlyPayment, paymentFrequency }: MortgagePaymentSummaryProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate payment based on frequency
  const getPaymentByFrequency = () => {
    switch(paymentFrequency) {
      case 'biweekly':
        return monthlyPayment * 12 / 26;
      case 'accelerated-biweekly':
        return monthlyPayment / 2;
      case 'weekly':
        return monthlyPayment * 12 / 52;
      case 'accelerated-weekly':
        return monthlyPayment / 4;
      case 'monthly':
      default:
        return monthlyPayment;
    }
  };
  
  // Get frequency for display
  const getFrequencyLabel = () => {
    switch(paymentFrequency) {
      case 'biweekly':
        return 'Bi-weekly';
      case 'accelerated-biweekly':
        return 'Accelerated Bi-weekly';
      case 'weekly':
        return 'Weekly';
      case 'accelerated-weekly':
        return 'Accelerated Weekly';
      case 'monthly':
      default:
        return 'Monthly';
    }
  };

  // Calculate payment amounts
  const payment = getPaymentByFrequency();
  const biweeklyPayment = monthlyPayment * 12 / 26;
  const weeklyPayment = monthlyPayment * 12 / 52;
  const annualPayment = monthlyPayment * 12;
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  return (
    <div className="pt-4 border-t border-border">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">{getFrequencyLabel()} Payment</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(payment)}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="self-start -ml-2 text-muted-foreground"
          onClick={toggleDetails}
        >
          {showDetails ? (
            <>
              <ChevronUp className="mr-1 h-4 w-4" />
              Hide payment details
            </>
          ) : (
            <>
              <ChevronDown className="mr-1 h-4 w-4" />
              Show payment details
            </>
          )}
        </Button>
        
        {showDetails && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 pb-2 pl-2">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Monthly Payment</div>
              <div className="font-medium">{formatCurrency(monthlyPayment)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Bi-weekly Payment</div>
              <div className="font-medium">{formatCurrency(biweeklyPayment)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Weekly Payment</div>
              <div className="font-medium">{formatCurrency(weeklyPayment)}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Annual Payment</div>
              <div className="font-medium">{formatCurrency(annualPayment)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MortgagePaymentSummary;
