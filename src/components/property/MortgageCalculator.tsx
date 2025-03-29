
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { formatCurrency } from "@/lib/formatters";
import { ChartContainer, ChartLegendContent, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

const MortgageCalculator = ({ propertyPrice }: MortgageCalculatorProps) => {
  const [homePrice, setHomePrice] = useState<number>(propertyPrice);
  const [term, setTerm] = useState<number>(30);
  const [rate, setRate] = useState<number>(4.5);
  const [downPayment, setDownPayment] = useState<number>(homePrice * 0.2);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  
  // Additional cash flow fields
  const [propertyTax, setPropertyTax] = useState<number>(Math.round(homePrice * 0.01 / 12));
  const [maintenanceCost, setMaintenanceCost] = useState<number>(0);
  const [rentalIncome, setRentalIncome] = useState<number>(0);
  const [cashFlow, setCashFlow] = useState<number>(0);

  // Calculate mortgage payment
  const calculateMortgage = () => {
    const principal = homePrice - downPayment;
    const monthlyInterest = rate / 100 / 12;
    const numberOfPayments = term * 12;
    
    if (rate === 0) {
      return principal / numberOfPayments;
    }
    
    const monthlyPayment = principal * 
      (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  // Calculate cash flow
  const calculateCashFlow = (mortgagePayment: number) => {
    return rentalIncome - mortgagePayment - propertyTax - maintenanceCost;
  };

  useEffect(() => {
    const payment = calculateMortgage();
    setMonthlyPayment(payment);
    
    const flow = calculateCashFlow(payment);
    setCashFlow(flow);
  }, [homePrice, term, rate, downPayment, propertyTax, maintenanceCost, rentalIncome]);

  // Handle home price changes
  const handleHomePriceChange = (value: string) => {
    const price = parseFloat(value.replace(/,/g, '')) || 0;
    setHomePrice(price);
    setDownPayment((price * downPaymentPercent) / 100);
  };

  // Handle down payment changes
  const handleDownPaymentChange = (value: string) => {
    const payment = parseFloat(value.replace(/,/g, '')) || 0;
    setDownPayment(payment);
    setDownPaymentPercent((payment / homePrice) * 100);
  };

  // Handle down payment percent slider
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    setDownPaymentPercent(percent);
    setDownPayment((homePrice * percent) / 100);
  };
  
  // Cash flow chart data
  const cashFlowData = [
    { name: "Positive", value: cashFlow > 0 ? cashFlow : 0 },
    { name: "Negative", value: cashFlow < 0 ? Math.abs(cashFlow) : 0 },
  ];
  
  // Chart colors
  const COLORS = ['#4ade80', '#ef4444'];
  
  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Mortgage Calculator</h2>
      
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
              onChange={(e) => handleHomePriceChange(e.target.value)}
              className="rounded-l-none"
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="term">Term:</label>
          <select 
            id="term"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
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
              onChange={(e) => setRate(Number(e.target.value))} 
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
              onChange={(e) => handleDownPaymentChange(e.target.value)}
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
            onValueChange={handleDownPaymentPercentChange}
          />
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Mortgage Payment</span>
          <span className="text-2xl font-bold text-primary">{formatCurrency(monthlyPayment)}</span>
        </div>
        <div className="text-xs text-muted-foreground mt-2">
          * Source: Calculation formula is compiled by HouseSigma. This is for educational use only.
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <h3 className="text-xl font-bold mb-3">Cash Flow Analysis</h3>
        
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Mortgage Payment:</div>
              <div className="font-medium">{formatCurrency(monthlyPayment)}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Monthly Payment:</div>
              <div className="font-medium">{formatCurrency(monthlyPayment + propertyTax + maintenanceCost)}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Break Even Down Payment:</div>
              <div className="font-medium">{Math.round((monthlyPayment / (monthlyPayment + propertyTax)) * 100)}%</div>
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="propertyTax">Property Tax (Monthly):</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
                $
              </span>
              <Input 
                id="propertyTax"
                type="number"
                value={propertyTax}
                onChange={(e) => setPropertyTax(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="maintenanceCost">Maintenance Cost:</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
                $
              </span>
              <Input 
                id="maintenanceCost"
                type="number"
                value={maintenanceCost}
                onChange={(e) => setMaintenanceCost(Number(e.target.value))}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="rentalIncome">Rental Income:</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
                $
              </span>
              <Input 
                id="rentalIncome"
                type="number"
                value={rentalIncome}
                onChange={(e) => setRentalIncome(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="text-center mb-2">
              <div className="text-lg font-medium">Cash Flow</div>
              <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatCurrency(cashFlow)}
              </div>
            </div>
          </div>
          
          <div className="h-48">
            {(cashFlow !== 0) && (
              <ChartContainer 
                config={{
                  positive: { color: '#4ade80' },
                  negative: { color: '#ef4444' },
                }}
              >
                <PieChart>
                  <Pie
                    data={cashFlowData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                  >
                    {cashFlowData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          * Source: Calculation formula is compiled by HouseSigma. This is for educational use only.
        </div>
      </div>
    </Card>
  );
};

export default MortgageCalculator;
