import { motion } from "framer-motion";
import ProvinceSelector from "./ProvinceSelector";
import IncomeInput from "./IncomeInput";
import { Briefcase } from "lucide-react";

export default function SimpleCalculator({ data, onChange }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-xl p-4 border border-slate-200/60 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-100/60 rounded-lg">
            <Briefcase className="h-4 w-4 text-slate-700" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-slate-900">Quick Estimate</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Enter your employment income and province for a quick tax estimate.
            </p>
          </div>
        </div>
      </div>

      <ProvinceSelector
        value={data.province}
        onChange={(value) => handleChange('province', value)}
      />

      <IncomeInput
        id="employment-income"
        label="Annual Employment Income"
        value={data.income?.employment}
        onChange={(value) => handleChange('income', { ...data.income, employment: value })}
        hint="Your total T4 income before deductions"
      />
    </motion.div>
  );
}