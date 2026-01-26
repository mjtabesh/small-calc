import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calculator, Sparkles, RotateCcw, ChevronRight } from "lucide-react";
import SimpleCalculator from "@/components/tax/SimpleCalculator";
import AdvancedCalculator from "@/components/tax/AdvancedCalculator";
import TaxBreakdown from "@/components/tax/TaxBreakdown";
import TaxGuide from "@/components/tax/TaxGuide";
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
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
              2025 Canada Tax Calculator
            </h1>
            <p className="text-lg text-slate-600">
              Estimate your federal and provincial income tax with precision
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Section */}
          <div className="space-y-6">
            {/* Mode Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-2">

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleModeChange(false)}
                  className={`relative p-4 rounded-xl transition-all text-left ${!isAdvanced ?
                    'bg-slate-900 text-white shadow-md' :
                    'text-slate-700 hover:bg-white/50'}`
                  }>

                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${!isAdvanced ? 'bg-white/10' : 'bg-slate-100/60'}`
                    }>
                      <Calculator className={`h-4 w-4 ${!isAdvanced ? 'text-white' : 'text-slate-400'}`
                      } />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold mb-1`}>
                        Simple
                      </div>
                      <p className={`text-xs leading-relaxed ${!isAdvanced ? 'text-white/70' : 'text-slate-500'}`}>
                        Quick estimate
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleModeChange(true)}
                  className={`relative p-4 rounded-xl transition-all text-left ${isAdvanced ?
                    'bg-slate-900 text-white shadow-md' :
                    'text-slate-700 hover:bg-white/50'}`
                  }>

                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isAdvanced ? 'bg-white/10' : 'bg-slate-100/60'}`
                    }>
                      <Sparkles className={`h-4 w-4 ${isAdvanced ? 'text-white' : 'text-slate-400'}`
                      } />
                    </div>
                    <div>
                      <div className={`text-sm font-semibold mb-1`}>
                        Advanced
                      </div>
                      <p className={`text-xs leading-relaxed ${isAdvanced ? 'text-white/70' : 'text-slate-500'}`}>
                        Full details
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* Calculator Form */}
            <motion.div
              layout
              className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/60 p-8">

              <AnimatePresence mode="wait">
                {isAdvanced ?
                  <AdvancedCalculator
                    key="advanced"
                    data={data}
                    onChange={setData} /> :


                  <SimpleCalculator
                    key="simple"
                    data={data}
                    onChange={setData} />

                }
              </AnimatePresence>
            </motion.div>

            {/* Mobile Results CTA */}
            <div className="lg:hidden">
              {results && results.totalIncome > 0 &&
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/70 text-sm">Your Take-Home Pay</p>
                      <p className="text-2xl font-bold">
                        ${results.takeHome.toLocaleString('en-CA', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-white/50" />
                  </div>
                </motion.div>
              }
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AnimatePresence mode="wait">
              {results && results.totalIncome > 0 ?
                <TaxBreakdown results={results} /> :

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/40 backdrop-blur-sm rounded-2xl p-10 text-center border border-slate-200/60">

                  <div className="w-16 h-16 bg-slate-100/60 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calculator className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Enter Your Income
                  </h3>
                  <p className="text-sm text-slate-600">
                    Start by entering your income details to see your estimated tax breakdown.
                  </p>
                </motion.div>
              }
            </AnimatePresence>

            {/* Disclaimer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-5 bg-slate-50/60 backdrop-blur-sm rounded-xl border border-slate-200/60">

              <p className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900">Disclaimer:</strong> This calculator provides estimates based on 2025
                tax rates and brackets. Actual taxes may vary. This is not professional tax
                advice. Consult a qualified tax professional for your specific situation.
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Comprehensive Tax Guide */}
      <section className="border-t border-slate-200/60 bg-white/60 backdrop-blur-sm">
        <TaxGuide province={data.province} />
      </section>
    </div>);

}