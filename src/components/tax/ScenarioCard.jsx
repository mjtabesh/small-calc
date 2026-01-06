import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import ProvinceSelector from "./ProvinceSelector";
import IncomeInput from "./IncomeInput";
import { calculateTax } from "./taxCalculations";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function ScenarioCard({ scenario, canRemove, onUpdate, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleChange = (section, field, value) => {
    onUpdate({
      [section]: {
        ...scenario[section],
        [field]: value
      }
    });
  };

  const results = calculateTax(scenario);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Input
              value={scenario.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
              className="text-base font-semibold border-none px-0 focus-visible:ring-0"
            />
            {canRemove && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-8 w-8 text-slate-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Results Summary */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
              <div className="text-xs text-green-700 mb-1">Take-Home Pay</div>
              <div className="text-lg font-bold text-green-900">
                {formatCurrency(results.takeHome)}
              </div>
              <div className="text-xs text-green-600 mt-0.5">
                {formatCurrency(results.takeHome / 12)}/month
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-3 border border-red-100">
              <div className="text-xs text-red-700 mb-1">Total Tax</div>
              <div className="text-lg font-bold text-red-900">
                {formatCurrency(results.totalTax)}
              </div>
              <div className="text-xs text-red-600 mt-0.5">
                {results.effectiveTaxRate.toFixed(1)}% effective rate
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between text-sm text-slate-600 hover:text-slate-900 mb-3"
              >
                <span>{isExpanded ? "Hide" : "Show"} Details</span>
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-4">
              <ProvinceSelector
                value={scenario.province}
                onChange={(value) => onUpdate({ province: value })}
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Key Income & Adjustments
                </Label>
                
                <IncomeInput
                  id={`employment-${scenario.id}`}
                  label="Employment Income"
                  value={scenario.income?.employment}
                  onChange={(value) => handleChange('income', 'employment', value)}
                />
                
                <IncomeInput
                  id={`rrsp-${scenario.id}`}
                  label="RRSP Contributions"
                  value={scenario.deductions?.rrsp}
                  onChange={(value) => handleChange('deductions', 'rrsp', value)}
                />
                
                <IncomeInput
                  id={`donations-${scenario.id}`}
                  label="Charitable Donations"
                  value={scenario.credits?.donations}
                  onChange={(value) => handleChange('credits', 'donations', value)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
}