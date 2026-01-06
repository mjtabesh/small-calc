import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Shield, Calculator, Info, AlertCircle, CheckCircle } from "lucide-react";

// 2025 Tax Guide Data
const TAX_GUIDE_DATA = {
  FED: {
    brackets: [
      { income: "$0 - $57,375", rate: "15%" },
      { income: "$57,375 - $114,750", rate: "20.5%" },
      { income: "$114,750 - $177,882", rate: "26%" },
      { income: "$177,882 - $253,414", rate: "29%" },
      { income: "Over $253,414", rate: "33%" }
    ],
    bpa: "$16,129 (reduced to $14,538 for high earners)",
    cpp: {
      limit: "$71,300",
      rate: "5.95%",
      max: "$4,034.10"
    },
    ei: {
      limit: "$65,700",
      rate: "1.64%",
      max: "$1,077.48"
    }
  },
  ON: {
    name: "Ontario",
    brackets: [
      { income: "$0 - $52,886", rate: "5.05%" },
      { income: "$52,886 - $105,775", rate: "9.15%" },
      { income: "$105,775 - $150,000", rate: "11.16%" },
      { income: "$150,000 - $220,000", rate: "12.16%" },
      { income: "Over $220,000", rate: "13.16%" }
    ],
    bpa: "$12,747",
    surtax: "20% on provincial tax over $5,710; additional 36% over $7,307",
    healthPremium: "Up to $900 annually based on income"
  },
  BC: {
    name: "British Columbia",
    brackets: [
      { income: "$0 - $49,279", rate: "5.06%" },
      { income: "$49,279 - $98,560", rate: "7.7%" },
      { income: "$98,560 - $113,158", rate: "10.5%" },
      { income: "$113,158 - $137,407", rate: "12.29%" },
      { income: "$137,407 - $186,306", rate: "14.7%" },
      { income: "$186,306 - $259,829", rate: "16.8%" },
      { income: "Over $259,829", rate: "20.5%" }
    ],
    bpa: "$12,932"
  },
  AB: {
    name: "Alberta",
    brackets: [
      { income: "$0 - $60,000", rate: "8%" },
      { income: "$60,000 - $151,234", rate: "10%" },
      { income: "$151,234 - $181,481", rate: "12%" },
      { income: "$181,481 - $241,974", rate: "13%" },
      { income: "$241,974 - $362,961", rate: "14%" },
      { income: "Over $362,961", rate: "15%" }
    ],
    bpa: "$22,323"
  },
  SK: {
    name: "Saskatchewan",
    brackets: [
      { income: "$0 - $53,463", rate: "10.5%" },
      { income: "$53,463 - $152,750", rate: "12.5%" },
      { income: "Over $152,750", rate: "14.5%" }
    ],
    bpa: "$19,491"
  },
  MB: {
    name: "Manitoba",
    brackets: [
      { income: "$0 - $47,564", rate: "10.8%" },
      { income: "$47,564 - $101,200", rate: "12.75%" },
      { income: "Over $101,200", rate: "17.4%" }
    ],
    bpa: "$15,780 (phased out between $200k-$400k)"
  },
  NB: {
    name: "New Brunswick",
    brackets: [
      { income: "$0 - $51,306", rate: "9.4%" },
      { income: "$51,306 - $102,614", rate: "14%" },
      { income: "$102,614 - $190,060", rate: "16%" },
      { income: "Over $190,060", rate: "19.5%" }
    ],
    bpa: "$13,396"
  },
  NS: {
    name: "Nova Scotia",
    brackets: [
      { income: "$0 - $30,507", rate: "8.79%" },
      { income: "$30,507 - $61,015", rate: "14.95%" },
      { income: "$61,015 - $95,883", rate: "16.67%" },
      { income: "$95,883 - $154,650", rate: "17.5%" },
      { income: "Over $154,650", rate: "21%" }
    ],
    bpa: "$11,744"
  },
  PE: {
    name: "Prince Edward Island",
    brackets: [
      { income: "$0 - $33,328", rate: "9.5%" },
      { income: "$33,328 - $64,656", rate: "13.47%" },
      { income: "$64,656 - $105,000", rate: "16.6%" },
      { income: "$105,000 - $140,000", rate: "17.62%" },
      { income: "Over $140,000", rate: "19%" }
    ],
    bpa: "$14,650"
  },
  NL: {
    name: "Newfoundland and Labrador",
    brackets: [
      { income: "$0 - $44,192", rate: "8.7%" },
      { income: "$44,192 - $88,382", rate: "14.5%" },
      { income: "$88,382 - $157,792", rate: "15.8%" },
      { income: "$157,792 - $220,910", rate: "17.8%" },
      { income: "$220,910 - $282,214", rate: "19.8%" },
      { income: "$282,214 - $564,429", rate: "20.8%" },
      { income: "$564,429 - $1,128,858", rate: "21.3%" },
      { income: "Over $1,128,858", rate: "21.8%" }
    ],
    bpa: "$11,067"
  },
  NT: {
    name: "Northwest Territories",
    brackets: [
      { income: "$0 - $51,964", rate: "5.9%" },
      { income: "$51,964 - $103,930", rate: "8.6%" },
      { income: "$103,930 - $168,967", rate: "12.2%" },
      { income: "Over $168,967", rate: "14.05%" }
    ],
    bpa: "$17,842"
  },
  NU: {
    name: "Nunavut",
    brackets: [
      { income: "$0 - $54,707", rate: "4%" },
      { income: "$54,707 - $109,413", rate: "7%" },
      { income: "$109,413 - $177,881", rate: "9%" },
      { income: "Over $177,881", rate: "11.5%" }
    ],
    bpa: "$19,274"
  },
  YT: {
    name: "Yukon",
    brackets: [
      { income: "$0 - $57,375", rate: "6.4%" },
      { income: "$57,375 - $114,750", rate: "9%" },
      { income: "$114,750 - $177,882", rate: "10.9%" },
      { income: "$177,882 - $500,000", rate: "12.8%" },
      { income: "Over $500,000", rate: "15%" }
    ],
    bpa: "$16,129"
  }
};

export default function TaxGuide({ province = "ON" }) {
  const provData = TAX_GUIDE_DATA[province];
  const fedData = TAX_GUIDE_DATA.FED;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-16"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full mb-4">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-900">Tax Guide 2025</span>
        </div>
        <h2 className="text-4xl font-bold text-slate-900 mb-4">
          Complete Guide to Canadian Income Tax
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Understanding federal and {provData.name} provincial tax rates, brackets, 
          deductions, and credits for the 2025 tax year.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="bg-slate-50 rounded-2xl p-6 mb-12 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
          In This Guide
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            "Federal Tax Brackets",
            `${provData.name} Tax Brackets`,
            "CPP & EI Contributions",
            "Tax Credits & Deductions",
            "Marginal vs Effective Tax Rates",
            "Tax Planning Strategies"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Federal Tax Brackets */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Federal Tax Brackets (2025)</h3>
        </div>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          All Canadian residents pay federal income tax on their taxable income. The federal 
          government uses a progressive tax system with five tax brackets. Your income is taxed 
          at different rates as it moves through each bracket.
        </p>

        <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                  Taxable Income
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                  Federal Tax Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {fedData.brackets.map((bracket, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 text-sm text-slate-700">{bracket.income}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-right text-slate-900">
                    {bracket.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Federal Basic Personal Amount: {fedData.bpa}
              </p>
              <p className="text-sm text-blue-800">
                This is the amount of income you can earn before paying any federal tax. 
                It's automatically applied as a non-refundable tax credit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Provincial Tax Brackets */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">
            {provData.name} Tax Brackets (2025)
          </h3>
        </div>
        
        <p className="text-slate-600 mb-6 leading-relaxed">
          In addition to federal tax, you also pay provincial income tax to {provData.name}. 
          Provincial tax rates and brackets vary significantly across Canada, which is why 
          your location has a major impact on your total tax bill.
        </p>

        <div className="overflow-hidden rounded-xl border border-slate-200 mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">
                  Taxable Income
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">
                  {provData.name} Tax Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {provData.brackets.map((bracket, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 px-4 text-sm text-slate-700">{bracket.income}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-right text-slate-900">
                    {bracket.rate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-purple-900 mb-1">
                  Provincial Basic Personal Amount: {provData.bpa}
                </p>
                <p className="text-sm text-purple-800">
                  Similar to the federal BPA, this provincial amount is tax-free.
                </p>
              </div>
            </div>
          </div>

          {provData.surtax && (
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-amber-900 mb-1">Ontario Surtax</p>
                  <p className="text-sm text-amber-800">{provData.surtax}</p>
                </div>
              </div>
            </div>
          )}

          {provData.healthPremium && (
            <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-teal-900 mb-1">Ontario Health Premium</p>
                  <p className="text-sm text-teal-800">{provData.healthPremium}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CPP & EI */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Calculator className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">CPP & EI Contributions (2025)</h3>
        </div>

        <p className="text-slate-600 mb-6 leading-relaxed">
          In addition to income tax, most Canadians contribute to the Canada Pension Plan (CPP) 
          and Employment Insurance (EI). These are mandatory payroll deductions that fund 
          retirement benefits and unemployment insurance.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              Canada Pension Plan (CPP)
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-600">Maximum Pensionable Earnings</span>
                <span className="text-sm font-semibold text-slate-900">{fedData.cpp.limit}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-600">Employee Contribution Rate</span>
                <span className="text-sm font-semibold text-slate-900">{fedData.cpp.rate}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-600">Maximum Annual Contribution</span>
                <span className="text-sm font-semibold text-emerald-600">{fedData.cpp.max}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
              Self-employed individuals pay both the employee and employer portions (11.9%).
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              Employment Insurance (EI)
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-600">Maximum Insurable Earnings</span>
                <span className="text-sm font-semibold text-slate-900">{fedData.ei.limit}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-600">Employee Premium Rate</span>
                <span className="text-sm font-semibold text-slate-900">{fedData.ei.rate}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-sm text-slate-600">Maximum Annual Premium</span>
                <span className="text-sm font-semibold text-emerald-600">{fedData.ei.max}</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
              Self-employed individuals generally don't pay EI unless they opt in.
            </p>
          </div>
        </div>
      </section>

      {/* Tax Credits & Deductions */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-100 rounded-lg">
            <CheckCircle className="h-5 w-5 text-rose-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Common Tax Credits & Deductions</h3>
        </div>

        <p className="text-slate-600 mb-6 leading-relaxed">
          Understanding the difference between tax credits and deductions can save you thousands 
          of dollars. Deductions reduce your taxable income, while credits directly reduce the 
          tax you owe.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h4 className="text-lg font-bold text-slate-900 mb-3">Tax Deductions</h4>
            <p className="text-sm text-slate-600 mb-4">
              Reduce your taxable income before tax is calculated
            </p>
            <ul className="space-y-2">
              {[
                "RRSP contributions",
                "Union and professional dues",
                "Childcare expenses",
                "Moving expenses (40km+ for work)",
                "Support payments made"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h4 className="text-lg font-bold text-slate-900 mb-3">Tax Credits</h4>
            <p className="text-sm text-slate-600 mb-4">
              Directly reduce the amount of tax you owe
            </p>
            <ul className="space-y-2">
              {[
                "Basic personal amount",
                "Spouse or common-law partner amount",
                "Medical expenses",
                "Charitable donations",
                "Disability tax credit",
                "Age amount (65+)",
                "Tuition fees"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-amber-900 mb-2">
                Pro Tip: Maximize Your RRSP Contributions
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                RRSP contributions are one of the most powerful tax deduction tools available. 
                You can contribute up to 18% of your previous year's income (up to $31,560 for 2025), 
                and the contribution directly reduces your taxable income, potentially pushing you 
                into a lower tax bracket.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marginal vs Effective */}
      <section className="mb-16">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Understanding Marginal vs. Effective Tax Rates
        </h3>

        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-8 mb-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full" />
                <h4 className="text-lg font-bold text-slate-900">Marginal Tax Rate</h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                The tax rate you pay on your next dollar of income. This is the combined federal 
                and provincial rate of your highest tax bracket.
              </p>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Example:</p>
                <p className="text-sm text-slate-700">
                  If you earn $100,000 in {provData.name}, your marginal rate determines how much 
                  tax you'll pay on any additional income (bonus, raise, side income).
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <h4 className="text-lg font-bold text-slate-900">Effective Tax Rate</h4>
              </div>
              <p className="text-sm text-slate-600 mb-3">
                Your average tax rate across all your income. This is your total tax divided 
                by your total income.
              </p>
              <div className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Example:</p>
                <p className="text-sm text-slate-700">
                  If you earn $100,000 and pay $20,000 in tax, your effective rate is 20%, 
                  even though your marginal rate might be 30%+.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <strong className="text-blue-900">Why this matters:</strong> When planning major 
              financial decisions (RRSP contributions, bonus timing, business expenses), focus on 
              your marginal rate. For overall tax burden assessment, look at your effective rate.
            </p>
          </div>
        </div>
      </section>

      {/* Tax Planning Strategies */}
      <section>
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Tax Planning Strategies for {provData.name} Residents
        </h3>

        <div className="grid gap-4">
          {[
            {
              title: "Income Splitting with Spouse",
              description: "If one spouse earns significantly more, consider pension splitting or spousal RRSP contributions to balance income and reduce overall family tax."
            },
            {
              title: "Timing of Capital Gains",
              description: "Only 50% of capital gains are taxable. Consider timing the sale of investments to spread gains across multiple tax years if you're near a bracket threshold."
            },
            {
              title: "Maximize TFSA Contributions",
              description: "While TFSA contributions aren't tax-deductible, all growth and withdrawals are tax-free. Use this for investments that generate high returns."
            },
            {
              title: "Track Medical Expenses",
              description: "Medical expenses exceeding 3% of your net income (or $2,834 for 2025) are eligible for a tax credit. Keep all receipts throughout the year."
            },
            {
              title: "Charitable Donations Strategy",
              description: "Donations over $200 receive a higher tax credit rate (up to 33% federally). Consider bunching multiple years of donations into one tax year for maximum benefit."
            }
          ].map((strategy, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-md transition-all"
            >
              <h4 className="text-base font-bold text-slate-900 mb-2">
                {idx + 1}. {strategy.title}
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {strategy.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Note */}
      <div className="mt-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100 text-center">
        <p className="text-sm text-slate-700 leading-relaxed">
          <strong className="text-slate-900">Important:</strong> Tax laws are complex and change regularly. 
          This guide provides general information for the 2025 tax year. For personalized advice, 
          especially for complex situations, consult with a qualified tax professional or accountant.
        </p>
      </div>
    </motion.div>
  );
}