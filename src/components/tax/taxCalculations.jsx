// =======================
// 2025 Canada Tax Calculator (Non-QC) — High-Accuracy Core
// Inputs supported: income types, deductions list, credits list (+ spouseNetIncome), province/territory
// Notes:
// - This models personal income tax + CPP/EI + core non-refundable credits you collect.
// - It intentionally does NOT model dividend gross-up/credit, capital gains inclusion,
//   refundable credits, provincial low-income reductions, or province-specific boutique credits.
// =======================

// ---------- Federal brackets (2025) ----------
const FEDERAL_BRACKETS = [
  { limit: 57375, rate: 0.145 },
  { limit: 114750, rate: 0.205 },
  { limit: 177882, rate: 0.26 },
  { limit: 253414, rate: 0.29 },
  { limit: Infinity, rate: 0.33 }
];

// ---------- CPP (2025) ----------
const CPP_BASIC_EXEMPTION = 3500;
const CPP_YMPE = 71300;          // YMPE 2025
const CPP_YAMPE = 81200;         // YAMPE 2025 (Second ceiling)
const CPP_RATE_EMPLOYEE = 0.0595;
const CPP_MAX_EMPLOYEE = 4034.10;
const CPP2_RATE_EMPLOYEE = 0.04;
const CPP2_MAX_EMPLOYEE = 396.00;

// Self-employed CPP: pays both halves (rates doubled)
const CPP_RATE_SELFEMP = 0.119;
const CPP_MAX_SELFEMP = 8068.20;
const CPP2_RATE_SELFEMP = 0.08;
const CPP2_MAX_SELFEMP = 792.00;

// ---------- EI (2025) ----------
const EI_MAX_INSURABLE = 65700;
const EI_RATE = 0.0164;
const EI_MAX_PREMIUM = 1077.48;
const EI_RATE_QC = 0.0131;
const EI_MAX_PREMIUM_QC = 860.67; // 

const CANADA_EMPLOYMENT_AMOUNT = 1471;

// ---------- Helper: bracket tax ----------
function calculateTaxFromBrackets(income, brackets) {
  let tax = 0;
  let prev = 0;

  for (const b of brackets) {
    if (income <= prev) break;
    const slice = Math.min(income, b.limit) - prev;
    if (slice > 0) tax += slice * b.rate;
    prev = b.limit;
    if (income <= b.limit) break;
  }
  return tax;
}

function getMarginalRate(income, brackets) {
  for (const b of brackets) {
    if (income <= b.limit) return b.rate;
  }
  return brackets[brackets.length - 1].rate;
}

// ---------- Federal BPA reduction (2025) ----------
function federalBasicPersonalAmount(netIncome) {
  // Full BPA: 16,129; reduced to 14,538 between 177,882 and 253,414
  const BPA_FULL = 16129;
  const BPA_LOW = 14538;
  const START = 177882;
  const END = 253414;

  if (netIncome <= START) return BPA_FULL;
  if (netIncome >= END) return BPA_LOW;

  const t = (netIncome - START) / (END - START);
  return BPA_FULL - t * (BPA_FULL - BPA_LOW);
}

// Same reduction concept applies to spouse/partner federal max amount
function federalSpouseMaxAmount(netIncome) {
  // In practice this tracks federal BPA amounts for the spouse amount.
  return federalBasicPersonalAmount(netIncome);
}

// ---------- Ontario surtax + health premium (2025) ----------
function ontarioSurtax(basicOntarioTaxPayable) {
  // CRA (2025): thresholds $5,710 and $7,307; 20% then +36%
  const T1 = 5710;
  const T2 = 7307;

  if (basicOntarioTaxPayable <= T1) return 0;

  const part1 = 0.20 * (basicOntarioTaxPayable - T1);
  if (basicOntarioTaxPayable <= T2) return part1;

  const part2 = 0.36 * (basicOntarioTaxPayable - T2);
  return part1 + part2;
}

function ontarioHealthPremium(taxableIncome) {
  // CRA (2024 & 2025): piecewise premium up to $900
  const x = taxableIncome;
  if (x <= 20000) return 0;
  if (x <= 36000) return Math.min(300, 0.06 * (x - 20000));
  if (x <= 48000) return Math.min(450, 300 + 0.06 * (x - 36000));
  if (x <= 72000) return Math.min(600, 450 + 0.25 * (x - 48000));
  if (x <= 200000) return Math.min(750, 600 + 0.25 * (x - 72000));
  return Math.min(900, 750 + 0.25 * (x - 200000));
}

// ---------- Province/Territory brackets (2025) (non-QC) ----------
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
  SK: [
    { limit: 53463, rate: 0.105 },
    { limit: 152750, rate: 0.125 },
    { limit: Infinity, rate: 0.145 }
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
  YT: [
    { limit: 57375, rate: 0.064 },
    { limit: 114750, rate: 0.09 },
    { limit: 177882, rate: 0.109 },
    { limit: 500000, rate: 0.128 },
    { limit: Infinity, rate: 0.15 }
  ]
};

// ---------- Non-refundable credit “data” (2025) from KPMG (non-QC) ----------
const CREDIT_DATA = {
  // KPMG: credit rate applied to credits, BPA, spouse max, disability, age + threshold, medical threshold, tuition yes/no, donation credit rates
  FED: {
    creditRate: 0.145,
    // BPA handled via function (reduction at high income)
    disabilityAmount: 10138,
    ageAmount: 9028,
    ageThreshold: 45522,
    medicalFixedThreshold: 2834,
    tuitionEligible: true,
    donation: {
      first200Rate: 0.145,
      // balance is 29% normally, 33% only to extent income exceeds 253,414 (handled by function)
      balanceRate: 0.29,
      highRate: 0.33,
      highIncomeStart: 253414
    }
  },

  BC: {
    creditRate: 0.0506,
    bpa: 12932,
    spouseMax: 11073,
    disabilityAmount: 9699,
    ageAmount: 5799,
    ageThreshold: 43169,
    medicalFixedThreshold: 2689,
    tuitionEligible: true,
    donation: { first200Rate: 0.0506, balanceRate: 0.168, highRate: 0.205, highIncomeStart: 259829 } //
  },

  AB: {
    creditRate: 0.08,
    bpa: 22323,
    spouseMax: 22323,
    disabilityAmount: 17219,
    ageAmount: 6221,
    ageThreshold: 46308,
    medicalFixedThreshold: 2884,
    tuitionEligible: true,
    donation: { first200Rate: 0.10, balanceRate: 0.21 } // KPMG table shows 10.50% SK, 10.80 MB etc; AB donation is 10%/21%
  },

  SK: {
    creditRate: 0.105,
    bpa: 19491,
    spouseMax: 19491,
    disabilityAmount: 13986,
    ageAmount: 5785,
    ageThreshold: 43066,
    medicalFixedThreshold: 2681,
    tuitionEligible: false,
    donation: { first200Rate: 0.105, balanceRate: 0.145 } //
  },

  MB: {
    creditRate: 0.108,
    bpa: 15780,
    spouseMax: 9134,
    disabilityAmount: 6180,
    ageAmount: 3728,
    ageThreshold: 27749,
    medicalFixedThreshold: 1728,
    tuitionEligible: true,
    donation: { first200Rate: 0.108, balanceRate: 0.174 }, //
    // Manitoba BPA phaseout: 200k–400k to nil
    bpaPhaseout: { start: 200000, end: 400000 }
  },

  ON: {
    creditRate: 0.0505,
    bpa: 12747,
    spouseMax: 10823,
    disabilityAmount: 10298,
    ageAmount: 6223,
    ageThreshold: 46330,
    medicalFixedThreshold: 2885,
    tuitionEligible: false,
    donation: { first200Rate: 0.0505, balanceRate: 0.1116 } // surtax effect handled via ON surtax calc
  },

  NB: {
    creditRate: 0.094,
    bpa: 13396,
    spouseMax: 10499,
    disabilityAmount: 10010,
    ageAmount: 6037,
    ageThreshold: 44945,
    medicalFixedThreshold: 2798,
    tuitionEligible: true,
    donation: { first200Rate: 0.094, balanceRate: 0.1795 } //
  },

  NS: {
    creditRate: 0.0879,
    bpa: 11744,
    spouseMax: 11744,
    disabilityAmount: 7341,
    ageAmount: 5734,
    ageThreshold: 30828,
    medicalFixedThreshold: 1637,
    tuitionEligible: true,
    donation: { first200Rate: 0.0879, balanceRate: 0.21 } //
  },

  PE: {
    creditRate: 0.095,
    bpa: 14650,
    spouseMax: 12443,
    disabilityAmount: 6890,
    ageAmount: 6510,
    ageThreshold: 36600,
    medicalFixedThreshold: 1678,
    tuitionEligible: true,
    donation: { first200Rate: 0.095, balanceRate: 0.19 } //
  },

  NL: {
    creditRate: 0.087,
    bpa: 11067,
    spouseMax: 9043,
    disabilityAmount: 7467,
    ageAmount: 7064,
    ageThreshold: 38712,
    medicalFixedThreshold: 2410,
    tuitionEligible: true,
    donation: { first200Rate: 0.087, balanceRate: 0.218 } //
  },

  YT: {
    creditRate: 0.064,
    bpa: 16129,
    spouseMax: 16129,
    disabilityAmount: 10138,
    ageAmount: 9028,
    ageThreshold: 45522,
    medicalFixedThreshold: 2834,
    tuitionEligible: true, // Yukon provides federal employment credit; tuition generally yes per KPMG note set
    donation: { first200Rate: 0.064, balanceRate: 0.15 } //
  },

  NT: {
    creditRate: 0.059,
    bpa: 17842,
    spouseMax: 17842,
    disabilityAmount: 14469,
    ageAmount: 8727,
    ageThreshold: 45522,
    medicalFixedThreshold: 2834,
    tuitionEligible: true,
    donation: { first200Rate: 0.059, balanceRate: 0.1405 } //
  },

  NU: {
    creditRate: 0.04,
    bpa: 19274,
    spouseMax: 19274,
    disabilityAmount: 16405,
    ageAmount: 12303,
    ageThreshold: 45522,
    medicalFixedThreshold: 2834,
    tuitionEligible: true,
    donation: { first200Rate: 0.04, balanceRate: 0.115 } //
  }
};

// Manitoba BPA phaseout helper (per KPMG note)
function applyBpaPhaseout(amount, netIncome, phaseout) {
  if (!phaseout) return amount;
  const { start, end } = phaseout;
  if (netIncome <= start) return amount;
  if (netIncome >= end) return 0;
  const t = (netIncome - start) / (end - start);
  return amount * (1 - t);
}

// Federal donation credit helper: 33% applies only to extent income exceeds 253,414
function federalDonationCredit(donations, netIncome) {
  if (!donations || donations <= 0) return 0;

  const first200 = Math.min(donations, 200);
  const over200 = Math.max(0, donations - 200);

  const firstPart = first200 * CREDIT_DATA.FED.donation.first200Rate;

  // Portion eligible for 33% is capped by "income over 253,414"
  const highRoom = Math.max(0, netIncome - CREDIT_DATA.FED.donation.highIncomeStart);
  const highPortion = Math.min(over200, highRoom);
  const normalPortion = over200 - highPortion;

  const overPart =
    normalPortion * CREDIT_DATA.FED.donation.balanceRate +
    highPortion * CREDIT_DATA.FED.donation.highRate;

  return firstPart + overPart;
}

function provincialDonationCredit(provCode, donations, netIncome) {
  if (!donations || donations <= 0) return 0;

  const d = CREDIT_DATA[provCode]?.donation;
  if (!d) return 0;

  const first200 = Math.min(donations, 200);
  const over200 = Math.max(0, donations - 200);

  const firstPart = first200 * d.first200Rate;

  // Some provinces have an additional higher rate at the very top (e.g., BC)
  if (d.highRate != null && d.highIncomeStart != null) {
    const highRoom = Math.max(0, netIncome - d.highIncomeStart);
    const highPortion = Math.min(over200, highRoom);
    const normalPortion = over200 - highPortion;
    return firstPart + normalPortion * d.balanceRate + highPortion * d.highRate;
  }

  return firstPart + over200 * d.balanceRate;
}

/**
 * Computes federal and provincial tax (approximate) for 2025.
 *
 * @param {Object} params
 * @param {string} params.province - Province code (e.g. "ON", "BC")
 *
 * @param {Object} [params.income] - Income sources
 * @param {number} [params.income.employment]
 * @param {number} [params.income.selfEmployment]
 * @param {number} [params.income.investment]
 * @param {number} [params.income.rental]
 * @param {number} [params.income.rrspWithdrawal]
 * @param {number} [params.income.pension]
 * @param {number} [params.income.eiIncome]
 * @param {number} [params.income.other]
 *
 * @param {Object} [params.deductions] - Deductions info
 * @param {number} [params.deductions.rrsp]
 * @param {number} [params.deductions.unionDues]
 * @param {number} [params.deductions.childcare]
 * @param {number} [params.deductions.movingExpenses]
 * @param {number} [params.deductions.supportPayments]
 * @param {number} [params.deductions.other]
 *
 * @param {Object} [params.credits] - Credits and other flags
 * @param {boolean} [params.credits.disableBasicPersonal]
 * @param {number} [params.credits.spouseNetIncome]
 * @param {boolean} [params.credits.spouseAmount]
 * @param {number} [params.credits.medicalExpenses]
 * @param {number} [params.credits.donations]
 * @param {boolean} [params.credits.age65Plus]
 * @param {boolean} [params.credits.disability]
 * @param {number} [params.credits.tuition]
 */
export function calculateTax({
  province, // non-QC
  income = {},
  deductions = {},
  credits = {}
}) {
  if (province === "QC") {
    throw new Error("QC not supported in this version (recommended separate QC calculator).");
  }

  const prov = CREDIT_DATA[province] ? province : "ON";
  const provBrackets = PROVINCIAL_BRACKETS[prov];

  // ---- Income aggregation (treated as ordinary income — see caveats) ----
  const employmentIncome = income.employment || 0;
  const selfEmploymentIncome = income.selfEmployment || 0;

  const totalIncome =
    employmentIncome +
    selfEmploymentIncome +
    (income.investment || 0) +
    (income.rental || 0) +
    (income.rrspWithdrawal || 0) +
    (income.pension || 0) +
    (income.eiIncome || 0) +
    (income.other || 0);

  // ---- Base deductions from user inputs ----
  const deductionItems = [];
  if (deductions.rrsp) deductionItems.push({ label: "RRSP Contributions", amount: deductions.rrsp });
  if (deductions.unionDues) deductionItems.push({ label: "Union/Professional Dues", amount: deductions.unionDues });
  if (deductions.childcare) deductionItems.push({ label: "Childcare Expenses", amount: deductions.childcare });
  if (deductions.movingExpenses) deductionItems.push({ label: "Moving Expenses", amount: deductions.movingExpenses });
  if (deductions.supportPayments) deductionItems.push({ label: "Support Payments", amount: deductions.supportPayments });
  if (deductions.other) deductionItems.push({ label: "Other Deductions", amount: deductions.other });

  let totalDeductions = deductionItems.reduce((s, x) => s + x.amount, 0);

  // ---- CPP & EI (employment) ----
  const cpp1BaseEmp = Math.max(0, Math.min(employmentIncome, CPP_YMPE) - CPP_BASIC_EXEMPTION);
  const cpp1Emp = Math.min(cpp1BaseEmp * CPP_RATE_EMPLOYEE, CPP_MAX_EMPLOYEE);

  const cpp2BaseEmp = Math.max(0, Math.min(employmentIncome, CPP_YAMPE) - CPP_YMPE);
  const cpp2Emp = Math.min(cpp2BaseEmp * CPP2_RATE_EMPLOYEE, CPP2_MAX_EMPLOYEE);

  const cppEmpTotal = cpp1Emp + cpp2Emp;

  const eiRate = prov === "QC" ? EI_RATE_QC : EI_RATE;
  const eiMax = prov === "QC" ? EI_MAX_PREMIUM_QC : EI_MAX_PREMIUM;
  const eiPremium = employmentIncome > 0
    ? Math.min(Math.min(employmentIncome, EI_MAX_INSURABLE) * eiRate, eiMax)
    : 0;

  // ---- CPP (self-employment) — must account for CPP already covered by employment ----
  // Key idea: compute remaining CPP room (CPP1 and CPP2) after employment earnings.
  // Then apply self-employed (double) rates ONLY to that remaining room.

  const combinedForCpp1 = Math.min(employmentIncome + selfEmploymentIncome, CPP_YMPE);

  // CPP1 pensionable bases (basic exemption applies once across combined earnings)
  const cpp1BaseCombined = Math.max(0, combinedForCpp1 - CPP_BASIC_EXEMPTION);

  // Remaining CPP1 base that wasn't already pensionable through employment
  const cpp1BaseRemaining = Math.max(0, cpp1BaseCombined - cpp1BaseEmp);

  // Self-employed CPP1 on remaining room (both halves)
  const cpp1SE = Math.min(cpp1BaseRemaining * CPP_RATE_SELFEMP, CPP_MAX_SELFEMP);

  // CPP2 bases: above YMPE up to YAMPE (no basic exemption here)
  const combinedForCpp2 = Math.min(employmentIncome + selfEmploymentIncome, CPP_YAMPE);

  const cpp2BaseCombined = Math.max(0, combinedForCpp2 - CPP_YMPE);

  // Remaining CPP2 base not already covered via employment
  const cpp2BaseRemaining = Math.max(0, cpp2BaseCombined - cpp2BaseEmp);

  // Self-employed CPP2 on remaining room (both halves)
  const cpp2SE = Math.min(cpp2BaseRemaining * CPP2_RATE_SELFEMP, CPP2_MAX_SELFEMP);

  const cppSelfEmpTotal = cpp1SE + cpp2SE;

  // Half of self-employed CPP is deductible
  const cppSelfEmpDeduction = cppSelfEmpTotal / 2;
  if (cppSelfEmpDeduction > 0) {
    deductionItems.push({ label: "CPP (Self-employed) – deductible half", amount: cppSelfEmpDeduction });
    totalDeductions += cppSelfEmpDeduction;
  }


  // ---- Taxable/net income approximation ----
  // For your input set, we treat taxableIncome ~= netIncome for credit threshold purposes.
  const taxableIncome = Math.max(0, totalIncome - totalDeductions);
  const netIncomeForCredits = taxableIncome;

  // ===================
  // Federal tax
  // ===================
  let federalTax = calculateTaxFromBrackets(taxableIncome, FEDERAL_BRACKETS);

  const fedCreditRate = CREDIT_DATA.FED.creditRate;

  // BPA with high-income reduction
  const fedBpa = credits.disableBasicPersonal ? 0 : federalBasicPersonalAmount(netIncomeForCredits);

  // Spouse/partner amount (user supplies spouse net income)
  const spouseNetIncome = credits.spouseNetIncome || 0;
  const fedSpouseMax = credits.spouseAmount ? federalSpouseMaxAmount(netIncomeForCredits) : 0;
  const fedSpouseBase = credits.spouseAmount ? Math.max(0, fedSpouseMax - spouseNetIncome) : 0;

  const canadaEmploymentAmount =
    employmentIncome > 0 ? Math.min(CANADA_EMPLOYMENT_AMOUNT, employmentIncome) : 0;

  // CPP/EI credits:
  // - employment CPP and EI fully creditable
  // - self-employed CPP: only half is creditable (other half deducted)
  const cppCreditBase = cppEmpTotal + (cppSelfEmpTotal / 2);
  const eiCreditBase = eiPremium;

  // Medical expenses: claimable = expenses - min(3% net income, fixed threshold)
  let claimableMedical = 0;
  if (credits.medicalExpenses) {
    const fixed = CREDIT_DATA.FED.medicalFixedThreshold;
    const thresh = Math.min(netIncomeForCredits * 0.03, fixed);
    claimableMedical = Math.max(0, credits.medicalExpenses - thresh);
  }

  // Donations: corrected 33% logic
  const fedDonationCredit = federalDonationCredit(credits.donations || 0, netIncomeForCredits);

  // Age 65+: reduced by 15% of net income over threshold
  let fedAgeBase = 0;
  if (credits.age65Plus) {
    const A = CREDIT_DATA.FED.ageAmount;
    const T = CREDIT_DATA.FED.ageThreshold;
    fedAgeBase = Math.max(0, A - 0.15 * Math.max(0, netIncomeForCredits - T));
  }

  const fedDisabilityBase = credits.disability ? CREDIT_DATA.FED.disabilityAmount : 0;

  const federalCreditItems = [];
  if (fedBpa > 0) federalCreditItems.push({ label: "Basic Personal Amount", amount: fedBpa * fedCreditRate });
  if (fedSpouseBase > 0) federalCreditItems.push({ label: "Spouse/Partner Amount", amount: fedSpouseBase * fedCreditRate });
  if (canadaEmploymentAmount > 0) federalCreditItems.push({ label: "Canada Employment Amount", amount: canadaEmploymentAmount * fedCreditRate });
  if (cppCreditBase > 0) federalCreditItems.push({ label: "CPP (creditable)", amount: cppCreditBase * fedCreditRate });
  if (eiCreditBase > 0) federalCreditItems.push({ label: "EI Premiums", amount: eiCreditBase * fedCreditRate });
  if (claimableMedical > 0) federalCreditItems.push({ label: "Medical Expenses", amount: claimableMedical * fedCreditRate });
  if (credits.tuition) federalCreditItems.push({ label: "Tuition", amount: credits.tuition * fedCreditRate });
  if (fedDisabilityBase > 0) federalCreditItems.push({ label: "Disability", amount: fedDisabilityBase * fedCreditRate });
  if (fedAgeBase > 0) federalCreditItems.push({ label: "Age 65+", amount: fedAgeBase * fedCreditRate });
  if ((credits.donations || 0) > 0) federalCreditItems.push({ label: "Charitable Donations", amount: fedDonationCredit });

  const federalCreditsTotal = federalCreditItems.reduce((s, x) => s + x.amount, 0);
  federalTax = Math.max(0, federalTax - federalCreditsTotal);

  // ===================
  // Provincial/territorial tax (non-QC)
  // ===================
  let provincialTax = calculateTaxFromBrackets(taxableIncome, provBrackets);

  const pdata = CREDIT_DATA[prov];
  const pRate = pdata.creditRate;

  // Provincial BPA (with Manitoba phaseout)
  let provBpa = credits.disableBasicPersonal ? 0 : pdata.bpa;
  provBpa = applyBpaPhaseout(provBpa, netIncomeForCredits, pdata.bpaPhaseout);

  // Provincial spouse/partner amount
  const provSpouseMax = credits.spouseAmount ? pdata.spouseMax : 0;
  const provSpouseBase = credits.spouseAmount ? Math.max(0, provSpouseMax - spouseNetIncome) : 0;

  // Provincial medical (same claimable amount approach, but province fixed threshold differs)
  let provClaimableMedical = 0;
  if (credits.medicalExpenses) {
    const thresh = Math.min(netIncomeForCredits * 0.03, pdata.medicalFixedThreshold);
    provClaimableMedical = Math.max(0, credits.medicalExpenses - thresh);
  }

  // Provincial age amount
  let provAgeBase = 0;
  if (credits.age65Plus && pdata.ageAmount != null && pdata.ageThreshold != null) {
    provAgeBase = Math.max(0, pdata.ageAmount - 0.15 * Math.max(0, netIncomeForCredits - pdata.ageThreshold));
  }

  const provDisabilityBase = credits.disability ? (pdata.disabilityAmount || 0) : 0;

  // Tuition: only if eligible in that jurisdiction
  const provTuitionBase = (credits.tuition && pdata.tuitionEligible) ? credits.tuition : 0;

  // Donations (province-specific)
  const provDonationCredit = provincialDonationCredit(prov, credits.donations || 0, netIncomeForCredits);

  // CPP/EI provincial credits: most provinces apply lowest rate to base amounts.
  // Ontario’s payroll-withholding method can be more complex, but for annual tax the standard
  // non-refundable approach is still creditBase * lowestRate (then surtax/OHP applied).
  const provCppEiCreditValue = (cppCreditBase + eiCreditBase) * pRate;

  const provincialCreditItems = [];
  if (provBpa > 0) provincialCreditItems.push({ label: "Basic Personal Amount", amount: provBpa * pRate });
  if (provSpouseBase > 0) provincialCreditItems.push({ label: "Spouse/Partner Amount", amount: provSpouseBase * pRate });
  if (provCppEiCreditValue > 0) provincialCreditItems.push({ label: "CPP/EI (creditable)", amount: provCppEiCreditValue });
  if (provClaimableMedical > 0) provincialCreditItems.push({ label: "Medical Expenses", amount: provClaimableMedical * pRate });
  if (provTuitionBase > 0) provincialCreditItems.push({ label: "Tuition", amount: provTuitionBase * pRate });
  if (provDisabilityBase > 0) provincialCreditItems.push({ label: "Disability", amount: provDisabilityBase * pRate });
  if (provAgeBase > 0) provincialCreditItems.push({ label: "Age 65+", amount: provAgeBase * pRate });
  if ((credits.donations || 0) > 0) provincialCreditItems.push({ label: "Charitable Donations", amount: provDonationCredit });

  const provincialCreditsTotal = provincialCreditItems.reduce((s, x) => s + x.amount, 0);

  // Important: For Ontario, surtax depends on "basic provincial tax payable",
  // so we must subtract credits FIRST, then compute surtax.
  let basicProvTaxAfterCredits = Math.max(0, provincialTax - provincialCreditsTotal);

  if (prov === "ON") {
    const surtax = ontarioSurtax(basicProvTaxAfterCredits);
    const ohp = ontarioHealthPremium(taxableIncome);
    provincialTax = basicProvTaxAfterCredits + surtax + ohp;
  } else {
    provincialTax = basicProvTaxAfterCredits;
  }

  // ===================
  // Totals
  // ===================
  const totalTax = federalTax + provincialTax;

  // “Take-home” here = income - income taxes - employee CPP/EI - self-employed total CPP (both halves).
  // (Self-employed typically remits CPP via tax filing rather than payroll, but it’s still a cash outflow.)
  const takeHome = totalIncome - totalTax - cppEmpTotal - eiPremium - cppSelfEmpTotal;

  const federalMarginal = getMarginalRate(taxableIncome, FEDERAL_BRACKETS);
  const provincialMarginal = getMarginalRate(taxableIncome, provBrackets);
  const marginalRate = (federalMarginal + provincialMarginal) * 100;

  return {
    province: prov,
    totalIncome,
    totalDeductions,
    deductionItems,
    taxableIncome,

    federalTax,
    provincialTax,
    totalTax,

    cpp: {
      employment: cppEmpTotal,
      selfEmployment: cppSelfEmpTotal,
      selfEmploymentDeductibleHalf: cppSelfEmpDeduction,
      creditableBase: cppCreditBase
    },
    ei: { premium: eiPremium },

    takeHome,
    effectiveTaxRate: totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0,
    marginalRate,

    credits: {
      federal: { total: federalCreditsTotal, items: federalCreditItems },
      provincial: { total: provincialCreditsTotal, items: provincialCreditItems }
    }
  };
}