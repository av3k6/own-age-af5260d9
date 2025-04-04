
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMortgageCalculator } from "@/contexts/MortgageCalculatorContext";
import MortgageInputs from "./MortgageInputs";
import MortgagePaymentSummary from "./MortgagePaymentSummary";
import CashFlowAnalysis from "./CashFlowAnalysis";
import AmortizationSchedule from "./AmortizationSchedule";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CalculatorTab: React.FC = () => {
  const {
    currentScenario,
    setCurrentScenario,
    handleHomePriceChange,
    handleDownPaymentChange,
    handleDownPaymentPercentChange,
    saveScenario,
  } = useMortgageCalculator();

  return (
    <div className="space-y-8 pt-4">
      <div className="space-y-4">
        <Label htmlFor="scenario-name">Scenario Name</Label>
        <Input
          id="scenario-name"
          value={currentScenario.name}
          onChange={(e) => setCurrentScenario(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter scenario name"
          className="max-w-md"
        />
      </div>
      
      <MortgageInputs 
        homePrice={currentScenario.homePrice}
        term={currentScenario.term}
        rate={currentScenario.rate}
        downPayment={currentScenario.downPayment}
        downPaymentPercent={currentScenario.downPaymentPercent}
        paymentFrequency={currentScenario.paymentFrequency}
        onHomePriceChange={handleHomePriceChange}
        onTermChange={(value) => setCurrentScenario(prev => ({ ...prev, term: value }))}
        onRateChange={(value) => setCurrentScenario(prev => ({ ...prev, rate: value }))}
        onDownPaymentChange={handleDownPaymentChange}
        onDownPaymentPercentChange={handleDownPaymentPercentChange}
        onPaymentFrequencyChange={(value) => setCurrentScenario(prev => ({ ...prev, paymentFrequency: value }))}
      />
      
      <MortgagePaymentSummary 
        monthlyPayment={currentScenario.monthlyPayment} 
        paymentFrequency={currentScenario.paymentFrequency}
      />
      
      <CashFlowAnalysis
        monthlyPayment={currentScenario.monthlyPayment}
        propertyTax={currentScenario.propertyTax}
        maintenanceCost={currentScenario.maintenanceCost}
        rentalIncome={currentScenario.rentalIncome}
        cashFlow={currentScenario.cashFlow}
        onPropertyTaxChange={(value) => setCurrentScenario(prev => ({ ...prev, propertyTax: value }))}
        onMaintenanceCostChange={(value) => setCurrentScenario(prev => ({ ...prev, maintenanceCost: value }))}
        onRentalIncomeChange={(value) => setCurrentScenario(prev => ({ ...prev, rentalIncome: value }))}
      />

      <AmortizationSchedule
        principal={currentScenario.homePrice - currentScenario.downPayment}
        annualRate={currentScenario.rate}
        termYears={currentScenario.term}
      />

      <div className="flex justify-end mt-8">
        <Button 
          onClick={saveScenario} 
          className="flex items-center gap-2 text-base py-6 px-6"
          size="lg"
        >
          <PlusCircle className="h-5 w-5" />
          Save Scenario
        </Button>
      </div>
    </div>
  );
};

export default CalculatorTab;
