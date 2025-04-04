
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, RefreshCw } from "lucide-react";
import { MortgageCalculatorProvider, useMortgageCalculator } from "@/contexts/MortgageCalculatorContext";
import CalculatorTab from "./CalculatorTab";
import CompareTab from "./CompareTab";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

const MortgageCalculatorContent: React.FC = () => {
  const { activeTab, setActiveTab, scenarios } = useMortgageCalculator();

  return (
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
      
        <TabsContent value="calculator">
          <CalculatorTab />
        </TabsContent>
        
        <TabsContent value="compare">
          <CompareTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({ propertyPrice }) => {
  return (
    <MortgageCalculatorProvider propertyPrice={propertyPrice}>
      <Card className="p-8 space-y-8 max-w-6xl mx-auto">
        <MortgageCalculatorContent />
      </Card>
    </MortgageCalculatorProvider>
  );
};

export default MortgageCalculator;
