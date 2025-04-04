
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Home, RefreshCw } from "lucide-react";

interface MortgageInputsProps {
  homePrice: number;
  term: number;
  rate: number;
  downPayment: number;
  downPaymentPercent: number;
  paymentFrequency: string;
  onHomePriceChange: (value: string) => void;
  onTermChange: (value: number) => void;
  onRateChange: (value: number) => void;
  onDownPaymentChange: (value: string) => void;
  onDownPaymentPercentChange: (value: number[]) => void;
  onPaymentFrequencyChange: (value: string) => void;
}

const MortgageInputs = ({
  homePrice,
  term,
  rate,
  downPayment,
  downPaymentPercent,
  paymentFrequency,
  onHomePriceChange,
  onTermChange,
  onRateChange,
  onDownPaymentChange,
  onDownPaymentPercentChange,
  onPaymentFrequencyChange
}: MortgageInputsProps) => {
  // Available terms
  const terms = [1, 2, 3, 4, 5, 6, 7, 10, 15, 20, 25, 30];
  
  // Current average rates based on the sample data
  const currentRates = [
    { term: 1, rate: 5.19 },
    { term: 2, rate: 4.24 },
    { term: 3, rate: 3.79 },
    { term: 4, rate: 4.19 },
    { term: 5, rate: 3.74 },
    { term: 6, rate: 5.14 },
    { term: 7, rate: 4.49 },
    { term: 10, rate: 5.25 },
    { term: 15, rate: 4.95 },
    { term: 20, rate: 5.15 },
    { term: 25, rate: 5.35 },
    { term: 30, rate: 5.45 },
  ];
  
  // Get the current rate for the selected term
  const getCurrentRate = (selectedTerm: number) => {
    const found = currentRates.find(item => item.term === selectedTerm);
    return found ? found.rate : rate;
  };
  
  // Handle term change and auto-update rate based on current market rates
  const handleTermChange = (value: string) => {
    const newTerm = parseInt(value, 10);
    onTermChange(newTerm);
    
    // Auto-update rate when term changes
    const newRate = getCurrentRate(newTerm);
    onRateChange(newRate);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Transaction Type */}
        <div className="space-y-2">
          <Label>Transaction Type</Label>
          <Select defaultValue="buying">
            <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <SelectValue placeholder="Select transaction type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buying">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>Buying a home</span>
                </div>
              </SelectItem>
              <SelectItem value="refinancing">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span>Refinancing</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Home Price */}
        <div className="space-y-2">
          <Label htmlFor="homePrice">Purchase Price</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
              $
            </span>
            <Input 
              id="homePrice"
              type="text" 
              value={homePrice.toLocaleString()}
              onChange={(e) => onHomePriceChange(e.target.value)}
              className="rounded-l-none"
            />
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Down Payment */}
        <div className="space-y-2">
          <Label htmlFor="downPayment">Down Payment</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
              $
            </span>
            <Input 
              id="downPayment"
              type="text"
              value={downPayment.toLocaleString()}
              onChange={(e) => onDownPaymentChange(e.target.value)}
              className="rounded-l-none rounded-r-none"
            />
            <span className="inline-flex items-center px-3 border border-l-0 border-input rounded-r-md bg-muted min-w-[60px] justify-center">
              {downPaymentPercent.toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[downPaymentPercent]}
            min={0}
            max={100}
            step={1}
            onValueChange={onDownPaymentPercentChange}
            className="mt-2"
          />
        </div>
      
        {/* Term */}
        <div className="space-y-2">
          <Label htmlFor="term">Term</Label>
          <Select value={term.toString()} onValueChange={handleTermChange}>
            <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <SelectValue placeholder="Select term" />
            </SelectTrigger>
            <SelectContent>
              {terms.map((t) => (
                <SelectItem key={t} value={t.toString()}>
                  {t}-yr fixed
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="rate">Interest Rate</Label>
          <div className="flex">
            <Input 
              id="rate"
              type="number"
              step="0.01" 
              value={rate}
              onChange={(e) => onRateChange(Number(e.target.value))} 
              className="rounded-r-none"
            />
            <span className="inline-flex items-center px-3 border border-l-0 border-input rounded-r-md bg-muted">
              %
            </span>
          </div>
        </div>

        {/* Payment Frequency */}
        <div className="space-y-2">
          <Label htmlFor="payment-frequency">Payment Frequency</Label>
          <Select value={paymentFrequency} onValueChange={onPaymentFrequencyChange}>
            <SelectTrigger className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <SelectValue placeholder="Select payment frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly</SelectItem>
              <SelectItem value="accelerated-biweekly">Accelerated Bi-weekly</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="accelerated-weekly">Accelerated Weekly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default MortgageInputs;
