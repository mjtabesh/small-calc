import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { TrendingUp, PieChartIcon, BarChart3 } from "lucide-react";

const COLORS = {
  federal: '#1e3a5f',
  provincial: '#3b5998',
  cpp: '#10b981',
  ei: '#f59e0b'
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function TaxCharts({ results }) {
  if (!results || results.totalIncome === 0) return null;

  const { federalTax, provincialTax, cpp, ei, taxableIncome, totalIncome } = results;

  // 1. Tax Contributions Breakdown (Pie Chart)
  const taxBreakdownData = [
    { name: 'Federal Tax', value: federalTax, color: COLORS.federal },
    { name: 'Provincial Tax', value: provincialTax, color: COLORS.provincial },
    { name: 'CPP', value: (cpp?.employment || 0) + (cpp?.selfEmployment || 0), color: COLORS.cpp },
    { name: 'EI', value: ei?.premium || 0, color: COLORS.ei }
  ].filter(item => item.value > 0);

  // 2. Tax Bracket Visualization - simplified federal brackets
  const federalBrackets = [
    { bracket: '$0 - $57,375', rate: '15%', amount: 0 },
    { bracket: '$57,376 - $114,750', rate: '20.5%', amount: 0 },
    { bracket: '$114,751 - $177,882', rate: '26%', amount: 0 },
    { bracket: '$177,883 - $253,414', rate: '29%', amount: 0 },
    { bracket: '$253,415+', rate: '33%', amount: 0 }
  ];

  // Calculate how much income falls into each bracket
  let remaining = taxableIncome;
  const bracketLimits = [57375, 114750, 177882, 253414, Infinity];
  
  bracketLimits.forEach((limit, idx) => {
    if (remaining <= 0) return;
    const prevLimit = idx === 0 ? 0 : bracketLimits[idx - 1];
    const inThisBracket = Math.min(remaining, limit - prevLimit);
    federalBrackets[idx].amount = inThisBracket;
    remaining -= inThisBracket;
  });

  const bracketData = federalBrackets.filter(b => b.amount > 0);

  // 3. Tax Projection (next 5 years with 3% income growth)
  const projectionData = [];
  const GROWTH_RATE = 0.03;
  
  for (let year = 0; year <= 4; year++) {
    const projectedIncome = totalIncome * Math.pow(1 + GROWTH_RATE, year);
    const projectedTaxableIncome = Math.max(0, projectedIncome - (totalIncome - taxableIncome));
    
    // Simple tax calculation based on current effective rate
    const effectiveRate = results.effectiveTaxRate / 100;
    const projectedTotalTax = projectedTaxableIncome * effectiveRate;
    const projectedFederalTax = projectedTotalTax * (federalTax / (federalTax + provincialTax));
    const projectedProvincialTax = projectedTotalTax * (provincialTax / (federalTax + provincialTax));
    
    projectionData.push({
      year: `${2025 + year}`,
      income: Math.round(projectedIncome),
      federal: Math.round(projectedFederalTax),
      provincial: Math.round(projectedProvincialTax),
      total: Math.round(projectedTotalTax)
    });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-medium text-slate-900">{payload[0].name}</p>
          <p className="text-lg font-bold text-slate-700">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const ProjectionTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
          <p className="font-medium text-slate-900 mb-2">{payload[0].payload.year}</p>
          <p className="text-sm text-slate-600">Income: {formatCurrency(payload[0].payload.income)}</p>
          <p className="text-sm font-semibold text-slate-900">Total Tax: {formatCurrency(payload[0].payload.total)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Tax Breakdown Pie Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Tax Contributions Breakdown</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={taxBreakdownData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {taxBreakdownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {taxBreakdownData.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }} />
              <div>
                <p className="text-xs text-slate-600">{item.name}</p>
                <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax Bracket Visualization */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-slate-600" />
          <h3 className="text-lg font-semibold text-slate-900">Income by Federal Tax Bracket</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bracketData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
            <YAxis dataKey="bracket" type="category" width={130} tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Bar dataKey="amount" fill="#1e3a5f" radius={[0, 8, 8, 0]}>
              {bracketData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(${220 - index * 20}, 60%, ${40 + index * 10}%)`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p className="text-xs text-slate-500 mt-3 text-center">
          Your taxable income of {formatCurrency(taxableIncome)} spans across {bracketData.length} tax bracket{bracketData.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Tax Projection */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-slate-600" />
          <div>
            <h3 className="text-lg font-semibold text-slate-900">5-Year Tax Projection</h3>
            <p className="text-xs text-slate-500">Assuming 3% annual income growth</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip content={<ProjectionTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#1e3a5f" 
              strokeWidth={3}
              dot={{ r: 5 }}
              name="Total Tax"
            />
            <Line 
              type="monotone" 
              dataKey="federal" 
              stroke="#3b5998" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Federal"
            />
            <Line 
              type="monotone" 
              dataKey="provincial" 
              stroke="#10b981" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Provincial"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="bg-amber-50 rounded-lg p-3 mt-4 border border-amber-100">
          <p className="text-xs text-amber-800">
            <strong>Note:</strong> This projection assumes your current tax situation remains constant and your income grows at 3% annually. Actual taxes may vary based on changes to tax rates, deductions, and credits.
          </p>
        </div>
      </div>
    </div>
  );
}