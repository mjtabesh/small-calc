import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet, Building2, MapPin, PiggyBank, Receipt } from "lucide-react";
import TaxCharts from "./TaxCharts";

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
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="divide-y divide-slate-200">
          {/* Total Income */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-900">Total Income</span>
            <span className="text-lg font-semibold text-slate-900">{formatCurrency(totalIncome)}</span>
          </div>

          {/* Deductions */}
          {totalDeductions > 0 && (
            <>
              <div className="px-4 py-2 bg-slate-100">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Deductions</span>
              </div>
              {deductionItems.map((item, idx) => (
                <div key={idx} className="p-4 flex items-center justify-between pl-8">
                  <span className="text-sm text-slate-700">{item.label}</span>
                  <span className="text-base font-medium text-red-600">-{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="p-4 flex items-center justify-between bg-slate-50">
                <span className="text-sm font-semibold text-slate-700">Total Deductions</span>
                <span className="text-lg font-semibold text-red-600">-{formatCurrency(totalDeductions)}</span>
              </div>
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
              <div className="px-4 py-2 bg-green-100">
                <span className="text-xs font-semibold text-green-800 uppercase tracking-wider">Tax Credits</span>
              </div>

              {/* Federal Credits */}
              {credits.federal?.items?.length > 0 && (
                <>
                  <div className="px-6 py-2 bg-green-50">
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">Federal</span>
                  </div>
                  {credits.federal.items.map((item, idx) => (
                    <div key={`fed-${idx}`} className="p-4 flex items-center justify-between pl-10">
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <span className="text-base font-medium text-green-700">-{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </>
              )}

              {/* Provincial Credits */}
              {credits.provincial?.items?.length > 0 && (
                <>
                  <div className="px-6 py-2 bg-green-50">
                    <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">{provinceName}</span>
                  </div>
                  {credits.provincial.items.map((item, idx) => (
                    <div key={`prov-${idx}`} className="p-4 flex items-center justify-between pl-10">
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <span className="text-base font-medium text-green-700">-{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </>
              )}

              <div className="p-4 flex items-center justify-between bg-green-50">
                <span className="text-sm font-semibold text-green-800">Total Tax Credits</span>
                <span className="text-lg font-semibold text-green-700">-{formatCurrency((credits.federal?.total || 0) + (credits.provincial?.total || 0))}</span>
              </div>
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
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
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

      {/* Interactive Charts */}
      <TaxCharts results={results} />

    </motion.div>
  );
}