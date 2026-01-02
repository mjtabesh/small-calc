// 2024 Canadian Federal Tax Brackets (verified from CRA)
const FEDERAL_BRACKETS = [
  { limit: 55867, rate: 0.15 },
  { limit: 111733, rate: 0.205 },
  { limit: 173205, rate: 0.26 },
  { limit: 246752, rate: 0.29 },
  { limit: Infinity, rate: 0.33 }
];

// 2024 Provincial Tax Brackets (verified from CRA and provincial sources)
const PROVINCIAL_BRACKETS = {
  AB: [
    { limit: 148269, rate: 0.10 },
    { limit: 177922, rate: 0.12 },
    { limit: 237230, rate: 0.13 },
    { limit: 355845, rate: 0.14 },
    { limit: Infinity, rate: 0.15 }
  ],
  BC: [
    { limit: 47937, rate: 0.0506 },
    { limit: 95875, rate: 0.077 },
    { limit: 110076, rate: 0.105 },
    { limit: 133664, rate: 0.1229 },
    { limit: 181232, rate: 0.147 },
    { limit: 252752, rate: 0.168 },
    { limit: Infinity, rate: 0.205 }
  ],
  MB: [
    { limit: 47000, rate: 0.108 },
    { limit: 100000, rate: 0.1275 },
    { limit: Infinity, rate: 0.174 }
  ],
  NB: [
    { limit: 49958, rate: 0.094 },
    { limit: 99916, rate: 0.14 },
    { limit: 185064, rate: 0.16 },
    { limit: Infinity, rate: 0.195 }
  ],
  NL: [
    { limit: 43198, rate: 0.087 },
    { limit: 86395, rate: 0.145 },
    { limit: 154244, rate: 0.158 },
    { limit: 215943, rate: 0.178 },
    { limit: 275870, rate: 0.198 },
    { limit: 551739, rate: 0.208 },
    { limit: 1103478, rate: 0.213 },
    { limit: Infinity, rate: 0.218 }
  ],
  NS: [
    { limit: 29590, rate: 0.0879 },
    { limit: 59180, rate: 0.1495 },
    { limit: 93000, rate: 0.1667 },
    { limit: 150000, rate: 0.175 },
    { limit: Infinity, rate: 0.21 }
  ],
  NT: [
    { limit: 50597, rate: 0.059 },
    { limit: 101198, rate: 0.086 },
    { limit: 164525, rate: 0.122 },
    { limit: Infinity, rate: 0.1405 }
  ],
  NU: [
    { limit: 53268, rate: 0.04 },
    { limit: 106537, rate: 0.07 },
    { limit: 173205, rate: 0.09 },
    { limit: Infinity, rate: 0.115 }
  ],
  ON: [
    { limit: 51446, rate: 0.0505 },
    { limit: 102894, rate: 0.0915 },
    { limit: 150000, rate: 0.1116 },
    { limit: 220000, rate: 0.1216 },
    { limit: Infinity, rate: 0.1316 }
  ],
  PE: [
    { limit: 32656, rate: 0.0965 },
    { limit: 64313, rate: 0.1363 },
    { limit: 105000, rate: 0.1665 },
    { limit: 140000, rate: 0.18 },
    { limit: Infinity, rate: 0.1875 }
  ],
  QC: [
    { limit: 51780, rate: 0.14 },
    { limit: 103545, rate: 0.19 },
    { limit: 126000, rate: 0.24 },
    { limit: Infinity, rate: 0.2575 }
  ],
  SK: [
    { limit: 52057, rate: 0.105 },
    { limit: 148734, rate: 0.125 },
    { limit: Infinity, rate: 0.145 }
  ],
  YT: [
    { limit: 55867, rate: 0.064 },
    { limit: 111733, rate: 0.09 },
    { limit: 173205, rate: 0.109 },
    { limit: 500000, rate: 0.128 },
    { limit: Infinity, rate: 0.15 }
  ]
};

// Basic Personal Amounts 2024
const FEDERAL_BPA = 15705;
const PROVINCIAL_BPA = {
  AB: 21003,
  BC: 12580,
  MB: 15780,
  NB: 13044,
  NL: 10818,
  NS: 8481,
  NT: 17373,
  NU: 18767,
  ON: 12399,
  PE: 13500,
  QC: 18056,
  SK: 18491,
  YT: 15705
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