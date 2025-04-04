
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import { PlusCircle, Trash2 } from "lucide-react";

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

interface ScenarioComparisonProps {
  scenarios: MortgageScenario[];
  onDelete: (id: string) => void;
  onCreateNew: () => void;
}

const ScenarioComparison = ({ scenarios, onDelete, onCreateNew }: ScenarioComparisonProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Compare Scenarios</h3>
        <Button onClick={onCreateNew} variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Scenario
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Scenario</TableHead>
              <TableHead>Home Price</TableHead>
              <TableHead>Down Payment</TableHead>
              <TableHead>Term</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Monthly Payment</TableHead>
              <TableHead>Cash Flow</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((scenario) => (
              <TableRow key={scenario.id}>
                <TableCell className="font-medium">{scenario.name}</TableCell>
                <TableCell>{formatCurrency(scenario.homePrice)}</TableCell>
                <TableCell>
                  {formatCurrency(scenario.downPayment)} ({scenario.downPaymentPercent.toFixed(0)}%)
                </TableCell>
                <TableCell>{scenario.term} years</TableCell>
                <TableCell>{scenario.rate.toFixed(2)}%</TableCell>
                <TableCell className="font-semibold">{formatCurrency(scenario.monthlyPayment)}</TableCell>
                <TableCell 
                  className={scenario.cashFlow >= 0 ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}
                >
                  {formatCurrency(scenario.cashFlow)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(scenario.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-xs text-muted-foreground mt-4">
        * Source: TransacZen Haven - Providing reliable real estate data and tools.
      </div>
    </div>
  );
};

export default ScenarioComparison;
