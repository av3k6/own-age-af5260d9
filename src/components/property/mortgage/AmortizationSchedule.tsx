
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { ChevronDown, ChevronUp } from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";

interface AmortizationScheduleProps {
  principal: number;
  annualRate: number;
  termYears: number;
}

interface AmortizationEntry {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  totalInterest: number;
  balance: number;
}

const generateAmortizationSchedule = (
  principal: number,
  annualRate: number,
  termYears: number
): AmortizationEntry[] => {
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  
  if (annualRate === 0) {
    const monthlyPayment = principal / totalPayments;
    
    return Array.from({ length: termYears }, (_, i) => {
      const year = i + 1;
      const yearlyPrincipal = monthlyPayment * 12;
      const yearlyBalance = principal - yearlyPrincipal * year;
      
      return {
        year,
        payment: yearlyPrincipal,
        principal: yearlyPrincipal,
        interest: 0,
        totalInterest: 0,
        balance: yearlyBalance > 0 ? yearlyBalance : 0,
      };
    });
  }
  
  const monthlyPayment = principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
    (Math.pow(1 + monthlyRate, totalPayments) - 1);
  
  let balance = principal;
  let totalInterestPaid = 0;
  
  return Array.from({ length: termYears }, (_, i) => {
    const year = i + 1;
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;
    
    // Calculate payments for each month in the year
    for (let month = 0; month < 12; month++) {
      if (balance <= 0) break;
      
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
      
      yearlyInterest += interestPayment;
      yearlyPrincipal += principalPayment;
      balance -= principalPayment;
    }
    
    totalInterestPaid += yearlyInterest;
    
    return {
      year,
      payment: yearlyPrincipal + yearlyInterest,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      totalInterest: totalInterestPaid,
      balance: balance > 0 ? balance : 0,
    };
  });
};

const AmortizationSchedule = ({ principal, annualRate, termYears }: AmortizationScheduleProps) => {
  const [showTable, setShowTable] = useState(false);
  
  // Generate the amortization schedule data
  const amortizationData = generateAmortizationSchedule(principal, annualRate, termYears);
  
  // Format data for the chart
  const chartData = amortizationData.map(entry => ({
    year: entry.year,
    Principal: entry.principal,
    Interest: entry.interest,
    Balance: entry.balance
  }));
  
  return (
    <div className="pt-8 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Amortization Schedule</h3>
        <Button 
          variant="outline" 
          onClick={() => setShowTable(!showTable)}
          className="flex items-center gap-2"
        >
          {showTable ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {showTable ? "Hide Table" : "Show Table"}
        </Button>
      </div>
      
      <div className="h-80 w-full border rounded-md p-4 bg-card">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="year"
              label={{ value: 'Year', position: 'insideBottomRight', offset: -10 }} 
            />
            <YAxis 
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}  
            />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line type="monotone" dataKey="Principal" stroke="#4f46e5" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Interest" stroke="#f59e0b" />
            <Line type="monotone" dataKey="Balance" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {showTable && (
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="py-3">Year</TableHead>
                <TableHead className="py-3">Payment</TableHead>
                <TableHead className="py-3">Principal</TableHead>
                <TableHead className="py-3">Interest</TableHead>
                <TableHead className="py-3">Total Interest</TableHead>
                <TableHead className="py-3">Remaining Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {amortizationData.map((entry) => (
                <TableRow key={entry.year}>
                  <TableCell>{entry.year}</TableCell>
                  <TableCell>{formatCurrency(entry.payment)}</TableCell>
                  <TableCell>{formatCurrency(entry.principal)}</TableCell>
                  <TableCell>{formatCurrency(entry.interest)}</TableCell>
                  <TableCell>{formatCurrency(entry.totalInterest)}</TableCell>
                  <TableCell>{formatCurrency(entry.balance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AmortizationSchedule;
