
import { ChartContainer } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "@/lib/formatters";

interface CashFlowAnalysisProps {
  monthlyPayment: number;
  propertyTax: number;
  maintenanceCost: number;
  rentalIncome: number;
  cashFlow: number;
  onPropertyTaxChange: (value: number) => void;
  onMaintenanceCostChange: (value: number) => void;
  onRentalIncomeChange: (value: number) => void;
}

const CashFlowAnalysis = ({
  monthlyPayment,
  propertyTax,
  maintenanceCost,
  rentalIncome,
  cashFlow,
  onPropertyTaxChange,
  onMaintenanceCostChange,
  onRentalIncomeChange
}: CashFlowAnalysisProps) => {
  // Cash flow chart data
  const cashFlowData = [
    { name: "Positive", value: cashFlow > 0 ? cashFlow : 0 },
    { name: "Negative", value: cashFlow < 0 ? Math.abs(cashFlow) : 0 },
  ];
  
  // Chart colors
  const COLORS = ['#4ade80', '#ef4444'];
  
  return (
    <div className="pt-4 border-t border-border">
      <h3 className="text-xl font-bold mb-3">Cash Flow Analysis</h3>
      
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">Mortgage Payment:</div>
            <div className="font-medium">{formatCurrency(monthlyPayment)}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Monthly Payment:</div>
            <div className="font-medium">{formatCurrency(monthlyPayment + propertyTax + maintenanceCost)}</div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground">Break Even Down Payment:</div>
            <div className="font-medium">{Math.round((monthlyPayment / (monthlyPayment + propertyTax)) * 100)}%</div>
          </div>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="propertyTax">Property Tax (Monthly):</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
              $
            </span>
            <Input 
              id="propertyTax"
              type="number"
              value={propertyTax}
              onChange={(e) => onPropertyTaxChange(Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="maintenanceCost">Maintenance Cost:</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
              $
            </span>
            <Input 
              id="maintenanceCost"
              type="number"
              value={maintenanceCost}
              onChange={(e) => onMaintenanceCostChange(Number(e.target.value))}
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <label htmlFor="rentalIncome">Rental Income:</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-input rounded-l-md bg-muted">
              $
            </span>
            <Input 
              id="rentalIncome"
              type="number"
              value={rentalIncome}
              onChange={(e) => onRentalIncomeChange(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <div className="text-center mb-2">
            <div className="text-lg font-medium">Cash Flow</div>
            <div className={`text-2xl font-bold ${cashFlow >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatCurrency(cashFlow)}
            </div>
          </div>
        </div>
        
        <div className="h-48">
          {(cashFlow !== 0) && (
            <ChartContainer 
              config={{
                positive: { color: '#4ade80' },
                negative: { color: '#ef4444' },
              }}
            >
              <PieChart>
                <Pie
                  data={cashFlowData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {cashFlowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mt-2">
        * Source: TransacZen Haven - Providing reliable real estate data and tools.
      </div>
    </div>
  );
};

export default CashFlowAnalysis;
