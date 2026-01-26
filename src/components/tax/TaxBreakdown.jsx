import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet, Building2, MapPin, PiggyBank, Receipt, ChevronDown, ChevronRight } from "lucide-react";

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

export default function TaxBreakdown({ results }) {
  const [deductionsOpen, setDeductionsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [federalCreditsOpen, setFederalCreditsOpen] = useState(false);
  const [provincialCreditsOpen, setProvincialCreditsOpen] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Tax Calculation Table */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-200">
          {/* Total Income */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900">Total Income</span>
            <span className="text-lg font-semibold text-slate-900">{formatCurrency(totalIncome)}</span>
          </div>

          {/* Deductions */}
          {totalDeductions > 0 && (
            <>
              <button
                onClick={() => setDeductionsOpen(!deductionsOpen)}
                className="w-full p-4 flex items-center justify-between bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {deductionsOpen ? <ChevronDown className="h-4 w-4 text-blue-700" /> : <ChevronRight className="h-4 w-4 text-blue-700" />}
                  <span className="text-sm font-semibold text-blue-800">Deductions</span>
                </div>
                <span className="text-lg font-semibold text-blue-700">-{formatCurrency(totalDeductions)}</span>
              </button>
              {deductionsOpen && deductionItems.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between pl-12 bg-blue-50/50">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <span className="text-base font-medium text-blue-700">-{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </>
          )}

          {/* Taxable Income */}
          <div className="p-4 flex items-center justify-between bg-blue-50">
            <span className="text-sm font-semibold text-blue-900">Taxable Income</span>
            <span className="text-lg font-bold text-blue-900">{formatCurrency(taxableIncome)}</span>
          </div>

          {/* Taxes & Contributions Section Header */}
          <div className="px-4 py-2 bg-slate-100">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Taxes & Contributions</span>
          </div>

          {/* Federal Tax */}
          <div className="p-4 flex items-center justify-between pl-8">
            <span className="text-sm text-slate-700">Federal Tax</span>
            <span className="text-base font-medium text-slate-900">{formatCurrency(federalTax)}</span>
          </div>

          {/* Provincial Tax */}
          <div className="p-4 flex items-center justify-between pl-8">
            <span className="text-sm text-slate-700">{provinceName} Tax</span>
            <span className="text-base font-medium text-slate-900">{formatCurrency(provincialTax)}</span>
          </div>

          {/* CPP */}
          {cpp && (cpp.employment > 0 || cpp.selfEmployment > 0) && (
            <>
              {cpp.employment > 0 && (
                <div className="p-4 flex items-center justify-between pl-8">
                  <span className="text-sm text-slate-700">CPP Contribution (Employment)</span>
                  <span className="text-base font-medium text-slate-900">{formatCurrency(cpp.employment)}</span>
                </div>
              )}
              {cpp.selfEmployment > 0 && (
                <div className="p-4 flex items-center justify-between pl-8">
                  <span className="text-sm text-slate-700">CPP Contribution (Self-Employment)</span>
                  <span className="text-base font-medium text-slate-900">{formatCurrency(cpp.selfEmployment)}</span>
                </div>
              )}
            </>
          )}

          {/* EI */}
          {ei && ei.premium > 0 && (
            <div className="p-4 flex items-center justify-between pl-8">
              <span className="text-sm text-slate-700">EI Premium</span>
              <span className="text-base font-medium text-slate-900">{formatCurrency(ei.premium)}</span>
            </div>
          )}

          {/* Credits */}
          {credits && ((credits.federal?.total || 0) + (credits.provincial?.total || 0)) > 0 && (
            <>
              <button
                onClick={() => setCreditsOpen(!creditsOpen)}
                className="w-full p-4 flex items-center justify-between bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {creditsOpen ? <ChevronDown className="h-4 w-4 text-green-700" /> : <ChevronRight className="h-4 w-4 text-green-700" />}
                  <span className="text-sm font-semibold text-green-800">Tax Credits</span>
                </div>
                <span className="text-lg font-semibold text-green-700">-{formatCurrency((credits.federal?.total || 0) + (credits.provincial?.total || 0))}</span>
              </button>

              {creditsOpen && (
                <>
                  {/* Federal Credits */}
                  {credits.federal?.items?.length > 0 && (
                    <>
                      <button
                        onClick={() => setFederalCreditsOpen(!federalCreditsOpen)}
                        className="w-full px-6 py-3 flex items-center justify-between bg-green-50/50 hover:bg-green-100/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {federalCreditsOpen ? <ChevronDown className="h-3.5 w-3.5 text-green-600" /> : <ChevronRight className="h-3.5 w-3.5 text-green-600" />}
                          <span className="text-sm font-medium text-green-700">Federal Credits</span>
                        </div>
                        <span className="text-base font-semibold text-green-700">-{formatCurrency(credits.federal.total)}</span>
                      </button>
                      {federalCreditsOpen && credits.federal.items.map((item, idx) => (
                        <div key={`fed-${idx}`} className="p-3 flex items-center justify-between pl-16 bg-green-50/30">
                          <span className="text-sm text-slate-700">{item.label}</span>
                          <span className="text-sm font-medium text-green-700">-{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Provincial Credits */}
                  {credits.provincial?.items?.length > 0 && (
                    <>
                      <button
                        onClick={() => setProvincialCreditsOpen(!provincialCreditsOpen)}
                        className="w-full px-6 py-3 flex items-center justify-between bg-green-50/50 hover:bg-green-100/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          {provincialCreditsOpen ? <ChevronDown className="h-3.5 w-3.5 text-green-600" /> : <ChevronRight className="h-3.5 w-3.5 text-green-600" />}
                          <span className="text-sm font-medium text-green-700">{provinceName} Credits</span>
                        </div>
                        <span className="text-base font-semibold text-green-700">-{formatCurrency(credits.provincial.total)}</span>
                      </button>
                      {provincialCreditsOpen && credits.provincial.items.map((item, idx) => (
                        <div key={`prov-${idx}`} className="p-3 flex items-center justify-between pl-16 bg-green-50/30">
                          <span className="text-sm text-slate-700">{item.label}</span>
                          <span className="text-sm font-medium text-green-700">-{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              )}
            </>
          )}

          {/* Net Income / Take-Home */}
          <div className="p-5 flex items-center justify-between bg-gradient-to-br from-[#1e3a5f] to-[#0f2744]">
            <div>
              <span className="text-sm text-white/70 block">Your Take-Home Pay</span>
              <span className="text-xs text-white/50">{formatCurrency(takeHome / 12)}/month</span>
            </div>
            <span className="text-3xl font-bold text-white">{formatCurrency(takeHome)}</span>
          </div>
        </div>
      </div>

      {/* Tax Rates Table */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-200/60">
          <span className="text-sm font-semibold text-slate-700">Tax Rates</span>
        </div>
        <div className="divide-y divide-slate-200">
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-900 block">Effective Rate</span>
              <span className="text-xs text-slate-500">Your average tax rate</span>
            </div>
            <span className="text-xl font-bold text-slate-900">{formatPercent(effectiveTaxRate)}</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-slate-900 block">Marginal Rate</span>
              <span className="text-xs text-slate-500">Tax on next dollar earned</span>
            </div>
            <span className="text-xl font-bold text-slate-900">{formatPercent(marginalRate)}</span>
          </div>
        </div>
      </div>

    </motion.div>
  );
}