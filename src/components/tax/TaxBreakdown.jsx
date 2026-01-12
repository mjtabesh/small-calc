import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet, Building2, MapPin, PiggyBank, Receipt, ChevronDown, ChevronRight, Info, Sparkles } from "lucide-react";

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

  const totalTaxAndContributions = totalTax + (cpp?.employment || 0) + (cpp?.selfEmployment || 0) + (ei?.premium || 0);
  const totalCreditsAmount = (credits?.federal?.total || 0) + (credits?.provincial?.total || 0);

  // Generate insight
  const getInsight = () => {
    if (totalDeductions > totalTax * 0.3) {
      return "Your deductions are working hard for you—they've significantly reduced your taxable income.";
    }
    if (effectiveTaxRate < marginalRate - 5) {
      return "Your effective tax rate is lower than your marginal rate—this is normal and means you're not paying the top rate on all your income.";
    }
    if (totalCreditsAmount > 3000) {
      return "Tax credits are reducing your tax bill significantly—make sure to keep claiming these next year.";
    }
    if ((cpp?.selfEmployment || 0) > (cpp?.employment || 0)) {
      return "As self-employed, you pay both employee and employer CPP contributions—half is deductible from your income.";
    }
    return "Your tax calculation includes all federal and provincial rates based on your income level.";
  };

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
          
          {/* Progress bar */}
          <div className="mt-6 bg-white/10 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white/80 h-full rounded-full transition-all duration-1000"
              style={{ width: `${(takeHome / totalIncome) * 100}%` }}
            />
          </div>
          <p className="text-xs text-white/50 mt-2">After income tax, CPP, EI, and credits</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">Calculation Summary</h3>
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
            <span className="text-base font-semibold text-slate-900">{formatCurrency(totalIncome)}</span>
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
                <span className="text-base font-medium text-slate-700">-{formatCurrency(totalDeductions)}</span>
              </button>
              {deductionsOpen && (
                <div className="pl-8 space-y-2 pb-2">
                  {deductionItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{item.label}</span>
                      <span className="text-slate-600 font-medium">-{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {showDetails && (
            <>
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between py-2 bg-slate-50 rounded-lg px-3">
                  <span className="text-sm font-medium text-slate-700">Taxable Income</span>
                  <span className="text-base font-semibold text-slate-900">{formatCurrency(taxableIncome)}</span>
                </div>
              </div>

              {/* Income Taxes */}
              <button
                onClick={() => setTaxesOpen(!taxesOpen)}
                className="w-full flex items-center justify-between py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {taxesOpen ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                  <span className="text-sm text-slate-600">Income Taxes</span>
                </div>
                <span className="text-base font-medium text-slate-700">-{formatCurrency(federalTax + provincialTax)}</span>
              </button>
              {taxesOpen && (
                <div className="pl-8 space-y-2 pb-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Federal</span>
                    <span className="text-slate-600 font-medium">{formatCurrency(federalTax)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{provinceName}</span>
                    <span className="text-slate-600 font-medium">{formatCurrency(provincialTax)}</span>
                  </div>
                </div>
              )}

              {/* Mandatory Contributions */}
              {((cpp?.employment || 0) + (cpp?.selfEmployment || 0) + (ei?.premium || 0)) > 0 && (
                <>
                  <button
                    onClick={() => setContributionsOpen(!contributionsOpen)}
                    className="w-full flex items-center justify-between py-2 hover:bg-slate-50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {contributionsOpen ? <ChevronDown className="h-3.5 w-3.5 text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
                      <span className="text-sm text-slate-600">Mandatory Contributions</span>
                    </div>
                    <span className="text-base font-medium text-slate-700">-{formatCurrency((cpp?.employment || 0) + (cpp?.selfEmployment || 0) + (ei?.premium || 0))}</span>
                  </button>
                  {contributionsOpen && (
                    <div className="pl-8 space-y-2 pb-2">
                      {cpp?.employment > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">CPP (Employment)</span>
                          <span className="text-slate-600 font-medium">{formatCurrency(cpp.employment)}</span>
                        </div>
                      )}
                      {cpp?.selfEmployment > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">CPP (Self-Employment)</span>
                          <span className="text-slate-600 font-medium">{formatCurrency(cpp.selfEmployment)}</span>
                        </div>
                      )}
                      {ei?.premium > 0 && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500">EI Premium</span>
                          <span className="text-slate-600 font-medium">{formatCurrency(ei.premium)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* Credits */}
              {totalCreditsAmount > 0 && (
                <>
                  <button
                    onClick={() => setCreditsOpen(!creditsOpen)}
                    className="w-full flex items-center justify-between py-2 hover:bg-emerald-50 rounded-lg px-2 -mx-2 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {creditsOpen ? <ChevronDown className="h-3.5 w-3.5 text-emerald-600" /> : <ChevronRight className="h-3.5 w-3.5 text-emerald-600" />}
                      <div className="text-left">
                        <span className="text-sm text-slate-600 block">Credits Reducing Your Tax</span>
                        <span className="text-xs text-slate-400">Applied dollar-for-dollar</span>
                      </div>
                    </div>
                    <span className="text-base font-medium text-emerald-600">-{formatCurrency(totalCreditsAmount)}</span>
                  </button>
                  {creditsOpen && (
                    <div className="pl-8 space-y-3 pb-2">
                      {credits.federal?.items?.length > 0 && (
                        <>
                          <button
                            onClick={() => setFederalCreditsOpen(!federalCreditsOpen)}
                            className="w-full flex items-center justify-between text-xs hover:bg-emerald-50/50 rounded py-1"
                          >
                            <div className="flex items-center gap-1.5">
                              {federalCreditsOpen ? <ChevronDown className="h-3 w-3 text-emerald-500" /> : <ChevronRight className="h-3 w-3 text-emerald-500" />}
                              <span className="text-slate-500">Federal</span>
                            </div>
                            <span className="text-slate-600 font-medium">{formatCurrency(credits.federal.total)}</span>
                          </button>
                          {federalCreditsOpen && (
                            <div className="pl-6 space-y-1.5">
                              {credits.federal.items.map((item, idx) => (
                                <div key={`fed-${idx}`} className="flex items-center justify-between text-xs">
                                  <span className="text-slate-400">{item.label}</span>
                                  <span className="text-slate-500">{formatCurrency(item.amount)}</span>
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
                            className="w-full flex items-center justify-between text-xs hover:bg-emerald-50/50 rounded py-1"
                          >
                            <div className="flex items-center gap-1.5">
                              {provincialCreditsOpen ? <ChevronDown className="h-3 w-3 text-emerald-500" /> : <ChevronRight className="h-3 w-3 text-emerald-500" />}
                              <span className="text-slate-500">{provinceName}</span>
                            </div>
                            <span className="text-slate-600 font-medium">{formatCurrency(credits.provincial.total)}</span>
                          </button>
                          {provincialCreditsOpen && (
                            <div className="pl-6 space-y-1.5">
                              {credits.provincial.items.map((item, idx) => (
                                <div key={`prov-${idx}`} className="flex items-center justify-between text-xs">
                                  <span className="text-slate-400">{item.label}</span>
                                  <span className="text-slate-500">{formatCurrency(item.amount)}</span>
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
            <span className="text-sm font-semibold text-slate-700">Your Tax Rates</span>
          </div>
          <Info className="h-4 w-4 text-slate-400" />
        </button>
        
        {ratesOpen && (
          <div className="px-5 pb-4 space-y-3 border-t border-slate-100">
            <div className="flex items-center justify-between pt-3">
              <div>
                <span className="text-sm font-medium text-slate-900 block">Effective Rate</span>
                <span className="text-xs text-slate-500">The average rate on all your income</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">{formatPercent(effectiveTaxRate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-slate-900 block">Marginal Rate</span>
                <span className="text-xs text-slate-500">The rate on your next dollar earned</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">{formatPercent(marginalRate)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Insight */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-indigo-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-indigo-900 mb-1">Insight</p>
            <p className="text-sm text-indigo-700 leading-relaxed">{getInsight()}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}