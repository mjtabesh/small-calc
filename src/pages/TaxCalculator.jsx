import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Sparkles, RotateCcw, ChevronRight } from "lucide-react";
import SimpleCalculator from "@/components/tax/SimpleCalculator";
import AdvancedCalculator from "@/components/tax/AdvancedCalculator";
import TaxBreakdown from "@/components/tax/TaxBreakdown";
import { calculateTax } from "@/components/tax/taxCalculations";

const DEFAULT_DATA = {
  province: "ON",
  income: { employment: 0 },
  deductions: {},
  credits: {}
};

export default function TaxCalculatorPage() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [data, setData] = useState(DEFAULT_DATA);
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Auto-calculate when data changes
    if (data.province) {
      const newResults = calculateTax(data);
      setResults(newResults);
    }
  }, [data]);

  const handleReset = () => {
    setData(DEFAULT_DATA);
    setResults(null);
  };

  const handleModeChange = (checked) => {
    setIsAdvanced(checked);
    // Keep province but reset other values when switching modes
    setData({
      province: data.province,
      income: { employment: data.income?.employment || 0 },
      deductions: {},
      credits: {}
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#1e3a5f] to-[#0f2744] rounded-xl shadow-lg">
                <Calculator className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">Canada Tax Calculator</h1>
                <p className="text-xs text-slate-500">2025 Tax Year Estimate</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-700"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <div className="space-y-6">
            {/* Mode Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isAdvanced ? 'bg-purple-100' : 'bg-teal-100'
                  }`}>
                    {isAdvanced ? (
                      <Sparkles className="h-4 w-4 text-purple-600" />
                    ) : (
                      <Calculator className="h-4 w-4 text-teal-600" />
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-800">
                      {isAdvanced ? 'Advanced Mode' : 'Simple Mode'}
                    </Label>
                    <p className="text-xs text-slate-500">
                      {isAdvanced 
                        ? 'Full income, deductions & credits' 
                        : 'Quick employment income estimate'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isAdvanced}
                  onCheckedChange={handleModeChange}
                  className="data-[state=checked]:bg-purple-600"
                />
              </div>
            </motion.div>

            {/* Calculator Form */}
            <motion.div
              layout
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
            >
              <AnimatePresence mode="wait">
                {isAdvanced ? (
                  <AdvancedCalculator
                    key="advanced"
                    data={data}
                    onChange={setData}
                  />
                ) : (
                  <SimpleCalculator
                    key="simple"
                    data={data}
                    onChange={setData}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Results CTA */}
            <div className="lg:hidden">
              {results && results.totalIncome > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2744] rounded-2xl p-5 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Your Take-Home Pay</p>
                      <p className="text-2xl font-bold">
                        ${results.netIncome.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/50" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {results && results.totalIncome > 0 ? (
                <>
                  <TaxBreakdown results={results} />
                  <CalculationBreakdown results={results} province={data.province} income={data.income} />
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">
                    Enter Your Income
                  </h3>
                  <p className="text-sm text-slate-500">
                    Start by entering your income details to see your estimated tax breakdown.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100"
            >
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Disclaimer:</strong> This calculator provides estimates based on 2025 
                tax rates and brackets. Actual taxes may vary. This is not professional tax 
                advice. Consult a qualified tax professional for your specific situation.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} Canada Tax Calculator • 2025 Tax Year • For estimation purposes only
          </p>
        </div>
      </footer>
    </div>
  );
}