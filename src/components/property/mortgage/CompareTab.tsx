
import React from "react";
import { Button } from "@/components/ui/button";
import { useMortgageCalculator } from "@/contexts/MortgageCalculatorContext";
import ScenarioComparison from "./ScenarioComparison";

const CompareTab: React.FC = () => {
  const {
    scenarios,
    deleteScenario,
    createNewScenario,
    updateScenarioName,
    setActiveTab
  } = useMortgageCalculator();

  return (
    <div className="space-y-8 pt-4">
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
          onUpdateName={updateScenarioName}
        />
      )}
    </div>
  );
};

export default CompareTab;
