// 2025 Canadian Federal Tax Brackets (from CRA)
// Note: 14.5% effective rate for 2025 (15% reduced to 14% starting July 1, 2025)
const FEDERAL_BRACKETS = [
  { limit: 57375, rate: 0.145 },
  { limit: 114750, rate: 0.205 },
  { limit: 177882, rate: 0.26 },
  { limit: 253414, rate: 0.29 },
  { limit: Infinity, rate: 0.33 }
];

// 2025 Provincial Tax Brackets (from CRA and provincial sources)
const PROVINCIAL_BRACKETS = {
  AB: [
    { limit: 60000, rate: 0.08 },
    { limit: 151234, rate: 0.10 },
    { limit: 181481, rate: 0.12 },
    { limit: 241974, rate: 0.13 },
    { limit: 362961, rate: 0.14 },
    { limit: Infinity, rate: 0.15 }
  ],
  BC: [
    { limit: 49279, rate: 0.0506 },
    { limit: 98560, rate: 0.077 },
    { limit: 113158, rate: 0.105 },
    { limit: 137407, rate: 0.1229 },
    { limit: 186306, rate: 0.147 },
    { limit: 259829, rate: 0.168 },
    { limit: Infinity, rate: 0.205 }
  ],
  MB: [
    { limit: 47564, rate: 0.108 },
    { limit: 101200, rate: 0.1275 },
    { limit: Infinity, rate: 0.174 }
  ],
  NB: [
    { limit: 51306, rate: 0.094 },
    { limit: 102614, rate: 0.14 },
    { limit: 190060, rate: 0.16 },
    { limit: Infinity, rate: 0.195 }
  ],
  NL: [
    { limit: 44192, rate: 0.087 },
    { limit: 88382, rate: 0.145 },
    { limit: 157792, rate: 0.158 },
    { limit: 220910, rate: 0.178 },
    { limit: 282214, rate: 0.198 },
    { limit: 564429, rate: 0.208 },
    { limit: 1128858, rate: 0.213 },
    { limit: Infinity, rate: 0.218 }
  ],
  NS: [
    { limit: 30507, rate: 0.0879 },
    { limit: 61015, rate: 0.1495 },
    { limit: 95883, rate: 0.1667 },
    { limit: 154650, rate: 0.175 },
    { limit: Infinity, rate: 0.21 }
  ],
  NT: [
    { limit: 51964, rate: 0.059 },
    { limit: 103930, rate: 0.086 },
    { limit: 168967, rate: 0.122 },
    { limit: Infinity, rate: 0.1405 }
  ],
  NU: [
    { limit: 54707, rate: 0.04 },
    { limit: 109413, rate: 0.07 },
    { limit: 177881, rate: 0.09 },
    { limit: Infinity, rate: 0.115 }
  ],
  ON: [
    { limit: 52886, rate: 0.0505 },
    { limit: 105775, rate: 0.0915 },
    { limit: 150000, rate: 0.1116 },
    { limit: 220000, rate: 0.1216 },
    { limit: Infinity, rate: 0.1316 }
  ],
  PE: [
    { limit: 33328, rate: 0.095 },
    { limit: 64656, rate: 0.1347 },
    { limit: 105000, rate: 0.166 },
    { limit: 140000, rate: 0.1762 },
    { limit: Infinity, rate: 0.19 }
  ],
  QC: [
    { limit: 53255, rate: 0.14 },
    { limit: 106495, rate: 0.19 },
    { limit: 129590, rate: 0.24 },
    { limit: Infinity, rate: 0.2575 }
  ],
  SK: [
    { limit: 53463, rate: 0.105 },
    { limit: 152750, rate: 0.125 },
    { limit: Infinity, rate: 0.145 }
  ],
  YT: [
    { limit: 57375, rate: 0.064 },
    { limit: 114750, rate: 0.09 },
    { limit: 177882, rate: 0.109 },
    { limit: 500000, rate: 0.128 },
    { limit: Infinity, rate: 0.15 }
  ]
};

// Basic Personal Amounts 2025
const FEDERAL_BPA = 16129;
const PROVINCIAL_BPA = {
  AB: 22331,
  BC: 12936,
  MB: 15780,
  NB: 13399,
  NL: 10818,
  NS: 8744,
  NT: 17840,
  NU: 19268,
  ON: 12399,
  PE: 13750,
  QC: 18591,
  SK: 18982,
  YT: 16129
};

const PROVINCE_NAMES = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  NT: "Northwest Territories",
  NU: "Nunavut",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
  YT: "Yukon"
};

function calculateTaxFromBrackets(income, brackets) {
  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (income <= previousLimit) break;
    
    // Calculate how much income falls in this bracket
    const incomeInBracket = Math.min(income, bracket.limit) - previousLimit;
    
    if (incomeInBracket > 0) {
      tax += incomeInBracket * bracket.rate;
    }
    
    previousLimit = bracket.limit;
    
    if (income <= bracket.limit) break;
  }

  return tax;
}

function getMarginalRate(income, brackets) {
  let previousLimit = 0;
  
  for (const bracket of brackets) {
    if (income <= bracket.limit) {
      return bracket.rate;
    }
    previousLimit = bracket.limit;
  }
  
  return brackets[brackets.length - 1].rate;
}

export function calculateTax({
  province,
  income = {},
  deductions = {},
  credits = {}
}) {
  // Calculate total income
  const totalIncome = 
    (income.employment || 0) +
    (income.selfEmployment || 0) +
    (income.investment || 0) +
    (income.rental || 0) +
    (income.rrspWithdrawal || 0) +
    (income.pension || 0) +
    (income.eiIncome || 0) +
    (income.other || 0);

  // Calculate total deductions
  const totalDeductions = 
    (deductions.rrsp || 0) +
    (deductions.unionDues || 0) +
    (deductions.childcare || 0) +
    (deductions.movingExpenses || 0) +
    (deductions.supportPayments || 0) +
    (deductions.other || 0);

  // Calculate taxable income
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);

  // Calculate federal tax
  const federalBPA = credits.disableBasicPersonal ? 0 : FEDERAL_BPA;
  const federalTaxableIncome = Math.max(0, taxableIncome - federalBPA);
  let federalTax = calculateTaxFromBrackets(federalTaxableIncome, FEDERAL_BRACKETS);

  // Apply federal credits
  const federalCreditsAmount = 
    (credits.medicalExpenses || 0) * 0.15 +
    (credits.donations || 0) * 0.15 +
    (credits.tuition || 0) * 0.15 +
    (credits.disability ? 9428 * 0.15 : 0) +
    (credits.age65Plus ? 8790 * 0.15 : 0) +
    (credits.spouseAmount || 0) * 0.15;

  federalTax = Math.max(0, federalTax - federalCreditsAmount);

  // Calculate provincial tax
  const provincialBPA = credits.disableBasicPersonal ? 0 : (PROVINCIAL_BPA[province] || 0);
  const provincialBrackets = PROVINCIAL_BRACKETS[province] || PROVINCIAL_BRACKETS.ON;
  const provincialTaxableIncome = Math.max(0, taxableIncome - provincialBPA);
  let provincialTax = calculateTaxFromBrackets(provincialTaxableIncome, provincialBrackets);

  // Apply provincial credits (simplified - using lowest provincial rate)
  const lowestProvRate = provincialBrackets[0].rate;
  const provincialCreditsAmount = 
    (credits.medicalExpenses || 0) * lowestProvRate +
    (credits.donations || 0) * lowestProvRate +
    (credits.tuition || 0) * lowestProvRate;

  provincialTax = Math.max(0, provincialTax - provincialCreditsAmount);

  // Quebec abatement (16.5% reduction in federal tax)
  if (province === 'QC') {
    federalTax = federalTax * 0.835;
  }

  const totalTax = federalTax + provincialTax;
  const netIncome = totalIncome - totalTax;
  const effectiveRate = totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0;
  
  const federalMarginal = getMarginalRate(taxableIncome, FEDERAL_BRACKETS);
  const provincialMarginal = getMarginalRate(taxableIncome, provincialBrackets);
  const marginalRate = (federalMarginal + provincialMarginal) * 100;

  return {
    totalIncome,
    totalDeductions,
    taxableIncome,
    federalTax,
    provincialTax,
    totalTax,
    netIncome,
    effectiveRate,
    marginalRate,
    provinceName: PROVINCE_NAMES[province] || province
  };
}