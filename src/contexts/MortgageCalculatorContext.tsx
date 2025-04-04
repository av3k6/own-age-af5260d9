
import React, { createContext, useContext } from "react";
import { useMortgageScenarios, MortgageScenario } from "@/hooks/useMortgageScenarios";

interface MortgageCalculatorContextType {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  scenarios: MortgageScenario[];
  currentScenario: MortgageScenario;
  setCurrentScenario: React.Dispatch<React.SetStateAction<MortgageScenario>>;
  handleHomePriceChange: (value: string) => void;
  handleDownPaymentChange: (value: string) => void;
  handleDownPaymentPercentChange: (value: number[]) => void;
  saveScenario: () => void;
  createNewScenario: () => void;
  deleteScenario: (id: string) => void;
}

const MortgageCalculatorContext = createContext<MortgageCalculatorContextType | undefined>(undefined);

export const useMortgageCalculator = () => {
  const context = useContext(MortgageCalculatorContext);
  if (!context) {
    throw new Error("useMortgageCalculator must be used within a MortgageCalculatorProvider");
  }
  return context;
};

interface MortgageCalculatorProviderProps {
  children: React.ReactNode;
  propertyPrice: number;
}

export const MortgageCalculatorProvider: React.FC<MortgageCalculatorProviderProps> = ({ 
  children, 
  propertyPrice 
}) => {
  const [activeTab, setActiveTab] = React.useState<string>("calculator");
  const {
    scenarios,
    currentScenario,
    setCurrentScenario,
    handleHomePriceChange,
    handleDownPaymentChange,
    handleDownPaymentPercentChange,
    saveScenario,
    createNewScenario,
    deleteScenario
  } = useMortgageScenarios({ initialPropertyPrice: propertyPrice });

  return (
    <MortgageCalculatorContext.Provider value={{
      activeTab,
      setActiveTab,
      scenarios,
      currentScenario,
      setCurrentScenario,
      handleHomePriceChange,
      handleDownPaymentChange,
      handleDownPaymentPercentChange,
      saveScenario,
      createNewScenario,
      deleteScenario
    }}>
      {children}
    </MortgageCalculatorContext.Provider>
  );
};
