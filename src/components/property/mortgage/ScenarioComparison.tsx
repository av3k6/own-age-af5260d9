
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { PlusCircle, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  paymentFrequency?: string;
}

interface ScenarioComparisonProps {
  scenarios: MortgageScenario[];
  onDelete: (id: string) => void;
  onCreateNew: () => void;
  onUpdateName: (id: string, name: string) => void;
}

const ScenarioComparison = ({ 
  scenarios, 
  onDelete, 
  onCreateNew, 
  onUpdateName 
}: ScenarioComparisonProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  
  const startEditing = (scenario: MortgageScenario) => {
    setEditingId(scenario.id);
    setEditName(scenario.name);
  };
  
  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdateName(editingId, editName.trim());
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-medium">Compare Scenarios</h3>
        <Button onClick={onCreateNew} variant="outline" size="lg" className="py-6 px-6">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Scenario
        </Button>
      </div>
      
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[200px] py-4 text-base">Scenario</TableHead>
              <TableHead className="py-4 text-base">Home Price</TableHead>
              <TableHead className="py-4 text-base">Down Payment</TableHead>
              <TableHead className="py-4 text-base">Term</TableHead>
              <TableHead className="py-4 text-base">Rate</TableHead>
              <TableHead className="py-4 text-base">Monthly Payment</TableHead>
              <TableHead className="py-4 text-base">Cash Flow</TableHead>
              <TableHead className="w-[120px] py-4 text-base">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((scenario) => (
              <TableRow key={scenario.id} className="text-base">
                <TableCell className="font-medium py-4 text-base">
                  {editingId === scenario.id ? (
                    <div className="flex w-full max-w-[180px]">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={saveEdit}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        className="py-1 px-2 h-8"
                      />
                    </div>
                  ) : (
                    scenario.name
                  )}
                </TableCell>
                <TableCell className="py-4 text-base">{formatCurrency(scenario.homePrice)}</TableCell>
                <TableCell className="py-4 text-base">
                  {formatCurrency(scenario.downPayment)} ({scenario.downPaymentPercent.toFixed(0)}%)
                </TableCell>
                <TableCell className="py-4 text-base">{scenario.term} years</TableCell>
                <TableCell className="py-4 text-base">{scenario.rate.toFixed(2)}%</TableCell>
                <TableCell className="font-semibold py-4 text-base">{formatCurrency(scenario.monthlyPayment)}</TableCell>
                <TableCell 
                  className={`py-4 text-base font-semibold ${scenario.cashFlow >= 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {formatCurrency(scenario.cashFlow)}
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => startEditing(scenario)}
                      className="text-muted-foreground hover:text-foreground h-9 w-9"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(scenario.id)}
                      className="text-destructive hover:bg-destructive/10 h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground mt-4">
        * TransacZen Haven - Providing reliable real estate data and tools.
      </div>
    </div>
  );
};

export default ScenarioComparison;
