import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet, Building2, MapPin, PiggyBank, Receipt, ChevronDown, ChevronRight, Info } from "lucide-react";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0
  }).format(amount);
};

const formatPercent = (value) => {
  return `${value.toFixed(1)}%`;
};

export default function TaxBreakdown({ results }) {
  const [showDetails, setShowDetails] = useState(false);
  const [taxesOpen, setTaxesOpen] = useState(false);
  const [contributionsOpen, setContributionsOpen] = useState(false);
  const [deductionsOpen, setDeductionsOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [federalCreditsOpen, setFederalCreditsOpen] = useState(false);
  const [provincialCreditsOpen, setProvincialCreditsOpen] = useState(false);
  const [ratesOpen, setRatesOpen] = useState(false);

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

  const totalCreditsAmount = (credits?.federal?.total || 0) + (credits?.provincial?.total || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Hero Section - Take-Home Pay */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2744] rounded-2xl p-8 text-white">
        <div className="text-center">
          <p className="text-sm text-white/60 mb-2">From {formatCurrency(totalIncome)} earned, your take-home is</p>
          <div className="text-5xl font-bold mb-3">{formatCurrency(takeHome)}</div>
          <p className="text-sm text-white/70">That's {formatCurrency(Math.round(takeHome / 12))} per month</p>
          <p className="text-xs text-white/50 mt-3">After income tax, CPP, EI, and credits</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">How this breaks down</h3>
            <p className="text-xs text-slate-500">See how we arrived at your take-home pay</p>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            {showDetails ? 'Hide' : 'Show'} details
            {showDetails ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
        </div>

        <div className="space-y-3">
          {/* Total Income */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-slate-600">Income</span>
            <span className="text-sm font-semibold text-slate-900 tabular-nums">{formatCurrency(totalIncome)}</span>
          </div>

          {/* Deductions */}
          {totalDeductions > 0 && (
            <>
              <button
                onClick={() => setDeductionsOpen(!deductionsOpen)}
                className="w-full flex items-center justify-between py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {deductionsOpen ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                  <span className="text-sm text-slate-600">Deductions</span>
                </div>
                <span className="text-sm font-medium text-slate-700 tabular-nums">-{formatCurrency(totalDeductions)}</span>
              </button>
              {deductionsOpen && (
                <div className="pl-8 space-y-2 pb-2">
                  {deductionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span className="text-sm text-slate-600 font-medium tabular-nums">-{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {showDetails && (
            <>
              <div className="border-t border-slate-100 pt-3">
                <div className="bg-slate-50 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">Taxable Income</span>
                    <span className="text-sm font-semibold text-slate-900 tabular-nums">{formatCurrency(taxableIncome)}</span>
                  </div>
                  <p className="text-sm text-slate-500">This is the portion of your income that taxes are calculated on</p>
                </div>
              </div>

              {/* Income Taxes */}
              <button
                onClick={() => setTaxesOpen(!taxesOpen)}
                className="w-full flex items-center justify-between py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {taxesOpen ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                  <span className="text-sm text-slate-600">Income taxes paid</span>
                </div>
                <span className="text-sm font-medium text-slate-700 tabular-nums">-{formatCurrency(federalTax + provincialTax)}</span>
              </button>
              {taxesOpen && (
                <div className="pl-8 space-y-2 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Federal</span>
                    <span className="text-sm text-slate-600 font-medium tabular-nums">{formatCurrency(federalTax)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">{provinceName}</span>
                    <span className="text-sm text-slate-600 font-medium tabular-nums">{formatCurrency(provincialTax)}</span>
                  </div>
                </div>
              )}

              {/* Required Contributions */}
              {((cpp?.employment || 0) + (cpp?.selfEmployment || 0) + (ei?.premium || 0)) > 0 && (
                <>
                  <button
                    onClick={() => setContributionsOpen(!contributionsOpen)}
                    className="w-full flex items-center justify-between py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {contributionsOpen ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                      <span className="text-sm text-slate-600">Required contributions (CPP & EI)</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 tabular-nums">-{formatCurrency((cpp?.employment || 0) + (cpp?.selfEmployment || 0) + (ei?.premium || 0))}</span>
                  </button>
                  {contributionsOpen && (
                    <div className="pl-8 space-y-2 pb-2">
                      {cpp?.employment > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">CPP (Employment)</span>
                          <span className="text-sm text-slate-600 font-medium tabular-nums">{formatCurrency(cpp.employment)}</span>
                        </div>
                      )}
                      {cpp?.selfEmployment > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">CPP (Self-Employment)</span>
                          <span className="text-sm text-slate-600 font-medium tabular-nums">{formatCurrency(cpp.selfEmployment)}</span>
                        </div>
                      )}
                      {ei?.premium > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-500">EI Premium</span>
                          <span className="text-sm text-slate-600 font-medium tabular-nums">{formatCurrency(ei.premium)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Credits */}
              {totalCreditsAmount > 0 && (
                <>
                  <div className="bg-emerald-50 rounded-lg px-3 py-2.5 -mx-2">
                    <p className="text-sm text-emerald-700 mb-2">These credits reduce your tax dollar-for-dollar</p>
                    <button
                      onClick={() => setCreditsOpen(!creditsOpen)}
                      className="w-full flex items-center justify-between hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-2">
                        {creditsOpen ? <ChevronDown className="h-3.5 w-3.5 text-emerald-600" /> : <ChevronRight className="h-3.5 w-3.5 text-emerald-600" />}
                        <span className="text-sm font-medium text-emerald-900">Credits applied</span>
                      </div>
                      <span className="text-sm font-semibold text-emerald-700 tabular-nums">-{formatCurrency(totalCreditsAmount)}</span>
                    </button>
                  </div>
                  {creditsOpen && (
                    <div className="pl-6 space-y-3 pt-2">
                      {credits.federal?.items?.length > 0 && (
                        <>
                          <button
                            onClick={() => setFederalCreditsOpen(!federalCreditsOpen)}
                            className="w-full flex items-center justify-between hover:bg-emerald-50/50 rounded py-1"
                          >
                            <div className="flex items-center gap-1.5">
                              {federalCreditsOpen ? <ChevronDown className="h-3 w-3 text-emerald-500" /> : <ChevronRight className="h-3 w-3 text-emerald-500" />}
                              <span className="text-sm text-slate-500">Federal</span>
                            </div>
                            <span className="text-sm text-slate-600 font-medium tabular-nums">{formatCurrency(credits.federal.total)}</span>
                          </button>
                          {federalCreditsOpen && (
                            <div className="pl-6 space-y-1.5">
                              {credits.federal.items.map((item, idx) => (
                                <div key={`fed-${idx}`} className="flex items-center justify-between">
                                  <span className="text-sm text-slate-400">{item.label}</span>
                                  <span className="text-sm text-slate-500 tabular-nums">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                      {credits.provincial?.items?.length > 0 && (
                        <>
                          <button
                            onClick={() => setProvincialCreditsOpen(!provincialCreditsOpen)}
                            className="w-full flex items-center justify-between hover:bg-emerald-50/50 rounded py-1"
                          >
                            <div className="flex items-center gap-1.5">
                              {provincialCreditsOpen ? <ChevronDown className="h-3 w-3 text-emerald-500" /> : <ChevronRight className="h-3 w-3 text-emerald-500" />}
                              <span className="text-sm text-slate-500">{provinceName}</span>
                            </div>
                            <span className="text-sm text-slate-600 font-medium tabular-nums">{formatCurrency(credits.provincial.total)}</span>
                          </button>
                          {provincialCreditsOpen && (
                            <div className="pl-6 space-y-1.5">
                              {credits.provincial.items.map((item, idx) => (
                                <div key={`prov-${idx}`} className="flex items-center justify-between">
                                  <span className="text-sm text-slate-400">{item.label}</span>
                                  <span className="text-sm text-slate-500 tabular-nums">{formatCurrency(item.amount)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tax Rates */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <button
          onClick={() => setRatesOpen(!ratesOpen)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            {ratesOpen ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronRight className="h-4 w-4 text-slate-400" />}
            <div className="text-left">
              <span className="text-sm font-semibold text-slate-700 block">Your tax rates</span>
              <span className="text-xs text-slate-500">Understanding how much you pay</span>
            </div>
          </div>
          <Info className="h-4 w-4 text-slate-400" />
        </button>
        
        {ratesOpen && (
          <div className="px-5 pb-5 space-y-4 border-t border-slate-100 pt-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900">Effective Rate</span>
                <span className="text-2xl font-bold text-slate-900 tabular-nums">{formatPercent(effectiveTaxRate)}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                This is your average tax rate across all your income. It shows what percentage of your total earnings went to taxes.
              </p>
            </div>
            
            <div className="border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-900">Marginal Rate</span>
                <span className="text-2xl font-bold text-slate-900 tabular-nums">{formatPercent(marginalRate)}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                This rate applies only to your last dollars earned—not your entire income. It's what you'd pay on a bonus or raise.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}