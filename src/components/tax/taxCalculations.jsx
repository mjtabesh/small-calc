// 2024 Canadian Federal Tax Brackets
const FEDERAL_BRACKETS = [
  { min: 0, max: 55867, rate: 0.15 },
  { min: 55867, max: 111733, rate: 0.205 },
  { min: 111733, max: 173205, rate: 0.26 },
  { min: 173205, max: 246752, rate: 0.29 },
  { min: 246752, max: Infinity, rate: 0.33 }
];

// 2024 Provincial Tax Brackets
const PROVINCIAL_BRACKETS = {
  AB: [
    { min: 0, max: 148269, rate: 0.10 },
    { min: 148269, max: 177922, rate: 0.12 },
    { min: 177922, max: 237230, rate: 0.13 },
    { min: 237230, max: 355845, rate: 0.14 },
    { min: 355845, max: Infinity, rate: 0.15 }
  ],
  BC: [
    { min: 0, max: 47937, rate: 0.0506 },
    { min: 47937, max: 95875, rate: 0.077 },
    { min: 95875, max: 110076, rate: 0.105 },
    { min: 110076, max: 133664, rate: 0.1229 },
    { min: 133664, max: 181232, rate: 0.147 },
    { min: 181232, max: 252752, rate: 0.168 },
    { min: 252752, max: Infinity, rate: 0.205 }
  ],
  MB: [
    { min: 0, max: 47000, rate: 0.108 },
    { min: 47000, max: 100000, rate: 0.1275 },
    { min: 100000, max: Infinity, rate: 0.174 }
  ],
  NB: [
    { min: 0, max: 49958, rate: 0.094 },
    { min: 49958, max: 99916, rate: 0.14 },
    { min: 99916, max: 185064, rate: 0.16 },
    { min: 185064, max: Infinity, rate: 0.195 }
  ],
  NL: [
    { min: 0, max: 43198, rate: 0.087 },
    { min: 43198, max: 86395, rate: 0.145 },
    { min: 86395, max: 154244, rate: 0.158 },
    { min: 154244, max: 215943, rate: 0.178 },
    { min: 215943, max: 275870, rate: 0.198 },
    { min: 275870, max: 551739, rate: 0.208 },
    { min: 551739, max: 1103478, rate: 0.213 },
    { min: 1103478, max: Infinity, rate: 0.218 }
  ],
  NS: [
    { min: 0, max: 29590, rate: 0.0879 },
    { min: 29590, max: 59180, rate: 0.1495 },
    { min: 59180, max: 93000, rate: 0.1667 },
    { min: 93000, max: 150000, rate: 0.175 },
    { min: 150000, max: Infinity, rate: 0.21 }
  ],
  NT: [
    { min: 0, max: 50597, rate: 0.059 },
    { min: 50597, max: 101198, rate: 0.086 },
    { min: 101198, max: 164525, rate: 0.122 },
    { min: 164525, max: Infinity, rate: 0.1405 }
  ],
  NU: [
    { min: 0, max: 53268, rate: 0.04 },
    { min: 53268, max: 106537, rate: 0.07 },
    { min: 106537, max: 173205, rate: 0.09 },
    { min: 173205, max: Infinity, rate: 0.115 }
  ],
  ON: [
    { min: 0, max: 51446, rate: 0.0505 },
    { min: 51446, max: 102894, rate: 0.0915 },
    { min: 102894, max: 150000, rate: 0.1116 },
    { min: 150000, max: 220000, rate: 0.1216 },
    { min: 220000, max: Infinity, rate: 0.1316 }
  ],
  PE: [
    { min: 0, max: 32656, rate: 0.0965 },
    { min: 32656, max: 64313, rate: 0.1363 },
    { min: 64313, max: 105000, rate: 0.1665 },
    { min: 105000, max: 140000, rate: 0.18 },
    { min: 140000, max: Infinity, rate: 0.1875 }
  ],
  QC: [
    { min: 0, max: 51780, rate: 0.14 },
    { min: 51780, max: 103545, rate: 0.19 },
    { min: 103545, max: 126000, rate: 0.24 },
    { min: 126000, max: Infinity, rate: 0.2575 }
  ],
  SK: [
    { min: 0, max: 52057, rate: 0.105 },
    { min: 52057, max: 148734, rate: 0.125 },
    { min: 148734, max: Infinity, rate: 0.145 }
  ],
  YT: [
    { min: 0, max: 55867, rate: 0.064 },
    { min: 55867, max: 111733, rate: 0.09 },
    { min: 111733, max: 173205, rate: 0.109 },
    { min: 173205, max: 500000, rate: 0.128 },
    { min: 500000, max: Infinity, rate: 0.15 }
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
  let remainingIncome = income;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(
      remainingIncome,
      bracket.max - bracket.min
    );
    
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }

  return tax;
}

function getMarginalRate(income, brackets) {
  for (const bracket of brackets) {
    if (income <= bracket.max) {
      return bracket.rate;
    }
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