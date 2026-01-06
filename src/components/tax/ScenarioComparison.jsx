import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { calculateTax } from "./taxCalculations";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function ScenarioComparison({ scenarios }) {
  const results = scenarios.map(s => ({
    name: s.name,
    ...calculateTax(s)
  }));

  // Chart data
  const chartData = results.map(r => ({
    name: r.name,
    "Take-Home": r.takeHome,
    "Federal Tax": r.federalTax,
    "Provincial Tax": r.provincialTax,
    "CPP/EI": (r.cpp?.employment || 0) + (r.cpp?.selfEmployment || 0) + (r.ei?.premium || 0)
  }));

  // Find best scenario (highest take-home)
  const bestScenario = results.reduce((best, current) => 
    current.takeHome > best.takeHome ? current : best
  );

  // Calculate differences from first scenario
  const baseScenario = results[0];
  const comparisons = results.slice(1).map(r => ({
    name: r.name,
    takeHomeDiff: r.takeHome - baseScenario.takeHome,
    taxDiff: r.totalTax - baseScenario.totalTax,
    effectiveRateDiff: r.effectiveTaxRate - baseScenario.effectiveTaxRate
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-900">Scenario Comparison</h2>
      </div>

      {/* Best Scenario Highlight */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-base text-green-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Best Scenario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-900">{bestScenario.name}</div>
              <div className="text-sm text-green-700 mt-1">
                Maximizes your take-home pay
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-900">
                {formatCurrency(bestScenario.takeHome)}
              </div>
              <div className="text-sm text-green-700">
                {formatCurrency(bestScenario.takeHome / 12)}/month
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {comparisons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparison vs. {baseScenario.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comparisons.map((comp) => (
                <div key={comp.name} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                  <div className="font-medium text-slate-900 mb-3">{comp.name}</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Take-Home Difference</div>
                      <div className={`text-base font-semibold flex items-center gap-1 ${
                        comp.takeHomeDiff > 0 ? 'text-green-600' : comp.takeHomeDiff < 0 ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {comp.takeHomeDiff > 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : comp.takeHomeDiff < 0 ? (
                          <TrendingDown className="h-4 w-4" />
                        ) : null}
                        {comp.takeHomeDiff > 0 ? '+' : ''}{formatCurrency(comp.takeHomeDiff)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Tax Difference</div>
                      <div className={`text-base font-semibold ${
                        comp.taxDiff < 0 ? 'text-green-600' : comp.taxDiff > 0 ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {comp.taxDiff > 0 ? '+' : ''}{formatCurrency(comp.taxDiff)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Effective Rate</div>
                      <div className={`text-base font-semibold ${
                        comp.effectiveRateDiff < 0 ? 'text-green-600' : comp.effectiveRateDiff > 0 ? 'text-red-600' : 'text-slate-600'
                      }`}>
                        {comp.effectiveRateDiff > 0 ? '+' : ''}{comp.effectiveRateDiff.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visual Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Take-Home & Tax Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="Take-Home" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Federal Tax" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Provincial Tax" fill="#f97316" radius={[4, 4, 0, 0]} />
              <Bar dataKey="CPP/EI" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <CardHeader>
          <CardTitle className="text-base text-indigo-900 flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-indigo-800">
            {comparisons.length > 0 && comparisons.some(c => c.takeHomeDiff > 0) && (
              <div className="flex items-start gap-2">
                <TrendingUp className="h-4 w-4 mt-0.5 text-green-600" />
                <span>
                  Consider the scenarios with positive take-home differences to maximize your after-tax income.
                </span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 text-indigo-600" />
              <span>
                RRSP contributions reduce your taxable income and can significantly lower your tax bill.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <ArrowRight className="h-4 w-4 mt-0.5 text-indigo-600" />
              <span>
                Charitable donations provide tax credits that directly reduce your taxes payable.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}