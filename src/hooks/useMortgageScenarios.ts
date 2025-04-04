
import { useState, useEffect } from "react";

export interface MortgageScenario {
  id: string;
  name: string;
  homePrice: number;
  term: number;
  rate: number;
  downPayment: number;
  downPaymentPercent: number;
  monthlyPayment: number;
  propertyTax: number;
  maintenanceCost: number;
  rentalIncome: number;
  cashFlow: number;
}

interface UseMortgageScenariosProps {
  initialPropertyPrice: number;
}

export const useMortgageScenarios = ({ initialPropertyPrice }: UseMortgageScenariosProps) => {
  const [scenarios, setScenarios] = useState<MortgageScenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<MortgageScenario>({
    id: "default",
    name: "Current Scenario",
    homePrice: initialPropertyPrice,
    term: 30,
    rate: 4.5,
    downPayment: initialPropertyPrice * 0.2,
    downPaymentPercent: 20,
    monthlyPayment: 0,
    propertyTax: Math.round(initialPropertyPrice * 0.01 / 12),
    maintenanceCost: 0,
    rentalIncome: 0,
    cashFlow: 0
  });

  // Calculate mortgage payment
  const calculateMortgage = (scenario: MortgageScenario) => {
    const principal = scenario.homePrice - scenario.downPayment;
    const monthlyInterest = scenario.rate / 100 / 12;
    const numberOfPayments = scenario.term * 12;
    
    if (scenario.rate === 0) {
      return principal / numberOfPayments;
    }
    
    const monthlyPayment = principal * 
      (monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) / 
      (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
    
    return monthlyPayment;
  };

  // Calculate cash flow
  const calculateCashFlow = (mortgagePayment: number, scenario: MortgageScenario) => {
    return scenario.rentalIncome - mortgagePayment - scenario.propertyTax - scenario.maintenanceCost;
  };

  // Update mortgage payment and cash flow whenever relevant inputs change
  useEffect(() => {
    const payment = calculateMortgage(currentScenario);
    const flow = calculateCashFlow(payment, currentScenario);
    
    setCurrentScenario(prev => ({
      ...prev,
      monthlyPayment: payment,
      cashFlow: flow
    }));
  }, [
    currentScenario.homePrice, 
    currentScenario.term, 
    currentScenario.rate, 
    currentScenario.downPayment, 
    currentScenario.propertyTax, 
    currentScenario.maintenanceCost, 
    currentScenario.rentalIncome
  ]);

  // Update home price and related values
  const handleHomePriceChange = (value: string) => {
    const price = parseFloat(value.replace(/,/g, '')) || 0;
    setCurrentScenario(prev => ({
      ...prev,
      homePrice: price,
      downPayment: (price * prev.downPaymentPercent) / 100,
      propertyTax: Math.round(price * 0.01 / 12)
    }));
  };

  // Update down payment amount
  const handleDownPaymentChange = (value: string) => {
    const payment = parseFloat(value.replace(/,/g, '')) || 0;
    setCurrentScenario(prev => ({
      ...prev,
      downPayment: payment,
      downPaymentPercent: (payment / prev.homePrice) * 100
    }));
  };

  // Update down payment percentage
  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    setCurrentScenario(prev => ({
      ...prev,
      downPaymentPercent: percent,
      downPayment: (prev.homePrice * percent) / 100
    }));
  };

  // Save current scenario
  const saveScenario = () => {
    const newScenario = {
      ...currentScenario,
      id: `scenario-${Date.now()}`,
      name: `Scenario ${scenarios.length + 1}`
    };
    
    setScenarios([...scenarios, newScenario]);
  };

  // Create a new scenario
  const createNewScenario = () => {
    setCurrentScenario({
      id: "default",
      name: "New Scenario",
      homePrice: initialPropertyPrice,
      term: 30,
      rate: 4.5,
      downPayment: initialPropertyPrice * 0.2,
      downPaymentPercent: 20,
      monthlyPayment: 0,
      propertyTax: Math.round(initialPropertyPrice * 0.01 / 12),
      maintenanceCost: 0,
      rentalIncome: 0,
      cashFlow: 0
    });
  };

  // Delete a scenario
  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
  };

  return {
    scenarios,
    currentScenario,
    setCurrentScenario,
    handleHomePriceChange,
    handleDownPaymentChange,
    handleDownPaymentPercentChange,
    saveScenario,
    createNewScenario,
    deleteScenario
  };
};
