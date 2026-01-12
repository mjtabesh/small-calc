import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2
  }).format(amount);
};

const formatPercent = (value) => {
  return `${value.toFixed(1)}%`;
};

const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-slate-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-medium text-slate-700">{title}</span>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TaxBreakdown({ results }) {
  if (!results) return null;

  const {
    province,
    totalIncome,
    totalDeductions,
    deductionItems,
    taxableIncome,
    federalTax,
    provincialTax,
    totalTax,
    cpp,
    ei,
    takeHome,
    effectiveTaxRate,
    marginalRate,
    credits
  } = results;

  // Get province name from PROVINCES list
  const PROVINCES = [
    { code: 'AB', name: 'Alberta' },
    { code: 'BC', name: 'British Columbia' },
    { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' },
    { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' },
    { code: 'ON', name: 'Ontario' },
    { code: 'PE', name: 'Prince Edward Island' },
    { code: 'SK', name: 'Saskatchewan' },
    { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' },
    { code: 'YT', name: 'Yukon' }
  ];
  const provinceName = PROVINCES.find(p => p.code === province)?.name || province;

  const totalTaxAndContributions = totalTax + (cpp?.employment || 0) + (cpp?.selfEmployment || 0) + (ei?.premium || 0);
  const totalCredits = (credits?.federal?.total || 0) + (credits?.provincial?.total || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-900">Total Income</span>
          <span className="text-lg font-semibold text-slate-900">{formatCurrency(totalIncome)}</span>
        </div>

        {totalDeductions > 0 && (
          <div className="p-4 flex items-center justify-between border-t border-slate-200">
            <span className="text-sm font-medium text-slate-900">Total Deductions</span>
            <span className="text-lg font-semibold text-red-600">-{formatCurrency(totalDeductions)}</span>
          </div>
        )}

        <div className="p-4 flex items-center justify-between bg-blue-50 border-t border-slate-200">
          <span className="text-sm font-semibold text-blue-900">Taxable Income</span>
          <span className="text-lg font-bold text-blue-900">{formatCurrency(taxableIncome)}</span>
        </div>

        <div className="p-4 flex items-center justify-between border-t border-slate-200">
          <span className="text-sm font-medium text-slate-900">Total Taxes & Contributions</span>
          <span className="text-lg font-semibold text-slate-900">{formatCurrency(totalTaxAndContributions)}</span>
        </div>

        {totalCredits > 0 && (
          <div className="p-4 flex items-center justify-between border-t border-slate-200">
            <span className="text-sm font-medium text-slate-900">Total Tax Credits</span>
            <span className="text-lg font-semibold text-green-600">-{formatCurrency(totalCredits)}</span>
          </div>
        )}

        <div className="p-5 flex items-center justify-between bg-gradient-to-br from-[#1e3a5f] to-[#0f2744] border-t border-slate-200">
          <div>
            <span className="text-sm text-white/70 block">Your Take-Home Pay</span>
            <span className="text-xs text-white/50">{formatCurrency(takeHome / 12)}/month</span>
          </div>
          <span className="text-3xl font-bold text-white">{formatCurrency(takeHome)}</span>
        </div>

        {/* Accordions for details */}
        {totalDeductions > 0 && (
          <AccordionSection title={`Deduction Details (${deductionItems.length})`}>
            {deductionItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-700">{item.label}</span>
                <span className="text-sm font-medium text-red-600">-{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </AccordionSection>
        )}

        <AccordionSection title="Tax & Contribution Breakdown">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-700">Federal Tax</span>
            <span className="text-sm font-medium text-slate-900">{formatCurrency(federalTax)}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-700">{provinceName} Tax</span>
            <span className="text-sm font-medium text-slate-900">{formatCurrency(provincialTax)}</span>
          </div>
          {cpp?.employment > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">CPP (Employment)</span>
              <span className="text-sm font-medium text-slate-900">{formatCurrency(cpp.employment)}</span>
            </div>
          )}
          {cpp?.selfEmployment > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">CPP (Self-Employment)</span>
              <span className="text-sm font-medium text-slate-900">{formatCurrency(cpp.selfEmployment)}</span>
            </div>
          )}
          {ei?.premium > 0 && (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">EI Premium</span>
              <span className="text-sm font-medium text-slate-900">{formatCurrency(ei.premium)}</span>
            </div>
          )}
        </AccordionSection>

        {totalCredits > 0 && (
          <AccordionSection title="Tax Credit Details">
            {credits?.federal?.items?.length > 0 && (
              <>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Federal</div>
                {credits.federal.items.map((item, idx) => (
                  <div key={`fed-${idx}`} className="flex items-center justify-between py-2 pl-3">
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <span className="text-sm font-medium text-green-600">-{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </>
            )}
            {credits?.provincial?.items?.length > 0 && (
              <>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-3">{provinceName}</div>
                {credits.provincial.items.map((item, idx) => (
                  <div key={`prov-${idx}`} className="flex items-center justify-between py-2 pl-3">
                    <span className="text-sm text-slate-700">{item.label}</span>
                    <span className="text-sm font-medium text-green-600">-{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </>
            )}
          </AccordionSection>
        )}

        <AccordionSection title="Tax Rates" defaultOpen>
          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-sm font-medium text-slate-900 block">Effective Rate</span>
              <span className="text-xs text-slate-500">Your average tax rate</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{formatPercent(effectiveTaxRate)}</span>
          </div>
          <div className="flex items-center justify-between py-2 pt-3">
            <div>
              <span className="text-sm font-medium text-slate-900 block">Marginal Rate</span>
              <span className="text-xs text-slate-500">Tax on next dollar earned</span>
            </div>
            <span className="text-lg font-bold text-slate-900">{formatPercent(marginalRate)}</span>
          </div>
        </AccordionSection>
      </div>
    </motion.div>
  );
}