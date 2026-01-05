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
const CPP_YMPE = 71300; // Year's Maximum Pensionable Earnings
const CPP_RATE = 0.0595;
const CPP_MAX_CONTRIBUTION = 4034.10;

// CPP2 (Second Additional CPP) - starts above YMPE
const CPP2_UPPER_LIMIT = 81200; // Additional YMPE for 2025
const CPP2_RATE = 0.04;
const CPP2_MAX_CONTRIBUTION = 396.00;

const EI_MAX_INSURABLE = 63200;
const EI_RATE = 0.0166;
const EI_MAX_PREMIUM = 1077.48;
const EI_RATE_QC = 0.0132;
const EI_MAX_PREMIUM_QC = 834.24; // Quebec has lower rate

// Canada Employment Amount 2025
const CANADA_EMPLOYMENT_AMOUNT = 1471;

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
  // CPP1: On earnings from basic exemption to YMPE
  const cpp1Base = Math.max(0, Math.min(employmentIncome, CPP_YMPE) - CPP_BASIC_EXEMPTION);
  const cpp1Contribution = Math.min(cpp1Base * CPP_RATE, CPP_MAX_CONTRIBUTION);

  // CPP2: On earnings above YMPE up to upper limit
  const cpp2Base = Math.max(0, Math.min(employmentIncome, CPP2_UPPER_LIMIT) - CPP_YMPE);
  const cpp2Contribution = Math.min(cpp2Base * CPP2_RATE, CPP2_MAX_CONTRIBUTION);

  const cppContribution = cpp1Contribution + cpp2Contribution;

  // Calculate EI premiums (only on employment income)
  // Use Quebec rate if applicable, otherwise standard rate
  const eiRate = province === 'QC' ? EI_RATE_QC : EI_RATE;
  const eiMaxPremium = province === 'QC' ? EI_MAX_PREMIUM_QC : EI_MAX_PREMIUM;
  const eiPremium = employmentIncome > 0
    ? Math.min(employmentIncome * eiRate, eiMaxPremium)
    : 0;

  // Calculate total deductions (NOT including CPP and EI - those are credits)
  const deductionItems = [];
  if (deductions.rrsp) deductionItems.push({ label: 'RRSP Contributions', amount: deductions.rrsp });
  if (deductions.unionDues) deductionItems.push({ label: 'Union/Professional Dues', amount: deductions.unionDues });
  if (deductions.childcare) deductionItems.push({ label: 'Childcare Expenses', amount: deductions.childcare });
  if (deductions.movingExpenses) deductionItems.push({ label: 'Moving Expenses', amount: deductions.movingExpenses });
  if (deductions.supportPayments) deductionItems.push({ label: 'Support Payments', amount: deductions.supportPayments });
  if (deductions.other) deductionItems.push({ label: 'Other Deductions', amount: deductions.other });
  
  const totalDeductions = deductionItems.reduce((sum, item) => sum + item.amount, 0);

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

  // Build federal credit items
  const federalCreditItems = [];
  if (federalBPA > 0) federalCreditItems.push({ label: 'Basic Personal Amount', amount: federalBPA * 0.145 });
  if (canadaEmploymentAmount > 0) federalCreditItems.push({ label: 'Canada Employment Amount', amount: canadaEmploymentAmount * 0.145 });
  if (cppContribution > 0) federalCreditItems.push({ label: 'CPP Contribution Credit', amount: cppContribution * 0.145 });
  if (eiPremium > 0) federalCreditItems.push({ label: 'EI Premium Credit', amount: eiPremium * 0.145 });
  if (credits.medicalExpenses) federalCreditItems.push({ label: 'Medical Expenses', amount: credits.medicalExpenses * 0.145 });
  if (credits.donations) federalCreditItems.push({ label: 'Charitable Donations', amount: credits.donations * 0.145 });
  if (credits.tuition) federalCreditItems.push({ label: 'Tuition', amount: credits.tuition * 0.145 });
  if (credits.disability) federalCreditItems.push({ label: 'Disability Tax Credit', amount: 9428 * 0.145 });
  if (credits.age65Plus) federalCreditItems.push({ label: 'Age 65+ Credit', amount: 8790 * 0.145 });
  if (credits.spouseAmount) federalCreditItems.push({ label: 'Spouse/Partner Amount', amount: credits.spouseAmount * 0.145 });

  // Total federal credits at 14.5% (2025 rate)
  const federalCreditsAmount = federalCreditItems.reduce((sum, item) => sum + item.amount, 0);

  federalTax = Math.max(0, federalTax - federalCreditsAmount);

  // Calculate provincial tax
  const provincialBrackets = PROVINCIAL_BRACKETS[province] || PROVINCIAL_BRACKETS.ON;
  let provincialTax = calculateTaxFromBrackets(taxableIncome, provincialBrackets);

  // Apply provincial non-refundable tax credits
  const provincialBPA = credits.disableBasicPersonal ? 0 : (PROVINCIAL_BPA[province] || 0);
  const lowestProvRate = provincialBrackets[0].rate;
  
  // Build provincial credit items
  const provincialCreditItems = [];
  if (provincialBPA > 0) provincialCreditItems.push({ label: 'Provincial Basic Personal Amount', amount: provincialBPA * lowestProvRate });
  if (credits.medicalExpenses) provincialCreditItems.push({ label: 'Provincial Medical Expenses', amount: credits.medicalExpenses * lowestProvRate });
  if (credits.donations) provincialCreditItems.push({ label: 'Provincial Donations', amount: credits.donations * lowestProvRate });
  if (credits.tuition) provincialCreditItems.push({ label: 'Provincial Tuition', amount: credits.tuition * lowestProvRate });
  
  const provincialCreditsAmount = provincialCreditItems.reduce((sum, item) => sum + item.amount, 0);

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
    deductionItems,
    taxableIncome,
    federalTax,
    provincialTax,
    totalTax,
    cppContribution,
    eiPremium,
    netIncome,
    effectiveRate,
    marginalRate,
    provinceName: PROVINCE_NAMES[province] || province,
    credits: {
      federal: federalCreditsAmount,
      provincial: provincialCreditsAmount,
      total: federalCreditsAmount + provincialCreditsAmount,
      federalItems: federalCreditItems,
      provincialItems: provincialCreditItems
    }
  };
}