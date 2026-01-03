import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2
  }).format(amount);
};

export default function CalculationBreakdown({ results, province, income }) {
  const [expanded, setExpanded] = useState(false);

  if (!results) return null;

  const federalBrackets = [
    { limit: 57375, rate: 0.145 },
    { limit: 114750, rate: 0.205 },
    { limit: 177882, rate: 0.26 },
    { limit: 253414, rate: 0.29 },
    { limit: Infinity, rate: 0.33 }
  ];

  const provincialBrackets = {
    BC: [
      { limit: 49279, rate: 0.0506 },
      { limit: 98560, rate: 0.077 },
      { limit: 113158, rate: 0.105 },
      { limit: 137407, rate: 0.1229 },
      { limit: 186306, rate: 0.147 },
      { limit: 259829, rate: 0.168 },
      { limit: Infinity, rate: 0.205 }
    ]
  };

  const calculateFederalSteps = (taxableIncome) => {
    const steps = [];
    let remaining = taxableIncome;
    let previousLimit = 0;
    let totalTax = 0;

    for (const bracket of federalBrackets) {
      if (remaining <= 0) break;
      const incomeInBracket = Math.min(remaining, bracket.limit) - previousLimit;
      if (incomeInBracket > 0) {
        const tax = incomeInBracket * bracket.rate;
        totalTax += tax;
        steps.push({
          range: `$${previousLimit.toLocaleString()} - $${bracket.limit === Infinity ? '∞' : bracket.limit.toLocaleString()}`,
          income: incomeInBracket,
          rate: bracket.rate * 100,
          tax: tax
        });
      }
      previousLimit = bracket.limit;
      if (taxableIncome <= bracket.limit) break;
    }

    return { steps, totalTax };
  };

  const calculateProvincialSteps = (taxableIncome, prov) => {
    const brackets = provincialBrackets[prov];
    if (!brackets) return { steps: [], totalTax: 0 };

    const steps = [];
    let remaining = taxableIncome;
    let previousLimit = 0;
    let totalTax = 0;

    for (const bracket of brackets) {
      if (remaining <= 0) break;
      const incomeInBracket = Math.min(remaining, bracket.limit) - previousLimit;
      if (incomeInBracket > 0) {
        const tax = incomeInBracket * bracket.rate;
        totalTax += tax;
        steps.push({
          range: `$${previousLimit.toLocaleString()} - $${bracket.limit === Infinity ? '∞' : bracket.limit.toLocaleString()}`,
          income: incomeInBracket,
          rate: bracket.rate * 100,
          tax: tax
        });
      }
      previousLimit = bracket.limit;
      if (taxableIncome <= bracket.limit) break;
    }

    return { steps, totalTax };
  };

  const federalCalc = calculateFederalSteps(results.taxableIncome);
  const provincialCalc = calculateProvincialSteps(results.taxableIncome, province);

  return (
    <Card className="mt-6">
      <CardHeader className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Detailed Calculation Breakdown</CardTitle>
          <Button variant="ghost" size="sm">
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="space-y-6 text-sm">
          {/* CPP & EI Section */}
          <div>
            <h4 className="font-semibold mb-2 text-slate-700">Step 1: CPP & EI Deductions</h4>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="flex justify-between">
                <span>Employment Income:</span>
                <span className="font-mono">{formatCurrency(income?.employment || 0)}</span>
              </div>
              <div className="text-xs text-slate-500 pl-4">
                <div>CPP: Rate = 5.95%, Basic Exemption = $3,500, Max Pensionable = $68,500</div>
                <div>Contributory Earnings = Min($68,500, {formatCurrency(income?.employment || 0)}) - $3,500 = {formatCurrency(Math.min(68500, income?.employment || 0) - 3500)}</div>
                <div>CPP Contribution = {formatCurrency(Math.min(68500, income?.employment || 0) - 3500)} × 5.95% = {formatCurrency(results.cppContribution)}</div>
              </div>
              <div className="text-xs text-slate-500 pl-4">
                <div>EI: Rate = 1.66%, Max Insurable = $63,200</div>
                <div>EI Premium = Min({formatCurrency(income?.employment || 0)}, $63,200) × 1.66% = {formatCurrency(results.eiPremium)}</div>
              </div>
            </div>
          </div>

          {/* Taxable Income */}
          <div>
            <h4 className="font-semibold mb-2 text-slate-700">Step 2: Taxable Income</h4>
            <div className="bg-slate-50 rounded-lg p-3 space-y-1">
              <div className="flex justify-between">
                <span>Total Income:</span>
                <span className="font-mono">{formatCurrency(results.totalIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: CPP Contribution:</span>
                <span className="font-mono">-{formatCurrency(results.cppContribution)}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: EI Premium:</span>
                <span className="font-mono">-{formatCurrency(results.eiPremium)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-1 mt-1">
                <span>Taxable Income:</span>
                <span className="font-mono">{formatCurrency(results.taxableIncome)}</span>
              </div>
            </div>
          </div>

          {/* Federal Tax */}
          <div>
            <h4 className="font-semibold mb-2 text-slate-700">Step 3: Federal Tax Calculation</h4>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold text-slate-600 mb-2">Tax by Bracket:</div>
              {federalCalc.steps.map((step, idx) => (
                <div key={idx} className="text-xs pl-2">
                  <div className="flex justify-between">
                    <span>{step.range} @ {step.rate.toFixed(2)}%:</span>
                    <span className="font-mono">{formatCurrency(step.tax)}</span>
                  </div>
                  <div className="text-slate-500 text-xs pl-2">
                    {formatCurrency(step.income)} × {step.rate.toFixed(2)}%
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total Federal Tax (before credits):</span>
                <span className="font-mono">{formatCurrency(federalCalc.totalTax)}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2 pl-2">
                <div>Federal Non-Refundable Credits @ 14.5%:</div>
                <div className="pl-2">
                  <div>• Basic Personal Amount: $16,129 × 14.5% = ${(16129 * 0.145).toFixed(2)}</div>
                  <div>• Canada Employment Amount: $1,433 × 14.5% = ${(1433 * 0.145).toFixed(2)}</div>
                  <div>• CPP Contribution: {formatCurrency(results.cppContribution)} × 14.5% = {formatCurrency(results.cppContribution * 0.145)}</div>
                  <div>• EI Premium: {formatCurrency(results.eiPremium)} × 14.5% = {formatCurrency(results.eiPremium * 0.145)}</div>
                </div>
                <div className="font-semibold mt-1">Total Credits: {formatCurrency((16129 + 1433) * 0.145 + (results.cppContribution + results.eiPremium) * 0.145)}</div>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2 text-blue-700">
                <span>Federal Tax Payable:</span>
                <span className="font-mono">{formatCurrency(results.federalTax)}</span>
              </div>
            </div>
          </div>

          {/* Provincial Tax */}
          <div>
            <h4 className="font-semibold mb-2 text-slate-700">Step 4: Provincial Tax Calculation ({results.provinceName})</h4>
            <div className="bg-slate-50 rounded-lg p-3 space-y-2">
              <div className="text-xs font-semibold text-slate-600 mb-2">Tax by Bracket:</div>
              {provincialCalc.steps.map((step, idx) => (
                <div key={idx} className="text-xs pl-2">
                  <div className="flex justify-between">
                    <span>{step.range} @ {step.rate.toFixed(2)}%:</span>
                    <span className="font-mono">{formatCurrency(step.tax)}</span>
                  </div>
                  <div className="text-slate-500 text-xs pl-2">
                    {formatCurrency(step.income)} × {step.rate.toFixed(2)}%
                  </div>
                </div>
              ))}
              <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                <span>Total Provincial Tax (before credits):</span>
                <span className="font-mono">{formatCurrency(provincialCalc.totalTax)}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2 pl-2">
                <div>Provincial Non-Refundable Credits @ 5.06% (lowest rate):</div>
                <div className="pl-2">
                  <div>• Basic Personal Amount: $12,936 × 5.06% = ${(12936 * 0.0506).toFixed(2)}</div>
                </div>
                <div className="font-semibold mt-1">Total Credits: {formatCurrency(12936 * 0.0506)}</div>
              </div>
              <div className="flex justify-between font-bold border-t pt-2 mt-2 text-teal-700">
                <span>Provincial Tax Payable:</span>
                <span className="font-mono">{formatCurrency(results.provincialTax)}</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-slate-900 text-white rounded-lg p-4">
            <h4 className="font-semibold mb-3">Final Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Gross Income:</span>
                <span className="font-mono">{formatCurrency(results.totalIncome)}</span>
              </div>
              <div className="flex justify-between text-red-300">
                <span>Federal Tax:</span>
                <span className="font-mono">-{formatCurrency(results.federalTax)}</span>
              </div>
              <div className="flex justify-between text-red-300">
                <span>Provincial Tax:</span>
                <span className="font-mono">-{formatCurrency(results.provincialTax)}</span>
              </div>
              <div className="flex justify-between text-red-300">
                <span>CPP:</span>
                <span className="font-mono">-{formatCurrency(results.cppContribution)}</span>
              </div>
              <div className="flex justify-between text-red-300">
                <span>EI:</span>
                <span className="font-mono">-{formatCurrency(results.eiPremium)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-slate-700 pt-2 mt-2 text-green-300">
                <span>Net Income:</span>
                <span className="font-mono">{formatCurrency(results.netIncome)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}