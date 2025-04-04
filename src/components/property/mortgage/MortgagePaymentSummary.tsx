
import { formatCurrency } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface MortgagePaymentSummaryProps {
  monthlyPayment: number;
}

const MortgagePaymentSummary = ({ monthlyPayment }: MortgagePaymentSummaryProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate annual and total payments
  const annualPayment = monthlyPayment * 12;
  const biweeklyPayment = monthlyPayment / 2.17;
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  return (
    <div className="pt-4 border-t border-border">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Monthly Payment</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(monthlyPayment)}</span>
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
              <div className="text-sm text-muted-foreground">Bi-weekly Payment</div>
              <div className="font-medium">{formatCurrency(biweeklyPayment)}</div>
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
