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
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-4 border border-teal-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <Briefcase className="h-4 w-4 text-teal-700" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-teal-900">Quick Estimate</h3>
            <p className="text-xs text-teal-700 mt-0.5">
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