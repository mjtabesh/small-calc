import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calculator, Plus, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ScenarioCard from "@/components/tax/ScenarioCard";
import ScenarioComparison from "@/components/tax/ScenarioComparison";

const DEFAULT_SCENARIO = {
  name: "Current Situation",
  province: "ON",
  income: { employment: 0 },
  deductions: {},
  credits: {}
};

export default function TaxPlanningPage() {
  const [scenarios, setScenarios] = useState([{ ...DEFAULT_SCENARIO, id: 1 }]);
  const [nextId, setNextId] = useState(2);

  const addScenario = () => {
    const lastScenario = scenarios[scenarios.length - 1];
    setScenarios([
      ...scenarios,
      {
        ...lastScenario,
        name: `Scenario ${scenarios.length + 1}`,
        id: nextId
      }
    ]);
    setNextId(nextId + 1);
  };

  const updateScenario = (id, updates) => {
    setScenarios(scenarios.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeScenario = (id) => {
    if (scenarios.length > 1) {
      setScenarios(scenarios.filter(s => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("TaxCalculator")}>
                <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Calculator
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">Tax Planning</h1>
                  <p className="text-xs text-slate-500">Compare scenarios & optimize your taxes</p>
                </div>
              </div>
            </div>
            <Button
              onClick={addScenario}
              className="bg-indigo-600 hover:bg-indigo-700"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Scenario
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Calculator className="h-5 w-5 text-indigo-700" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-indigo-900 mb-1">
                What-If Analysis
              </h2>
              <p className="text-sm text-indigo-700 leading-relaxed">
                Create multiple scenarios to compare the tax impact of different financial decisions. 
                Adjust RRSP contributions, donations, income levels, and more to see how they affect 
                your take-home pay.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Scenarios Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <AnimatePresence mode="popLayout">
            {scenarios.map((scenario) => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                canRemove={scenarios.length > 1}
                onUpdate={(updates) => updateScenario(scenario.id, updates)}
                onRemove={() => removeScenario(scenario.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Comparison Section */}
        {scenarios.length > 1 && (
          <ScenarioComparison scenarios={scenarios} />
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-100"
        >
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> This tax planning tool provides estimates for comparison 
            purposes only. Actual tax outcomes may vary based on your specific situation. Consult 
            a qualified tax professional before making financial decisions.
          </p>
        </motion.div>
      </main>
    </div>
  );
}