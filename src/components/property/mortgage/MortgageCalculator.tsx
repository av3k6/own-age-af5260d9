import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Home, RefreshCw, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import MortgageInputs from "./MortgageInputs";
import MortgagePaymentSummary from "./MortgagePaymentSummary";
import CashFlowAnalysis from "./CashFlowAnalysis";
import ScenarioComparison from "./ScenarioComparison";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

interface MortgageScenario {
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

const MortgageCalculator = ({ propertyPrice }: MortgageCalculatorProps) => {
  const [activeTab, setActiveTab] = useState<string>("calculator");
  const [scenarios, setScenarios] = useState<MortgageScenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState<MortgageScenario>({
    id: "default",
    name: "Current Scenario",
    homePrice: propertyPrice,
    term: 30,
    rate: 4.5,
    downPayment: propertyPrice * 0.2,
    downPaymentPercent: 20,
    monthlyPayment: 0,
    propertyTax: Math.round(propertyPrice * 0.01 / 12),
    maintenanceCost: 0,
    rentalIncome: 0,
    cashFlow: 0
  });
  
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

  const calculateCashFlow = (mortgagePayment: number, scenario: MortgageScenario) => {
    return scenario.rentalIncome - mortgagePayment - scenario.propertyTax - scenario.maintenanceCost;
  };

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

  const handleHomePriceChange = (value: string) => {
    const price = parseFloat(value.replace(/,/g, '')) || 0;
    setCurrentScenario(prev => ({
      ...prev,
      homePrice: price,
      downPayment: (price * prev.downPaymentPercent) / 100,
      propertyTax: Math.round(price * 0.01 / 12)
    }));
  };

  const handleDownPaymentChange = (value: string) => {
    const payment = parseFloat(value.replace(/,/g, '')) || 0;
    setCurrentScenario(prev => ({
      ...prev,
      downPayment: payment,
      downPaymentPercent: (payment / prev.homePrice) * 100
    }));
  };

  const handleDownPaymentPercentChange = (value: number[]) => {
    const percent = value[0];
    setCurrentScenario(prev => ({
      ...prev,
      downPaymentPercent: percent,
      downPayment: (prev.homePrice * percent) / 100
    }));
  };

  const saveScenario = () => {
    const newScenario = {
      ...currentScenario,
      id: `scenario-${Date.now()}`,
      name: `Scenario ${scenarios.length + 1}`
    };
    
    setScenarios([...scenarios, newScenario]);
  };

  const createNewScenario = () => {
    setCurrentScenario({
      id: "default",
      name: "New Scenario",
      homePrice: propertyPrice,
      term: 30,
      rate: 4.5,
      downPayment: propertyPrice * 0.2,
      downPaymentPercent: 20,
      monthlyPayment: 0,
      propertyTax: Math.round(propertyPrice * 0.01 / 12),
      maintenanceCost: 0,
      rentalIncome: 0,
      cashFlow: 0
    });
  };

  const deleteScenario = (id: string) => {
    setScenarios(scenarios.filter(scenario => scenario.id !== id));
  };

  return (
    <Card className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col space-y-4">
        <h2 className="text-3xl font-bold">Mortgage Calculator</h2>
        <p className="text-muted-foreground mb-4">
          Calculate mortgage payments and analyze potential cash flow for your investment property.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
              <Home className="h-5 w-5" />
              <span className="text-base">Calculator</span>
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2 py-3">
              <RefreshCw className="h-5 w-5" />
              <span className="text-base">Compare ({scenarios.length})</span>
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="calculator" className="space-y-8 pt-4">
            <MortgageInputs 
              homePrice={currentScenario.homePrice}
              term={currentScenario.term}
              rate={currentScenario.rate}
              downPayment={currentScenario.downPayment}
              downPaymentPercent={currentScenario.downPaymentPercent}
              onHomePriceChange={handleHomePriceChange}
              onTermChange={(value) => setCurrentScenario(prev => ({ ...prev, term: value }))}
              onRateChange={(value) => setCurrentScenario(prev => ({ ...prev, rate: value }))}
              onDownPaymentChange={handleDownPaymentChange}
              onDownPaymentPercentChange={handleDownPaymentPercentChange}
            />
            
            <MortgagePaymentSummary monthlyPayment={currentScenario.monthlyPayment} />
            
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
          </TabsContent>
          
          <TabsContent value="compare" className="space-y-8 pt-4">
            {scenarios.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-6">No scenarios to compare yet.</p>
                <Button 
                  onClick={() => {
                    createNewScenario();
                    setActiveTab("calculator");
                  }}
                  size="lg"
                  className="py-6 px-8 text-base"
                >
                  Create First Scenario
                </Button>
              </div>
            ) : (
              <ScenarioComparison 
                scenarios={scenarios}
                onDelete={deleteScenario}
                onCreateNew={() => {
                  createNewScenario();
                  setActiveTab("calculator");
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default MortgageCalculator;
