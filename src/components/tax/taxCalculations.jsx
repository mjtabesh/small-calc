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

// 2025 CPP and EI Constants
const CPP_BASIC_EXEMPTION = 3500;
const CPP_MAX_PENSIONABLE = 68500;
const CPP_RATE = 0.0595;
const CPP_MAX_CONTRIBUTION = (CPP_MAX_PENSIONABLE - CPP_BASIC_EXEMPTION) * CPP_RATE;

const EI_MAX_INSURABLE = 63200;
const EI_RATE = 0.0166; // Standard rate (Quebec is 0.0132 but simplified here)
const EI_MAX_PREMIUM = EI_MAX_INSURABLE * EI_RATE;

// Canada Employment Amount 2025
const CANADA_EMPLOYMENT_AMOUNT = 1433;

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

  const employmentIncome = income.employment || 0;

  // Calculate CPP contributions (only on employment income)
  const cppContribution = employmentIncome > CPP_BASIC_EXEMPTION 
    ? Math.min(
        (Math.min(employmentIncome, CPP_MAX_PENSIONABLE) - CPP_BASIC_EXEMPTION) * CPP_RATE,
        CPP_MAX_CONTRIBUTION
      )
    : 0;

  // Calculate EI premiums (only on employment income)
  const eiPremium = employmentIncome > 0
    ? Math.min(employmentIncome * EI_RATE, EI_MAX_PREMIUM)
    : 0;

  // Calculate total deductions (including CPP and EI)
  const totalDeductions = 
    (deductions.rrsp || 0) +
    (deductions.unionDues || 0) +
    (deductions.childcare || 0) +
    (deductions.movingExpenses || 0) +
    (deductions.supportPayments || 0) +
    (deductions.other || 0) +
    cppContribution +
    eiPremium;

  // Calculate taxable income
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);

  // Calculate federal tax
  let federalTax = calculateTaxFromBrackets(taxableIncome, FEDERAL_BRACKETS);

  // Calculate federal non-refundable tax credits
  const federalBPA = credits.disableBasicPersonal ? 0 : FEDERAL_BPA;
  
  // Canada Employment Amount (if there's employment income)
  const canadaEmploymentAmount = employmentIncome > 0 
    ? Math.min(CANADA_EMPLOYMENT_AMOUNT, employmentIncome) 
    : 0;

  // CPP and EI contribution credits
  const cppEiCreditsAmount = cppContribution + eiPremium;

  // Total federal credits at 14.5% (2025 rate)
  const federalCreditsAmount = 
    federalBPA * 0.145 +
    canadaEmploymentAmount * 0.145 +
    cppEiCreditsAmount * 0.145 +
    (credits.medicalExpenses || 0) * 0.145 +
    (credits.donations || 0) * 0.145 +
    (credits.tuition || 0) * 0.145 +
    (credits.disability ? 9428 * 0.145 : 0) +
    (credits.age65Plus ? 8790 * 0.145 : 0) +
    (credits.spouseAmount || 0) * 0.145;

  federalTax = Math.max(0, federalTax - federalCreditsAmount);

  // Calculate provincial tax
  const provincialBrackets = PROVINCIAL_BRACKETS[province] || PROVINCIAL_BRACKETS.ON;
  let provincialTax = calculateTaxFromBrackets(taxableIncome, provincialBrackets);

  // Apply provincial non-refundable tax credits
  const provincialBPA = credits.disableBasicPersonal ? 0 : (PROVINCIAL_BPA[province] || 0);
  const lowestProvRate = provincialBrackets[0].rate;
  
  const provincialCreditsAmount = 
    provincialBPA * lowestProvRate +
    (credits.medicalExpenses || 0) * lowestProvRate +
    (credits.donations || 0) * lowestProvRate +
    (credits.tuition || 0) * lowestProvRate;

  provincialTax = Math.max(0, provincialTax - provincialCreditsAmount);

  // Quebec abatement (16.5% reduction in federal tax)
  if (province === 'QC') {
    federalTax = federalTax * 0.835;
  }

  const totalTax = federalTax + provincialTax;
  const netIncome = totalIncome - totalTax - cppContribution - eiPremium;
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
    cppContribution,
    eiPremium,
    netIncome,
    effectiveRate,
    marginalRate,
    provinceName: PROVINCE_NAMES[province] || province
  };
}