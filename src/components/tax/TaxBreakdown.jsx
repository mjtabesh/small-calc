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
    taxableIncome,
    federalTax,
    provincialTax,
    totalTax,
    netIncome,
    effectiveRate,
    marginalRate,
    provinceName
  } = results;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Main Result Card */}
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
          After all taxes • {formatCurrency(netIncome / 12)}/month
        </div>
      </div>

      {/* Tax Summary Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-medium text-slate-500">Federal Tax</span>
          </div>
          <div className="text-xl font-semibold text-slate-900">
            {formatCurrency(federalTax)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-teal-600" />
            <span className="text-xs font-medium text-slate-500">{provinceName} Tax</span>
          </div>
          <div className="text-xl font-semibold text-slate-900">
            {formatCurrency(provincialTax)}
          </div>
        </motion.div>
      </div>

      {/* Total Tax */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-red-50 rounded-xl p-4 border border-red-100"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">Total Tax Payable</span>
          </div>
          <div className="text-xl font-bold text-red-700">
            {formatCurrency(totalTax)}
          </div>
        </div>
      </motion.div>

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

      {/* Income Summary */}
      <div className="bg-white rounded-xl border border-slate-100 divide-y divide-slate-100">
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm text-slate-600">Total Income</span>
          <span className="text-sm font-medium text-slate-900">{formatCurrency(totalIncome)}</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <span className="text-sm text-slate-600">Taxable Income</span>
          <span className="text-sm font-medium text-slate-900">{formatCurrency(taxableIncome)}</span>
        </div>
        <div className="p-4 flex items-center justify-between bg-green-50">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">Net Income</span>
          </div>
          <span className="text-sm font-bold text-green-700">{formatCurrency(netIncome)}</span>
        </div>
      </div>
    </motion.div>
  );
}