import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import ProvinceSelector from "./ProvinceSelector";
import IncomeInput from "./IncomeInput";
import {
  Wallet,
  Receipt,
  Gift,
  Briefcase,
  TrendingUp,
  Home,
  Banknote,
  HelpCircle,
  PiggyBank,
  Users,
  Baby,
  Truck,
  Heart,
  GraduationCap,
  HeartHandshake,
  Accessibility,
  Calendar
} from "lucide-react";

const TabButton = ({ value, icon: Icon, label, isActive }) => (
  <TabsTrigger
    value={value}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${isActive
      ? 'bg-[#1e3a5f] text-white shadow-lg'
      : 'bg-white text-slate-600 hover:bg-slate-50'
      }`}
  >
    <Icon className="h-4 w-4" />
    <span className="font-medium">{label}</span>
  </TabsTrigger>
);

export default function AdvancedCalculator({ data, onChange }) {
  const [activeTab, setActiveTab] = useState("income");

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
        <TabsList className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-xl h-auto">
          <TabButton value="income" icon={Wallet} label="Income" isActive={activeTab === "income"} />
          <TabButton value="deductions" icon={Receipt} label="Deductions" isActive={activeTab === "deductions"} />
          <TabButton value="credits" icon={Gift} label="Credits" isActive={activeTab === "credits"} />
        </TabsList>


        <TabsContent value="income" className="mt-6 space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <Briefcase className="h-4 w-4" />
              <span className="font-medium">Employment & Self-Employment</span>
            </div>
            <IncomeInput
              id="employment"
              label="Employment Income (T4)"
              value={data.income?.employment}
              onChange={(value) => handleChange('income', 'employment', value)}
              hint="Salary, wages, bonuses, tips"
            />
            <IncomeInput
              id="self-employment"
              label="Self-Employment Income"
              value={data.income?.selfEmployment}
              onChange={(value) => handleChange('income', 'selfEmployment', value)}
              hint="Net business or professional income"
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">Investment & Property</span>
            </div>
            <div className="grid gap-4">
              <IncomeInput
                id="investment"
                label="Investment Income"
                value={data.income?.investment}
                onChange={(value) => handleChange('income', 'investment', value)}
                hint="Interest, dividends, capital gains"
              />
              <IncomeInput
                id="rental"
                label="Rental Income"
                value={data.income?.rental}
                onChange={(value) => handleChange('income', 'rental', value)}
                hint="Net rental income after expenses"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Banknote className="h-4 w-4" />
              <span className="font-medium">Other Income</span>
            </div>
            <div className="grid gap-4">
              <IncomeInput
                id="rrsp-withdrawal"
                label="RRSP Withdrawals"
                value={data.income?.rrspWithdrawal}
                onChange={(value) => handleChange('income', 'rrspWithdrawal', value)}
                hint="T4RSP income"
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
                hint="Employment Insurance benefits (T4E)"
              />
              <IncomeInput
                id="other-income"
                label="Other Income"
                value={data.income?.other}
                onChange={(value) => handleChange('income', 'other', value)}
                hint="Scholarships, prizes, etc."
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deductions" className="mt-6 space-y-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-4 w-4 text-blue-600 mt-0.5" />
              <p className="text-xs text-blue-800">
                Deductions reduce your taxable income before tax is calculated.
                Enter only the amounts you're eligible to claim.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <PiggyBank className="h-4 w-4" />
              <span className="font-medium">Retirement Savings</span>
            </div>
            <IncomeInput
              id="rrsp"
              label="RRSP Contributions"
              value={data.deductions?.rrsp}
              onChange={(value) => handleChange('deductions', 'rrsp', value)}
              hint="Maximum 18% of previous year income"
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Users className="h-4 w-4" />
              <span className="font-medium">Employment Deductions</span>
            </div>
            <IncomeInput
              id="union-dues"
              label="Union & Professional Dues"
              value={data.deductions?.unionDues}
              onChange={(value) => handleChange('deductions', 'unionDues', value)}
              hint="Annual union, professional, or similar dues (Line 21200)"
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Baby className="h-4 w-4" />
              <span className="font-medium">Family Deductions</span>
            </div>
            <div className="grid gap-4">
              <IncomeInput
                id="childcare"
                label="Childcare Expenses"
                value={data.deductions?.childcare}
                onChange={(value) => handleChange('deductions', 'childcare', value)}
                hint="Daycare, camps, nannies"
              />
              <IncomeInput
                id="support-payments"
                label="Support Payments Made"
                value={data.deductions?.supportPayments}
                onChange={(value) => handleChange('deductions', 'supportPayments', value)}
                hint="Child/spousal support (if deductible)"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Truck className="h-4 w-4" />
              <span className="font-medium">Other Deductions</span>
            </div>
            <div className="grid gap-4">
              <IncomeInput
                id="moving"
                label="Moving Expenses"
                value={data.deductions?.movingExpenses}
                onChange={(value) => handleChange('deductions', 'movingExpenses', value)}
                hint="If moved 40+ km closer to work/school"
              />
              <IncomeInput
                id="other-deductions"
                label="Other Deductions"
                value={data.deductions?.other}
                onChange={(value) => handleChange('deductions', 'other', value)}
                hint="Carrying charges, list expenses, etc."
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="credits" className="mt-6 space-y-4">
          <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-4 w-4 text-green-600 mt-0.5" />
              <p className="text-xs text-green-800">
                Tax credits directly reduce your tax payable. The basic personal amount is
                automatically applied unless you uncheck it below.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
              <Heart className="h-4 w-4" />
              <span className="font-medium">Personal Credits</span>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
              <Checkbox
                id="basic-personal"
                checked={!data.credits?.disableBasicPersonal}
                onCheckedChange={(checked) => handleChange('credits', 'disableBasicPersonal', !checked)}
              />
              <Label htmlFor="basic-personal" className="text-sm cursor-pointer">
                Claim Basic Personal Amount
              </Label>
            </div>

            <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="spouse-amount-checkbox"
                  checked={data.credits?.spouseAmount || false}
                  onCheckedChange={(checked) => {
                    // When unchecked, we must clear the income so the calculation knows to stop
                    const updates = {
                      spouseAmount: checked,
                      spouseNetIncome: checked ? (data.credits?.spouseNetIncome || 0) : 0
                    };

                    // We need to update multiple fields in credits, so we use a custom update pattern
                    // Since handleChange only takes one field, we'll need to manually compose the update
                    // or just call handleChange for each (but state updates might batch or conflict).
                    // Better to expose a way to update multiple, OR just sequentially call.
                    // Given the verified handleChange implementation:
                    // const handleChange = (section, field, value) => { onChange({ ...data, [section]: { ...data[section], [field]: value } }); };
                    // We can't easily do atomic multi-update without modifying parent.
                    // Let's just update 'spouseAmount' here, and let the user see the input disappear.
                    // But the user requested "Unchecking that box should clear the spouse/partner net income field completely."
                    // So correct approach: Update both. I will update the parent component to handle this object merge or just chain it.

                    // Actually, I can just cheat by calling onChange directly if I have access to full data object (which I do).
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
                <Label htmlFor="spouse-amount-checkbox" className="text-sm cursor-pointer font-medium text-slate-700">
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
                    label="Spouse/Partner Net Income"
                    value={data.credits?.spouseNetIncome}
                    onChange={(value) => handleChange('credits', 'spouseNetIncome', value)}
                    hint="Enter spouse's net income (used to reduce spouse amount credit)"
                  />
                </motion.div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <HeartHandshake className="h-4 w-4" />
              <span className="font-medium">Charitable & Medical</span>
            </div>
            <div className="grid gap-4">
              <IncomeInput
                id="donations"
                label="Charitable Donations"
                value={data.credits?.donations}
                onChange={(value) => handleChange('credits', 'donations', value)}
                hint="Eligible donations with receipts"
              />
              <IncomeInput
                id="medical"
                label="Medical Expenses"
                value={data.credits?.medicalExpenses}
                onChange={(value) => handleChange('credits', 'medicalExpenses', value)}
                hint="Expenses exceeding 3% of net income"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <GraduationCap className="h-4 w-4" />
              <span className="font-medium">Education</span>
            </div>
            <IncomeInput
              id="tuition"
              label="Tuition Fees"
              value={data.credits?.tuition}
              onChange={(value) => handleChange('credits', 'tuition', value)}
              hint="Post-secondary tuition (T2202)"
            />
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
              <Accessibility className="h-4 w-4" />
              <span className="font-medium">Special Credits</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                <Checkbox
                  id="disability"
                  checked={data.credits?.disability}
                  onCheckedChange={(checked) => handleChange('credits', 'disability', checked)}
                />
                <Label htmlFor="disability" className="text-sm cursor-pointer">
                  Disability Tax Credit (DTC)
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                <Checkbox
                  id="age-credit"
                  checked={data.credits?.age65Plus}
                  onCheckedChange={(checked) => handleChange('credits', 'age65Plus', checked)}
                />
                <Label htmlFor="age-credit" className="text-sm cursor-pointer flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  Age 65 or Older Credit
                </Label>
              </div>
            </div>
          </div>
        </TabsContent>

      </Tabs>
    </motion.div>
  );
}