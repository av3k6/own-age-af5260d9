
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface MortgageInputsProps {
  homePrice: number;
  term: number;
  rate: number;
  downPayment: number;
  downPaymentPercent: number;
  onHomePriceChange: (value: string) => void;
  onTermChange: (value: number) => void;
  onRateChange: (value: number) => void;
  onDownPaymentChange: (value: string) => void;
  onDownPaymentPercentChange: (value: number[]) => void;
}

const MortgageInputs = ({
  homePrice,
  term,
  rate,
  downPayment,
  downPaymentPercent,
  onHomePriceChange,
  onTermChange,
  onRateChange,
  onDownPaymentChange,
  onDownPaymentPercentChange
}: MortgageInputsProps) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <label htmlFor="homePrice">Home Price:</label>
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
      
      <div className="grid gap-2">
        <label htmlFor="term">Term:</label>
        <select 
          id="term"
          value={term}
          onChange={(e) => onTermChange(Number(e.target.value))}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        >
          <option value={15}>15 years</option>
          <option value={20}>20 years</option>
          <option value={25}>25 years</option>
          <option value={30}>30 years</option>
        </select>
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="rate">Rate:</label>
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
      
      <div className="grid gap-2">
        <label htmlFor="downPayment">Down Payment:</label>
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
          <span className="inline-flex items-center px-3 border border-l-0 border-input rounded-r-md bg-muted">
            {downPaymentPercent.toFixed(0)}%
          </span>
        </div>
        <Slider
          value={[downPaymentPercent]}
          min={0}
          max={100}
          step={1}
          onValueChange={onDownPaymentPercentChange}
        />
      </div>
    </div>
  );
};

export default MortgageInputs;
