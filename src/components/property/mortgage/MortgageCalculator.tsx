
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import MortgageInputs from "./MortgageInputs";
import MortgagePaymentSummary from "./MortgagePaymentSummary";
import CashFlowAnalysis from "./CashFlowAnalysis";

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

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Mortgage Calculator</h2>
      
      <MortgageInputs 
        homePrice={homePrice}
        term={term}
        rate={rate}
        downPayment={downPayment}
        downPaymentPercent={downPaymentPercent}
        onHomePriceChange={handleHomePriceChange}
        onTermChange={setTerm}
        onRateChange={setRate}
        onDownPaymentChange={handleDownPaymentChange}
        onDownPaymentPercentChange={handleDownPaymentPercentChange}
      />
      
      <MortgagePaymentSummary monthlyPayment={monthlyPayment} />
      
      <CashFlowAnalysis
        monthlyPayment={monthlyPayment}
        propertyTax={propertyTax}
        maintenanceCost={maintenanceCost}
        rentalIncome={rentalIncome}
        cashFlow={cashFlow}
        onPropertyTaxChange={setPropertyTax}
        onMaintenanceCostChange={setMaintenanceCost}
        onRentalIncomeChange={setRentalIncome}
      />
    </Card>
  );
};

export default MortgageCalculator;
