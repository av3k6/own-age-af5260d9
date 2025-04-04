
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
              <TableHead className="w-[180px] py-4 text-base">Scenario</TableHead>
              <TableHead className="py-4 text-base">Home Price</TableHead>
              <TableHead className="py-4 text-base">Down Payment</TableHead>
              <TableHead className="py-4 text-base">Term</TableHead>
              <TableHead className="py-4 text-base">Rate</TableHead>
              <TableHead className="py-4 text-base">Monthly Payment</TableHead>
              <TableHead className="py-4 text-base">Cash Flow</TableHead>
              <TableHead className="w-[100px] py-4 text-base">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((scenario) => (
              <TableRow key={scenario.id} className="text-base">
                <TableCell className="font-medium py-4 text-base">{scenario.name}</TableCell>
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
                  <Button
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(scenario.id)}
                    className="text-destructive hover:bg-destructive/10 h-10 w-10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-sm text-muted-foreground mt-4">
        * Source: TransacZen Haven - Providing reliable real estate data and tools.
      </div>
    </div>
  );
};

export default ScenarioComparison;
