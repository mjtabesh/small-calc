import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ProvinceSelector from "./ProvinceSelector";
import IncomeInput from "./IncomeInput";
import {
  HelpCircle,
  Heart,
  PiggyBank,
  Accessibility,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";



const CollapsibleSection = ({ title, icon: Icon, isOpen, onToggle, children, hint }) => (
  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Icon className="h-4 w-4 text-slate-600" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-slate-900">{title}</p>
          {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
        </div>
      </div>
      {isOpen ? (
        <ChevronUp className="h-5 w-5 text-slate-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-slate-400" />
      )}
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="p-4 pt-0 space-y-4 border-t border-slate-100">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export default function AdvancedCalculator({ data, onChange }) {
  const [activeTab, setActiveTab] = useState("income");
  
  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    selfEmployment: false,
    investment: false,
    rental: false,
    otherIncome: false,
    savingGiving: false,
    familyHealthEducation: false,
    specialSituations: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleChange = (section, field, value) => {
    onChange({
      ...data,
      [section]: {
        ...data[section],
        [field]: value
      }
    });
  };

  const handleProvinceChange = (value) => {
    onChange({ ...data, province: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <ProvinceSelector
        value={data.province}
        onChange={handleProvinceChange}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="income" className="flex-1">Income</TabsTrigger>
          <TabsTrigger value="savings" className="flex-1">Tax Savings</TabsTrigger>
        </TabsList>


        <TabsContent value="income" className="mt-6 space-y-4">
          <IncomeInput
            id="employment"
            label="Employment Income"
            value={data.income?.employment}
            onChange={(value) => handleChange('income', 'employment', value)}
            hint="Salary, wages, and bonuses (T4)"
          />
          
          <IncomeInput
            id="self-employment"
            label="Self-Employment Income"
            value={data.income?.selfEmployment}
            onChange={(value) => handleChange('income', 'selfEmployment', value)}
            hint="Net business or professional income after expenses"
          />
          
          <IncomeInput
            id="investment"
            label="Investment Income"
            value={data.income?.investment}
            onChange={(value) => handleChange('income', 'investment', value)}
            hint="Interest, dividends, capital gains (taxable portion)"
          />
          
          <IncomeInput
            id="rental"
            label="Rental Income"
            value={data.income?.rental}
            onChange={(value) => handleChange('income', 'rental', value)}
            hint="Net rental income after expenses"
          />
          
          <IncomeInput
            id="rrsp-withdrawal"
            label="RRSP Withdrawals"
            value={data.income?.rrspWithdrawal}
            onChange={(value) => handleChange('income', 'rrspWithdrawal', value)}
            hint="Amount withdrawn from RRSP (T4RSP)"
          />
          
          <IncomeInput
            id="pension"
            label="Pension Income"
            value={data.income?.pension}
            onChange={(value) => handleChange('income', 'pension', value)}
            hint="CPP, OAS, employer pension"
          />
          
          <IncomeInput
            id="ei-income"
            label="EI Benefits"
            value={data.income?.eiIncome}
            onChange={(value) => handleChange('income', 'eiIncome', value)}
            hint="Employment Insurance benefits received (T4E)"
          />
          
          <IncomeInput
            id="other-income"
            label="Other Income"
            value={data.income?.other}
            onChange={(value) => handleChange('income', 'other', value)}
            hint="Scholarships, awards, prizes, etc."
          />
        </TabsContent>

        <TabsContent value="savings" className="mt-6 space-y-4">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-xs text-green-800">
                These items help reduce the amount of tax you pay. Only include amounts you're eligible to claim.
              </p>
            </div>
          </div>

          {/* Collapsible sections for savings */}
          <CollapsibleSection
            title="Saving & Giving"
            icon={PiggyBank}
            hint="RRSP contributions and charitable donations"
            isOpen={expandedSections.savingGiving || (data.deductions?.rrsp > 0) || (data.credits?.donations > 0)}
            onToggle={() => toggleSection('savingGiving')}
          >
            <IncomeInput
              id="rrsp"
              label="RRSP Contributions"
              value={data.deductions?.rrsp}
              onChange={(value) => handleChange('deductions', 'rrsp', value)}
              hint="Maximum 18% of previous year's income"
            />
            <IncomeInput
              id="donations"
              label="Charitable Donations"
              value={data.credits?.donations}
              onChange={(value) => handleChange('credits', 'donations', value)}
              hint="Total amount donated to registered charities"
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Family, Health & Education"
            icon={Heart}
            hint="Childcare, medical expenses, and tuition fees"
            isOpen={expandedSections.familyHealthEducation || (data.deductions?.childcare > 0) || (data.credits?.medicalExpenses > 0) || (data.credits?.tuition > 0)}
            onToggle={() => toggleSection('familyHealthEducation')}
          >
            <IncomeInput
              id="childcare"
              label="Childcare Expenses"
              value={data.deductions?.childcare}
              onChange={(value) => handleChange('deductions', 'childcare', value)}
              hint="Daycare, summer camps, nannies, babysitters"
            />
            <IncomeInput
              id="medical"
              label="Medical Expenses"
              value={data.credits?.medicalExpenses}
              onChange={(value) => handleChange('credits', 'medicalExpenses', value)}
              hint="Total medical expenses (must exceed 3% of net income)"
            />
            <IncomeInput
              id="tuition"
              label="Tuition Fees"
              value={data.credits?.tuition}
              onChange={(value) => handleChange('credits', 'tuition', value)}
              hint="Post-secondary tuition (T2202 slip)"
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Special Situations"
            icon={Accessibility}
            hint="Less common credits that apply in specific cases"
            isOpen={expandedSections.specialSituations || (data.credits?.spouseAmount) || (data.credits?.disability) || (data.credits?.age65Plus) || (data.deductions?.unionDues > 0) || (data.deductions?.supportPayments > 0) || (data.deductions?.movingExpenses > 0) || (data.deductions?.other > 0)}
            onToggle={() => toggleSection('specialSituations')}
          >
            <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="spouse-amount-checkbox"
                  checked={data.credits?.spouseAmount || false}
                  onCheckedChange={(checked) => {
                    onChange({
                      ...data,
                      credits: {
                        ...data.credits,
                        spouseAmount: checked,
                        spouseNetIncome: checked ? (data.credits?.spouseNetIncome || 0) : 0
                      }
                    });
                  }}
                />
                <Label htmlFor="spouse-amount-checkbox" className="text-sm cursor-pointer">
                  I have a spouse or common-law partner
                </Label>
              </div>

              {data.credits?.spouseAmount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-7"
                >
                  <IncomeInput
                    id="spouse-net-income"
                    label="What is their net income?"
                    value={data.credits?.spouseNetIncome}
                    onChange={(value) => handleChange('credits', 'spouseNetIncome', value)}
                    hint="Their total income after deductions"
                  />
                </motion.div>
              )}
            </div>

            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Checkbox
                id="disability"
                checked={data.credits?.disability}
                onCheckedChange={(checked) => handleChange('credits', 'disability', checked)}
              />
              <Label htmlFor="disability" className="text-sm cursor-pointer">
                I have an approved disability tax credit certificate
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Checkbox
                id="age-credit"
                checked={data.credits?.age65Plus}
                onCheckedChange={(checked) => handleChange('credits', 'age65Plus', checked)}
              />
              <Label htmlFor="age-credit" className="text-sm cursor-pointer flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                I am 65 years or older
              </Label>
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4 space-y-4">
              <IncomeInput
                id="union-dues"
                label="Union & Professional Dues"
                value={data.deductions?.unionDues}
                onChange={(value) => handleChange('deductions', 'unionDues', value)}
                hint="Annual dues paid to unions or professional associations"
              />
              <IncomeInput
                id="support-payments"
                label="Support Payments"
                value={data.deductions?.supportPayments}
                onChange={(value) => handleChange('deductions', 'supportPayments', value)}
                hint="Child or spousal support (if deductible under your agreement)"
              />
              <IncomeInput
                id="moving"
                label="Moving Expenses"
                value={data.deductions?.movingExpenses}
                onChange={(value) => handleChange('deductions', 'movingExpenses', value)}
                hint="If you moved at least 40 km closer to work or school"
              />
              <IncomeInput
                id="other-deductions"
                label="Other Deductions"
                value={data.deductions?.other}
                onChange={(value) => handleChange('deductions', 'other', value)}
                hint="Carrying charges, investment counsel fees, etc."
              />
            </div>
          </CollapsibleSection>
        </TabsContent>

      </Tabs>
    </motion.div>
  );
}