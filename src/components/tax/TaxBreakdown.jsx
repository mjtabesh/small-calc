import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet, Building2, MapPin, PiggyBank, Receipt } from "lucide-react";

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
    totalIncome,
    totalDeductions,
    taxableIncome,
    federalTax,
    provincialTax,
    totalTax,
    cppContribution,
    eiPremium,
    netIncome,
    effectiveRate,
    marginalRate,
    provinceName,
    credits
  } = results;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Step 1: Total Income */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">Total Income</span>
          <span className="text-xl font-bold text-slate-900">{formatCurrency(totalIncome)}</span>
        </div>
      </div>

      {/* Step 2: Deductions */}
      {totalDeductions > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 rounded-xl border border-blue-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Deductions</span>
            </div>
            <span className="text-lg font-semibold text-blue-900">-{formatCurrency(totalDeductions)}</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">RRSP, union dues, childcare, etc.</p>
        </motion.div>
      )}

      {/* Step 3: Taxable Income */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">Taxable Income</span>
          <span className="text-xl font-bold text-slate-900">{formatCurrency(taxableIncome)}</span>
        </div>
      </div>

      {/* Step 4: Taxes and Contributions */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-slate-700 px-1">Taxes & Contributions</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Building2 className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-slate-500">Federal Tax</span>
            </div>
            <div className="text-lg font-semibold text-slate-900">{formatCurrency(federalTax)}</div>
          </div>

          <div className="bg-white rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-teal-600" />
              <span className="text-xs text-slate-500">{provinceName} Tax</span>
            </div>
            <div className="text-lg font-semibold text-slate-900">{formatCurrency(provincialTax)}</div>
          </div>

          {cppContribution > 0 && (
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <PiggyBank className="h-4 w-4 text-purple-600" />
                <span className="text-xs text-slate-500">CPP</span>
              </div>
              <div className="text-lg font-semibold text-slate-900">{formatCurrency(cppContribution)}</div>
            </div>
          )}

          {eiPremium > 0 && (
            <div className="bg-white rounded-lg p-3 border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Receipt className="h-4 w-4 text-indigo-600" />
                <span className="text-xs text-slate-500">EI</span>
              </div>
              <div className="text-lg font-semibold text-slate-900">{formatCurrency(eiPremium)}</div>
            </div>
          )}
        </div>
      </div>

      {/* Step 5: Credits */}
      {credits && credits.total > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 rounded-xl border border-green-100 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">Tax Credits Applied</span>
            </div>
            <span className="text-lg font-semibold text-green-900">-{formatCurrency(credits.total)}</span>
          </div>
          <p className="text-xs text-green-600 mt-1">BPA, Canada Employment Amount, CPP/EI credits, etc.</p>
        </motion.div>
      )}

      {/* Step 6: Net Income / Take-Home Pay */}
      <div className="bg-gradient-to-br from-[#1e3a5f] to-[#0f2744] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/10 rounded-lg">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-white/70 text-sm font-medium">Your Take-Home Pay</span>
        </div>
        <div className="text-4xl font-bold tracking-tight mb-1">
          {formatCurrency(netIncome)}
        </div>
        <div className="text-white/60 text-sm">
          After all deductions • {formatCurrency(netIncome / 12)}/month
        </div>
      </div>

      {/* Tax Rates */}
      <div className="bg-slate-50 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-semibold text-slate-700">Tax Rates</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-600" />
              <span className="text-sm text-slate-600">Effective Rate</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{formatPercent(effectiveRate)}</span>
          </div>
          
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(effectiveRate, 100)}%` }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full"
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600" />
              <span className="text-sm text-slate-600">Marginal Rate</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{formatPercent(marginalRate)}</span>
          </div>
          
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(marginalRate, 100)}%` }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
            />
          </div>
        </div>
        
        <p className="text-xs text-slate-500 pt-2">
          Effective rate is your average tax rate. Marginal rate is the tax on your next dollar earned.
        </p>
      </div>

    </motion.div>
  );
}