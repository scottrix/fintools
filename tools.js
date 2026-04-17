document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    loadTheme();
});

function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-items a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const toolId = this.getAttribute('data-tool');
            showTool(toolId);
            if (window.innerWidth <= 768) {
                toggleMobileMenu();
            }
        });
    });

    const firstCategory = document.querySelector('.category-header');
    if (firstCategory) {
        firstCategory.classList.add('active');
        firstCategory.nextElementSibling.classList.add('show');
    }
}

function toggleCategory(header) {
    const navItems = header.nextElementSibling;
    const isOpen = navItems.classList.contains('show');
    
    document.querySelectorAll('.nav-items').forEach(items => items.classList.remove('show'));
    document.querySelectorAll('.category-header').forEach(h => h.classList.remove('active'));
    
    if (!isOpen) {
        navItems.classList.add('show');
        header.classList.add('active');
    }
}

function showTool(toolId) {
    document.querySelectorAll('.tool-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    const toolPanel = document.getElementById(toolId);
    if (toolPanel) {
        toolPanel.classList.add('active');
    }
    
    document.querySelectorAll('.nav-items a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-tool') === toolId) {
            link.classList.add('active');
        }
    });
}

function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function scrollToCategory(index) {
    if (window.innerWidth <= 768) {
        toggleMobileMenu();
    }
    const categories = document.querySelectorAll('.category-header');
    if (categories[index]) {
        categories[index].click();
    }
}

function toggleTheme() {
    const root = document.documentElement;
    const icon = document.getElementById('theme-icon');
    
    if (root.classList.contains('light-mode')) {
        root.classList.remove('light-mode');
        icon.textContent = '🌙';
        localStorage.setItem('fintools-theme', 'dark');
    } else {
        root.classList.add('light-mode');
        icon.textContent = '☀️';
        localStorage.setItem('fintools-theme', 'light');
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('fintools-theme');
    const icon = document.getElementById('theme-icon');
    
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        if (icon) icon.textContent = '☀️';
    }
}

// Format number as currency
function formatCurrency(amount, decimals = 2) {
    return new Intl.NumberFormat('en-GB', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    }).format(amount);
}

// ==========================================
// CURRENCY CONVERTER
// ==========================================

const exchangeRates = {
  USD: { EUR: 0.92, GBP: 0.79, JPY: 154.5, AUD: 1.53, CAD: 1.36, CHF: 0.90, CNY: 7.24, INR: 83.5, MXN: 16.8, NZD: 1.66, SGD: 1.35, HKD: 7.82, KRW: 1365, ZAR: 18.5 },
  EUR: { USD: 1.09, GBP: 0.86, JPY: 168, AUD: 1.67, CAD: 1.48, CHF: 0.98, CNY: 7.88, INR: 90.8, MXN: 18.3, NZD: 1.81, SGD: 1.47, HKD: 8.51, KRW: 1485, ZAR: 20.1 },
  GBP: { USD: 1.27, EUR: 1.16, JPY: 195, AUD: 1.94, CAD: 1.72, CHF: 1.14, CNY: 9.15, INR: 105.5, MXN: 21.3, NZD: 2.10, SGD: 1.71, HKD: 9.89, KRW: 1725, ZAR: 23.4 },
  JPY: { USD: 0.0065, EUR: 0.0060, GBP: 0.0051, AUD: 0.0099, CAD: 0.0088, CHF: 0.0058, CNY: 0.047, INR: 0.54, MXN: 0.11, NZD: 0.011, SGD: 0.0087, HKD: 0.051, KRW: 8.85, ZAR: 0.12 },
  AUD: { USD: 0.65, EUR: 0.60, GBP: 0.52, JPY: 101, CAD: 0.89, CHF: 0.59, CNY: 4.73, INR: 54.5, MXN: 11.0, NZD: 1.09, SGD: 0.88, HKD: 5.11, KRW: 892, ZAR: 12.1 },
  CAD: { USD: 0.74, EUR: 0.68, GBP: 0.58, JPY: 113.5, AUD: 1.13, CHF: 0.66, CNY: 5.33, INR: 61.4, MXN: 12.4, NZD: 1.22, SGD: 0.99, HKD: 5.75, KRW: 1004, ZAR: 13.6 },
  CHF: { USD: 1.11, EUR: 1.02, GBP: 0.88, JPY: 172, AUD: 1.70, CAD: 1.51, CNY: 8.04, INR: 92.7, MXN: 18.7, NZD: 1.84, SGD: 1.50, HKD: 8.69, KRW: 1517, ZAR: 20.6 },
  CNY: { USD: 0.14, EUR: 0.13, GBP: 0.11, JPY: 21.3, AUD: 0.21, CAD: 0.19, CHF: 0.12, INR: 11.5, MXN: 2.32, NZD: 0.23, SGD: 0.19, HKD: 1.08, KRW: 188.5, ZAR: 2.56 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.85, AUD: 0.018, CAD: 0.016, CHF: 0.011, CNY: 0.087, MXN: 0.20, NZD: 0.020, SGD: 0.016, HKD: 0.094, KRW: 16.35, ZAR: 0.22 },
  MXN: { USD: 0.060, EUR: 0.055, GBP: 0.047, JPY: 9.19, AUD: 0.091, CAD: 0.081, CHF: 0.054, CNY: 0.43, INR: 4.97, NZD: 0.099, SGD: 0.080, HKD: 0.47, KRW: 81.3, ZAR: 1.10 },
  NZD: { USD: 0.60, EUR: 0.55, GBP: 0.48, JPY: 91.5, AUD: 0.92, CAD: 0.82, CHF: 0.54, CNY: 4.36, INR: 50.2, MXN: 10.1, SGD: 0.82, HKD: 4.72, KRW: 822, ZAR: 11.2 },
  SGD: { USD: 0.74, EUR: 0.68, GBP: 0.59, JPY: 114.5, AUD: 1.14, CAD: 1.01, CHF: 0.67, CNY: 5.36, INR: 61.8, MXN: 12.5, NZD: 1.22, HKD: 5.79, KRW: 1010, ZAR: 13.7 },
  HKD: { USD: 0.13, EUR: 0.12, GBP: 0.10, JPY: 19.8, AUD: 0.20, CAD: 0.17, CHF: 0.12, CNY: 0.93, INR: 10.7, MXN: 2.15, NZD: 0.21, SGD: 0.17, KRW: 174.5, ZAR: 2.37 },
  KRW: { USD: 0.00073, EUR: 0.00067, GBP: 0.00058, JPY: 0.113, AUD: 0.0011, CAD: 0.0010, CHF: 0.00066, CNY: 0.0053, INR: 0.061, MXN: 0.012, NZD: 0.0012, SGD: 0.00099, HKD: 0.0057, ZAR: 0.014 },
  ZAR: { USD: 0.054, EUR: 0.050, GBP: 0.043, JPY: 8.35, AUD: 0.083, CAD: 0.074, CHF: 0.049, CNY: 0.39, INR: 4.53, MXN: 0.91, NZD: 0.089, SGD: 0.073, HKD: 0.42, KRW: 73.8 }
};

let liveExchangeRates = null;
let exchangeRatesLastFetch = 0;
const EXCHANGE_RATES_CACHE_MS = 3600000;

async function fetchLiveExchangeRates() {
  const now = Date.now();
  if (liveExchangeRates && (now - exchangeRatesLastFetch) < EXCHANGE_RATES_CACHE_MS) {
    return liveExchangeRates;
  }
  
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    liveExchangeRates = data.rates;
    exchangeRatesLastFetch = now;
    return liveExchangeRates;
  } catch (e) {
    console.log('Using fallback exchange rates');
    return null;
  }
}

function convertCurrency() {
  const amount = parseFloat(document.getElementById('currency-amount').value) || 0;
  const from = document.getElementById('currency-from').value;
  const to = document.getElementById('currency-to').value;

  fetchLiveExchangeRates().then(rates => {
    let result, rate;
    
    if (rates) {
      if (from === to) {
        result = amount;
        rate = 1;
      } else {
        const fromRate = rates[from] || 1;
        const toRate = rates[to] || 1;
        rate = toRate / fromRate;
        result = amount * rate;
      }
      document.getElementById('rate-info').innerHTML = 
        `<strong>1 ${from}</strong> = <strong>${rate.toFixed(4)} ${to}</strong><br>
        <span style="font-size: 12px; color: var(--success);">✓ Live rates</span>`;
    } else {
      if (from === to) {
        result = amount;
        rate = 1;
      } else {
        rate = exchangeRates[from]?.[to] || 1;
        result = amount * rate;
      }
      document.getElementById('rate-info').innerHTML = 
        `<strong>1 ${from}</strong> = <strong>${rate.toFixed(4)} ${to}</strong><br>
        <span style="font-size: 12px; color: var(--text-secondary);">Using cached rates</span>`;
    }
    
    document.getElementById('currency-result').value = result.toFixed(4);
  });
}

function swapCurrencies() {
    const fromSelect = document.getElementById('currency-from');
    const toSelect = document.getElementById('currency-to');
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    convertCurrency();
}

// ==========================================
// MORTGAGE CALCULATOR
// ==========================================

function calculateMortgage() {
    const price = parseFloat(document.getElementById('mortgage-price').value) || 0;
    const deposit = parseFloat(document.getElementById('mortgage-deposit').value) || 0;
    const rate = parseFloat(document.getElementById('mortgage-rate').value) || 0;
    const term = parseInt(document.getElementById('mortgage-term').value) || 0;
    
    const loan = price - deposit;
    const monthlyRate = rate / 100 / 12;
    const numPayments = term * 12;
    
    let monthlyPayment;
    if (monthlyRate === 0) {
        monthlyPayment = loan / numPayments;
    } else {
        monthlyPayment = loan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
    
    const totalRepaid = monthlyPayment * numPayments;
    const totalInterest = totalRepaid - loan;
    const ltv = (loan / price) * 100;
    
    document.getElementById('mortgage-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Monthly Payment</div>
                <div class="value">£${formatCurrency(monthlyPayment)}</div>
            </div>
            <div class="result-item">
                <div class="label">Loan Amount</div>
                <div class="value">£${formatCurrency(loan)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Interest</div>
                <div class="value">£${formatCurrency(totalInterest)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Repaid</div>
                <div class="value">£${formatCurrency(totalRepaid)}</div>
            </div>
            <div class="result-item">
                <div class="label">LTV Ratio</div>
                <div class="value">${ltv.toFixed(1)}%</div>
            </div>
        </div>
    `;
}

// ==========================================
// UK TAX CALCULATOR
// ==========================================

const ukTaxBands = {
    2024: {
        personalAllowance: 12570,
        basicRate: 0.20,
        basicLimit: 50270,
        higherRate: 0.40,
        additionalRate: 0.45,
        additionalLimit: 125140,
        niPrimaryThreshold: 12570,
        niUpperThreshold: 50270,
        niLowerRate: 0.08,
        niUpperRate: 0.02,
        studentLoanThresholds: {
            plan1: 24990,
            plan2: 27295,
            plan4: 31565,
            plan5: 25000,
            postgrad: 21000
        },
        studentLoanRates: {
            plan1: 0.09,
            plan2: 0.09,
            plan4: 0.09,
            plan5: 0.09,
            postgrad: 0.06
        }
    },
    2023: {
        personalAllowance: 12570,
        basicRate: 0.20,
        basicLimit: 50270,
        higherRate: 0.40,
        additionalRate: 0.45,
        additionalLimit: 125140,
        niPrimaryThreshold: 12570,
        niUpperThreshold: 50270,
        niLowerRate: 0.12,
        niUpperRate: 0.02,
        studentLoanThresholds: {
            plan1: 22615,
            plan2: 27295,
            plan4: 27660,
            plan5: 25000,
            postgrad: 21000
        },
        studentLoanRates: {
            plan1: 0.09,
            plan2: 0.09,
            plan4: 0.09,
            plan5: 0.09,
            postgrad: 0.06
        }
    }
};

function calculateUKTax() {
    const taxYear = document.getElementById('uk-tax-year').value;
    const grossSalary = parseFloat(document.getElementById('uk-gross-salary').value) || 0;
    const pensionPercent = parseFloat(document.getElementById('uk-pension').value) || 0;
    const studentLoan = document.getElementById('uk-student-loan').value;
    
    const bands = ukTaxBands[taxYear];
    
    // Pension deduction
    const pension = grossSalary * (pensionPercent / 100);
    const taxableIncome = grossSalary - pension;
    
    // Adjust personal allowance for high earners
    let personalAllowance = bands.personalAllowance;
    if (taxableIncome > 100000) {
        personalAllowance = Math.max(0, personalAllowance - (taxableIncome - 100000) / 2);
    }
    
    // Calculate income tax
    const basicBand = bands.basicLimit - personalAllowance;
    let incomeTax = 0;
    let taxable = taxableIncome;
    
    // Personal allowance
    const taxFree = Math.min(taxable, personalAllowance);
    taxable -= taxFree;
    
    // Basic rate
    const basicAmount = Math.min(taxable, basicBand);
    incomeTax += basicAmount * bands.basicRate;
    taxable -= basicAmount;
    
    // Higher rate
    const higherAmount = Math.min(taxable, bands.additionalLimit - bands.basicLimit);
    incomeTax += higherAmount * bands.higherRate;
    taxable -= higherAmount;
    
    // Additional rate
    incomeTax += Math.max(0, taxable) * bands.additionalRate;
    
    // Calculate NI (Class 1)
    let ni = 0;
    const niEarnings = grossSalary;
    
    if (niEarnings > bands.niPrimaryThreshold) {
        const basicNI = Math.min(niEarnings, bands.niUpperThreshold) - bands.niPrimaryThreshold;
        ni += basicNI * bands.niLowerRate;
        
        if (niEarnings > bands.niUpperThreshold) {
            const upperNI = niEarnings - bands.niUpperThreshold;
            ni += upperNI * bands.niUpperRate;
        }
    }
    
    // Calculate student loan
    let studentLoanDeduction = 0;
    if (studentLoan !== 'none' && bands.studentLoanThresholds[studentLoan]) {
        const threshold = bands.studentLoanThresholds[studentLoan];
        const rate = bands.studentLoanRates[studentLoan];
        if (grossSalary > threshold) {
            studentLoanDeduction = (grossSalary - threshold) * rate;
        }
    }
    
    // Net pay
    const totalDeductions = incomeTax + ni + pension + studentLoanDeduction;
    const netAnnual = grossSalary - totalDeductions;
    const netMonthly = netAnnual / 12;
    
    document.getElementById('uk-tax-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Take Home (Monthly)</div>
                <div class="value">£${formatCurrency(netMonthly)}</div>
            </div>
            <div class="result-item result-highlight">
                <div class="label">Take Home (Annual)</div>
                <div class="value">£${formatCurrency(netAnnual)}</div>
            </div>
            <div class="result-item">
                <div class="label">Gross Salary</div>
                <div class="value">£${formatCurrency(grossSalary)}</div>
            </div>
        </div>
        
        <h3 style="margin-top: 25px; margin-bottom: 15px;">Tax Breakdown</h3>
        <div class="tax-breakdown">
            <div class="tax-row deduction">
                <span class="label">Income Tax</span>
                <span class="amount">-£${formatCurrency(incomeTax)}</span>
            </div>
            <div class="tax-row deduction">
                <span class="label">National Insurance</span>
                <span class="amount">-£${formatCurrency(ni)}</span>
            </div>
            <div class="tax-row deduction">
                <span class="label">Pension (${pensionPercent}%)</span>
                <span class="amount">-£${formatCurrency(pension)}</span>
            </div>
            ${studentLoanDeduction > 0 ? `
            <div class="tax-row deduction">
                <span class="label">Student Loan</span>
                <span class="amount">-£${formatCurrency(studentLoanDeduction)}</span>
            </div>
            ` : ''}
            <div class="tax-row" style="border-top: 2px solid var(--border); margin-top: 10px; padding-top: 15px;">
                <span class="label"><strong>Total Deductions</strong></span>
                <span class="amount"><strong>-£${formatCurrency(totalDeductions)}</strong></span>
            </div>
        </div>
    `;
}

// ==========================================
// COMPOUND INTEREST CALCULATOR
// ==========================================

function calculateCompoundInterest() {
    const principal = parseFloat(document.getElementById('ci-principal').value) || 0;
    const rate = parseFloat(document.getElementById('ci-rate').value) || 0;
    const years = parseInt(document.getElementById('ci-years').value) || 0;
    const frequency = parseInt(document.getElementById('ci-frequency').value) || 1;
    const monthlyContribution = parseFloat(document.getElementById('ci-monthly').value) || 0;
    
    const annualRate = rate / 100;
    const periodicRate = annualRate / frequency;
    
    // Future value of principal
    const fvPrincipal = principal * Math.pow(1 + periodicRate, frequency * years);
    
    // Future value of monthly contributions
    const periodicContribution = monthlyContribution * (frequency / 12);
    let fvContributions = 0;
    if (periodicRate > 0) {
        fvContributions = periodicContribution * ((Math.pow(1 + periodicRate, frequency * years) - 1) / periodicRate);
    }
    
    const totalValue = fvPrincipal + fvContributions;
    const totalContributions = principal + (monthlyContribution * 12 * years);
    const totalInterest = totalValue - totalContributions;
    
    // Generate yearly breakdown
    let breakdown = '<h3 style="margin-top: 25px; margin-bottom: 15px;">Year-by-Year Breakdown</h3>';
    breakdown += '<div class="tax-breakdown">';
    
    let runningTotal = principal;
    for (let year = 1; year <= years; year++) {
        const yearlyContribution = monthlyContribution * 12;
        runningTotal = (runningTotal + yearlyContribution) * Math.pow(1 + annualRate, 1);
        const interestThisYear = runningTotal - (principal + monthlyContribution * 12 * year);
        
        if (year <= 10 || year === years || year % 5 === 0) {
            breakdown += `
                <div class="tax-row">
                    <span class="label">Year ${year}</span>
                    <span class="amount">£${formatCurrency(runningTotal)}</span>
                </div>
            `;
        }
    }
    breakdown += '</div>';
    
    document.getElementById('ci-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Future Value</div>
                <div class="value">£${formatCurrency(totalValue)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Interest</div>
                <div class="value">£${formatCurrency(totalInterest)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Contributions</div>
                <div class="value">£${formatCurrency(totalContributions)}</div>
            </div>
            <div class="result-item">
                <div class="label">Interest Rate</div>
                <div class="value">${rate}%</div>
            </div>
        </div>
        ${breakdown}
    `;
}

// ==========================================
// SALARY CONVERTER
// ==========================================

function convertSalary() {
    const annual = parseFloat(document.getElementById('salary-annual').value) || 0;
    const hoursPerWeek = parseFloat(document.getElementById('salary-hours').value) || 40;
    const daysPerWeek = parseFloat(document.getElementById('salary-days').value) || 5;
    
    const monthly = annual / 12;
    const weekly = annual / 52;
    const daily = weekly / daysPerWeek;
    const hourly = weekly / hoursPerWeek;
    
    document.getElementById('salary-monthly').value = monthly.toFixed(2);
    document.getElementById('salary-weekly').value = weekly.toFixed(2);
    document.getElementById('salary-daily').value = daily.toFixed(2);
    document.getElementById('salary-hourly').value = hourly.toFixed(2);
}

// ==========================================
// LOAN CALCULATOR
// ==========================================

function calculateLoan() {
    const principal = parseFloat(document.getElementById('loan-amount').value) || 0;
    const annualRate = parseFloat(document.getElementById('loan-rate').value) || 0;
    const months = parseInt(document.getElementById('loan-term').value) || 0;
    
    const monthlyRate = annualRate / 100 / 12;
    
    let monthlyPayment;
    if (monthlyRate === 0) {
        monthlyPayment = principal / months;
    } else {
        monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }
    
    const totalRepaid = monthlyPayment * months;
    const totalInterest = totalRepaid - principal;
    
    document.getElementById('loan-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Monthly Payment</div>
                <div class="value">£${formatCurrency(monthlyPayment)}</div>
            </div>
            <div class="result-item">
                <div class="label">Loan Amount</div>
                <div class="value">£${formatCurrency(principal)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Interest</div>
                <div class="value">£${formatCurrency(totalInterest)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Repaid</div>
                <div class="value">£${formatCurrency(totalRepaid)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// INFLATION CALCULATOR
// ==========================================

// UK RPI inflation data (approximate)
const ukInflationData = {
    1980: 100, 1981: 111.9, 1982: 121.2, 1983: 126.6, 1984: 131.8, 1985: 137.9, 1986: 141.5, 1987: 147.1, 1988: 152.9, 1989: 163.0,
    1990: 179.4, 1991: 195.3, 1992: 203.7, 1993: 206.5, 1994: 211.8, 1995: 218.8, 1996: 225.2, 1997: 231.3, 1998: 239.3, 1999: 243.6,
    2000: 248.7, 2001: 253.0, 2002: 257.5, 2003: 262.1, 2004: 268.6, 2005: 274.8, 2006: 282.0, 2007: 291.8, 2008: 303.4, 2009: 304.8,
    2010: 313.5, 2011: 327.8, 2012: 340.1, 2013: 349.4, 2014: 356.8, 2015: 361.8, 2016: 368.2, 2017: 382.7, 2018: 393.6, 2019: 402.3,
    2020: 408.4, 2021: 419.9, 2022: 457.1, 2023: 486.7, 2024: 498.5
};

// US CPI inflation data (approximate)
const usInflationData = {
    1980: 82.4, 1981: 90.9, 1982: 96.5, 1983: 99.6, 1984: 103.9, 1985: 107.6, 1986: 109.6, 1987: 113.6, 1988: 118.3, 1989: 124.0,
    1990: 130.7, 1991: 136.2, 1992: 140.3, 1993: 144.5, 1994: 148.2, 1995: 152.4, 1996: 156.9, 1997: 160.5, 1998: 163.0, 1999: 166.6,
    2000: 172.2, 2001: 177.1, 2002: 179.9, 2003: 184.0, 2004: 188.9, 2005: 195.3, 2006: 201.6, 2007: 207.3, 2008: 215.3, 2009: 214.5,
    2010: 218.1, 2011: 224.9, 2012: 229.6, 2013: 233.0, 2014: 236.7, 2015: 237.0, 2016: 240.0, 2017: 245.1, 2018: 251.1, 2019: 255.7,
    2020: 258.8, 2021: 270.9, 2022: 292.6, 2023: 304.7, 2024: 312.3
};

function calculateInflation() {
    const amount = parseFloat(document.getElementById('inflation-amount').value) || 0;
    const fromYear = parseInt(document.getElementById('inflation-from-year').value) || 2010;
    const toYear = parseInt(document.getElementById('inflation-to-year').value) || 2024;
    const country = document.getElementById('inflation-country').value;
    
    const data = country === 'UK' ? ukInflationData : usInflationData;
    
    if (!data[fromYear] || !data[toYear]) {
        document.getElementById('inflation-results').innerHTML = '<p>Year data not available. Please select years between 1980 and 2024.</p>';
        return;
    }
    
    const inflationFactor = data[toYear] / data[fromYear];
    const adjustedAmount = amount * inflationFactor;
    const totalInflation = ((inflationFactor - 1) * 100);
    
    document.getElementById('inflation-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">${fromYear} Value in ${toYear}</div>
                <div class="value">£${formatCurrency(adjustedAmount)}</div>
            </div>
            <div class="result-item">
                <div class="label">Original Amount</div>
                <div class="value">£${formatCurrency(amount)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Inflation</div>
                <div class="value">${totalInflation.toFixed(1)}%</div>
            </div>
            <div class="result-item">
                <div class="label">Purchasing Power</div>
                <div class="value">${(100 / inflationFactor).toFixed(1)}%</div>
            </div>
        </div>
        <p style="margin-top: 20px; color: var(--text-secondary); font-size: 14px; text-align: center;">
            £${formatCurrency(amount)} in ${fromYear} would have the same purchasing power as £${formatCurrency(adjustedAmount)} in ${toYear}.
        </p>
    `;
}

// ==========================================
// CRYPTO CONVERTER
// ==========================================

const cryptoRates = {
  BTC: { USD: 67000, EUR: 61640, GBP: 52930, ETH: 22.5 },
  ETH: { USD: 3400, EUR: 3128, GBP: 2686, BTC: 0.044 },
  XRP: { USD: 0.52, EUR: 0.48, GBP: 0.41, BTC: 0.0000078 },
  ADA: { USD: 0.45, EUR: 0.41, GBP: 0.36, BTC: 0.0000067 },
  SOL: { USD: 145, EUR: 133, GBP: 115, BTC: 0.0022 },
  DOGE: { USD: 0.12, EUR: 0.11, GBP: 0.095, BTC: 0.0000018 },
  DOT: { USD: 7.20, EUR: 6.62, GBP: 5.69, BTC: 0.00011 },
  MATIC: { USD: 0.58, EUR: 0.53, GBP: 0.46, BTC: 0.0000087 },
  LINK: { USD: 14.50, EUR: 13.34, GBP: 11.46, BTC: 0.00022 },
  AVAX: { USD: 36, EUR: 33.12, GBP: 28.44, BTC: 0.00054 }
};

let liveCryptoRates = null;
let cryptoRatesLastFetch = 0;
const CRYPTO_RATES_CACHE_MS = 300000;

const cryptoIds = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  XRP: 'ripple',
  ADA: 'cardano',
  SOL: 'solana',
  DOGE: 'dogecoin',
  DOT: 'polkadot',
  MATIC: 'matic-network',
  LINK: 'chainlink',
  AVAX: 'avalanche-2'
};

async function fetchLiveCryptoRates() {
  const now = Date.now();
  if (liveCryptoRates && (now - cryptoRatesLastFetch) < CRYPTO_RATES_CACHE_MS) {
    return liveCryptoRates;
  }
  
  try {
    const ids = Object.values(cryptoIds).join(',');
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd,eur,gbp,btc`);
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    
    liveCryptoRates = {};
    for (const [symbol, id] of Object.entries(cryptoIds)) {
      if (data[id]) {
        liveCryptoRates[symbol] = {
          USD: data[id].usd,
          EUR: data[id].eur,
          GBP: data[id].gbp,
          BTC: data[id].btc
        };
      }
    }
    cryptoRatesLastFetch = now;
    return liveCryptoRates;
  } catch (e) {
    console.log('Using fallback crypto rates');
    return null;
  }
}

function calculateCrypto() {
  const amount = parseFloat(document.getElementById('crypto-amount').value) || 0;
  const from = document.getElementById('crypto-from').value;
  const to = document.getElementById('crypto-to').value;

  fetchLiveCryptoRates().then(rates => {
    let result;
    const activeRates = rates || cryptoRates;
    
    if (from === to) {
      result = amount;
    } else if (activeRates[from] && activeRates[from][to]) {
      result = amount * activeRates[from][to];
    } else if (activeRates[to] && activeRates[to][from]) {
      result = amount / activeRates[to][from];
    } else {
      result = 0;
    }

    document.getElementById('crypto-result').value = result.toFixed(8);
    
    const rateInfo = document.getElementById('crypto-rate-info');
    if (rateInfo) {
      const rate = from === to ? 1 : (activeRates[from]?.[to] || (activeRates[to]?.[from] ? 1/activeRates[to][from] : 0));
      const source = rates ? 
        '<span style="font-size: 12px; color: var(--success);">✓ Live rates (CoinGecko)</span>' :
        '<span style="font-size: 12px; color: var(--text-secondary);">Using cached rates</span>';
      rateInfo.innerHTML = `<strong>1 ${from}</strong> ≈ <strong>${rate.toFixed(8)} ${to}</strong><br>${source}`;
    }
  });
}

// ==========================================
// STAMP DUTY (UK)
// ==========================================

function calculateStampDuty() {
    const price = parseFloat(document.getElementById('stamp-price').value) || 0;
    const buyerType = document.getElementById('stamp-buyer-type').value;
    
    let tax = 0;
    let bands = [];
    
    if (buyerType === 'first') {
        // First-time buyer relief
        if (price <= 425000) {
            tax = 0;
            bands = [{ threshold: 425000, rate: 0, amount: 0 }];
        } else if (price <= 625000) {
            bands = [
                { threshold: 425000, rate: 0, amount: 0 },
                { threshold: 200000, rate: 0.05, amount: (price - 425000) * 0.05 }
            ];
            tax = (price - 425000) * 0.05;
        } else {
            bands = [
                { threshold: 425000, rate: 0, amount: 0 },
                { threshold: 200000, rate: 0.05, amount: 10000 },
                { threshold: 999999999, rate: 0.10, amount: (price - 625000) * 0.10 }
            ];
            tax = 10000 + (price - 625000) * 0.10;
        }
    } else if (buyerType === 'additional') {
        // Additional property (3% surcharge)
        bands = [
            { threshold: 125000, rate: 0.03, amount: Math.min(price, 125000) * 0.03 },
            { threshold: 125000, rate: 0.05, amount: Math.max(0, Math.min(price - 125000, 125000)) * 0.05 },
            { threshold: 675000, rate: 0.08, amount: Math.max(0, Math.min(price - 250000, 675000)) * 0.08 },
            { threshold: 575000, rate: 0.13, amount: Math.max(0, Math.min(price - 925000, 575000)) * 0.13 },
            { threshold: 999999999, rate: 0.15, amount: Math.max(0, price - 1500000) * 0.15 }
        ];
        tax = Math.min(price, 125000) * 0.03;
        tax += Math.max(0, Math.min(price - 125000, 125000)) * 0.05;
        tax += Math.max(0, Math.min(price - 250000, 675000)) * 0.08;
        tax += Math.max(0, Math.min(price - 925000, 575000)) * 0.13;
        tax += Math.max(0, price - 1500000) * 0.15;
    } else {
        // Standard rates
        tax = 0;
        if (price > 125000) tax += Math.min(price - 125000, 125000) * 0.02;
        if (price > 250000) tax += Math.min(price - 250000, 675000) * 0.05;
        if (price > 925000) tax += Math.min(price - 925000, 575000) * 0.10;
        if (price > 1500000) tax += (price - 1500000) * 0.12;
    }
    
    document.getElementById('stamp-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Stamp Duty</div>
                <div class="value">£${formatCurrency(tax)}</div>
            </div>
            <div class="result-item">
                <div class="label">Property Price</div>
                <div class="value">£${formatCurrency(price)}</div>
            </div>
            <div class="result-item">
                <div class="label">Effective Rate</div>
                <div class="value">${((tax / price) * 100).toFixed(2)}%</div>
            </div>
        </div>
    `;
}

// ==========================================
// RENT VS BUY
// ==========================================

function calculateRentVsBuy() {
    const rentMonthly = parseFloat(document.getElementById('rent-monthly').value) || 0;
    const propertyPrice = parseFloat(document.getElementById('rent-property-price').value) || 0;
    const deposit = parseFloat(document.getElementById('rent-deposit').value) || 0;
    const mortgageRate = parseFloat(document.getElementById('rent-mortgage-rate').value) || 0;
    const years = parseInt(document.getElementById('rent-years').value) || 0;
    const housePriceGrowth = parseFloat(document.getElementById('rent-house-growth').value) || 0;
    const rentGrowth = parseFloat(document.getElementById('rent-growth').value) || 0;
    const investmentReturn = parseFloat(document.getElementById('rent-investment-return').value) || 0;
    
    const loan = propertyPrice - deposit;
    const monthlyRate = mortgageRate / 100 / 12;
    const numPayments = years * 12;
    
    let monthlyMortgage;
    if (monthlyRate === 0) {
        monthlyMortgage = loan / numPayments;
    } else {
        monthlyMortgage = loan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }
    
    const totalMortgagePayments = monthlyMortgage * numPayments;
    const propertyValueEnd = propertyPrice * Math.pow(1 + housePriceGrowth / 100, years);
    const equityEnd = propertyValueEnd - loan;
    
    // Rent scenario
    let totalRent = 0;
    let currentRent = rentMonthly;
    for (let year = 0; year < years; year++) {
        totalRent += currentRent * 12;
        currentRent *= (1 + rentGrowth / 100);
    }
    
    // Investment scenario (if renting)
    const depositInvested = deposit * Math.pow(1 + investmentReturn / 100, years);
    const monthlySavings = monthlyMortgage - rentMonthly;
    let investedSavings = 0;
    if (monthlySavings > 0) {
        investedSavings = monthlySavings * 12 * ((Math.pow(1 + investmentReturn / 100, years) - 1) / (investmentReturn / 100));
    }
    
    const buyNetWorth = propertyValueEnd - loan - totalMortgagePayments + deposit;
    const rentNetWorth = depositInvested + investedSavings - totalRent;
    
    document.getElementById('rent-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight" style="background: ${buyNetWorth > rentNetWorth ? 'linear-gradient(135deg, #27ae60, #1e8449)' : 'var(--bg-card)'}">
                <div class="label">Buying Net Worth</div>
                <div class="value">£${formatCurrency(buyNetWorth)}</div>
            </div>
            <div class="result-item result-highlight" style="background: ${rentNetWorth > buyNetWorth ? 'linear-gradient(135deg, #27ae60, #1e8449)' : 'var(--bg-card)'}">
                <div class="label">Renting Net Worth</div>
                <div class="value">£${formatCurrency(rentNetWorth)}</div>
            </div>
            <div class="result-item">
                <div class="label">Monthly Mortgage</div>
                <div class="value">£${formatCurrency(monthlyMortgage)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Rent Paid</div>
                <div class="value">£${formatCurrency(totalRent)}</div>
            </div>
        </div>
        <p style="margin-top: 20px; color: var(--text-secondary); font-size: 14px; text-align: center;">
            ${buyNetWorth > rentNetWorth ? 
                `Buying is better by £${formatCurrency(buyNetWorth - rentNetWorth)} over ${years} years.` :
                `Renting is better by £${formatCurrency(rentNetWorth - buyNetWorth)} over ${years} years.`
            }
        </p>
    `;
}

// ==========================================
// AFFORDABILITY CALCULATOR
// ==========================================

function calculateAffordability() {
    const income1 = parseFloat(document.getElementById('aff-income1').value) || 0;
    const income2 = parseFloat(document.getElementById('aff-income2').value) || 0;
    const deposit = parseFloat(document.getElementById('aff-deposit').value) || 0;
    const monthlyDebt = parseFloat(document.getElementById('aff-debt').value) || 0;
    const interestRate = parseFloat(document.getElementById('aff-rate').value) || 5;
    
    const totalIncome = income1 + income2;
    const annualIncome = totalIncome;
    
    // Standard lending multiple (4.5x income, adjusted for debt)
    const maxBorrowing = Math.min(totalIncome * 4.5, totalIncome * 5 - (monthlyDebt * 12 * 5));
    const maxProperty = maxBorrowing + deposit;
    
    const monthlyRate = interestRate / 100 / 12;
    const monthlyPayment = maxBorrowing * (monthlyRate * Math.pow(1 + monthlyRate, 300)) / (Math.pow(1 + monthlyRate, 300) - 1);
    
    document.getElementById('aff-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Max Property Price</div>
                <div class="value">£${formatCurrency(maxProperty)}</div>
            </div>
            <div class="result-item">
                <div class="label">Max Borrowing</div>
                <div class="value">£${formatCurrency(maxBorrowing)}</div>
            </div>
            <div class="result-item">
                <div class="label">Est. Monthly Payment</div>
                <div class="value">£${formatCurrency(monthlyPayment)}</div>
            </div>
            <div class="result-item">
                <div class="label">LTV Ratio</div>
                <div class="value">${((maxBorrowing / maxProperty) * 100).toFixed(1)}%</div>
            </div>
        </div>
    `;
}

// ==========================================
// UK SELF-EMPLOYED TAX
// ==========================================

function calculateUKSelfEmployed() {
    const profit = parseFloat(document.getElementById('self-employed-profit').value) || 0;
    const taxYear = document.getElementById('self-employed-tax-year').value;
    
    const bands = ukTaxBands[taxYear] || ukTaxBands['2024'];
    
    // Class 2 NI (if applicable - £3.45/week for 2024/25)
    const class2NI = profit >= 12570 ? 179.40 : 0;
    
    // Class 4 NI
    let class4NI = 0;
    if (profit > bands.niPrimaryThreshold) {
        class4NI += Math.min(profit - bands.niPrimaryThreshold, bands.niUpperThreshold - bands.niPrimaryThreshold) * bands.niLowerRate;
        if (profit > bands.niUpperThreshold) {
            class4NI += (profit - bands.niUpperThreshold) * bands.niUpperRate;
        }
    }
    
    // Income tax (same as employed)
    let incomeTax = 0;
    let taxable = profit;
    const taxFree = Math.min(taxable, bands.personalAllowance);
    taxable -= taxFree;
    
    const basicBand = bands.basicLimit - bands.personalAllowance;
    const basicAmount = Math.min(taxable, basicBand);
    incomeTax += basicAmount * bands.basicRate;
    taxable -= basicAmount;
    
    const higherAmount = Math.min(taxable, bands.additionalLimit - bands.basicLimit);
    incomeTax += higherAmount * bands.higherRate;
    taxable -= higherAmount;
    
    incomeTax += Math.max(0, taxable) * bands.additionalRate;
    
    const totalTax = incomeTax + class2NI + class4NI;
    const netProfit = profit - totalTax;
    
    document.getElementById('self-employed-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Net Profit</div>
                <div class="value">£${formatCurrency(netProfit)}</div>
            </div>
            <div class="result-item">
                <div class="label">Income Tax</div>
                <div class="value">£${formatCurrency(incomeTax)}</div>
            </div>
            <div class="result-item">
                <div class="label">Class 4 NI</div>
                <div class="value">£${formatCurrency(class4NI)}</div>
            </div>
            <div class="result-item">
                <div class="label">Class 2 NI</div>
                <div class="value">£${formatCurrency(class2NI)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// UK DIVIDEND TAX
// ==========================================

function calculateUKDividend() {
    const dividends = parseFloat(document.getElementById('dividend-amount').value) || 0;
    const otherIncome = parseFloat(document.getElementById('dividend-other-income').value) || 0;
    const taxYear = document.getElementById('dividend-tax-year').value;
    
    const bands = ukTaxBands[taxYear] || ukTaxBands['2024'];
    
    const dividendAllowance = 500; // £500 for 2024/25
    const basicRate = 0.0875;
    const higherRate = 0.3375;
    const additionalRate = 0.3935;
    
    // Calculate how much of other income uses the tax bands
    let otherTaxable = otherIncome;
    const personalAllowanceRemaining = Math.max(0, bands.personalAllowance - otherTaxable);
    otherTaxable -= (bands.personalAllowance - personalAllowanceRemaining);
    
    const basicRemaining = Math.max(0, bands.basicLimit - bands.personalAllowance - Math.max(0, otherTaxable));
    
    let dividendTax = 0;
    let dividendTaxable = dividends;
    
    // Dividend allowance
    const taxFree = Math.min(dividendTaxable, dividendAllowance);
    dividendTaxable -= taxFree;
    
    // Basic rate
    const basicDividend = Math.min(dividendTaxable, basicRemaining);
    dividendTax += basicDividend * basicRate;
    dividendTaxable -= basicDividend;
    
    // Higher/additional rate
    const higherDividend = Math.min(dividendTaxable, bands.additionalLimit - bands.basicLimit);
    dividendTax += higherDividend * higherRate;
    dividendTaxable -= higherDividend;
    
    dividendTax += Math.max(0, dividendTaxable) * additionalRate;
    
    document.getElementById('dividend-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Dividend Tax</div>
                <div class="value">£${formatCurrency(dividendTax)}</div>
            </div>
            <div class="result-item">
                <div class="label">Gross Dividends</div>
                <div class="value">£${formatCurrency(dividends)}</div>
            </div>
            <div class="result-item">
                <div class="label">Tax-Free Allowance</div>
                <div class="value">£${formatCurrency(Math.min(dividends, dividendAllowance))}</div>
            </div>
            <div class="result-item">
                <div class="label">Taxable Dividends</div>
                <div class="value">£${formatCurrency(Math.max(0, dividends - dividendAllowance))}</div>
            </div>
        </div>
    `;
}

// ==========================================
// UK CAPITAL GAINS TAX
// ==========================================

function calculateUKCapitalGains() {
    const gain = parseFloat(document.getElementById('cg-gain').value) || 0;
    const assetType = document.getElementById('cg-asset-type').value;
    const income = parseFloat(document.getElementById('cg-income').value) || 0;
    
    const annualExempt = 3000; // £3,000 for 2024/25
    const residentialRate = income > 50270 ? 0.24 : 0.18;
    const otherRate = income > 50270 ? 0.20 : 0.10;
    
    const taxableGain = Math.max(0, gain - annualExempt);
    const rate = assetType === 'residential' ? residentialRate : otherRate;
    const tax = taxableGain * rate;
    
    document.getElementById('cg-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Capital Gains Tax</div>
                <div class="value">£${formatCurrency(tax)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Gain</div>
                <div class="value">£${formatCurrency(gain)}</div>
            </div>
            <div class="result-item">
                <div class="label">Annual Exempt</div>
                <div class="value">£${formatCurrency(Math.min(gain, annualExempt))}</div>
            </div>
            <div class="result-item">
                <div class="label">Tax Rate</div>
                <div class="value">${(rate * 100).toFixed(1)}%</div>
            </div>
        </div>
    `;
}

// ==========================================
// VAT CALCULATOR
// ==========================================

function calculateVAT() {
    const amount = parseFloat(document.getElementById('vat-amount').value) || 0;
    const rate = parseFloat(document.getElementById('vat-rate').value) || 20;
    const operation = document.getElementById('vat-operation').value;
    
    let net, vat, gross;
    
    if (operation === 'add') {
        net = amount;
        vat = amount * (rate / 100);
        gross = amount + vat;
    } else {
        gross = amount;
        net = amount / (1 + rate / 100);
        vat = gross - net;
    }
    
    document.getElementById('vat-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Gross Amount</div>
                <div class="value">£${formatCurrency(gross)}</div>
            </div>
            <div class="result-item">
                <div class="label">Net Amount</div>
                <div class="value">£${formatCurrency(net)}</div>
            </div>
            <div class="result-item">
                <div class="label">VAT (${rate}%)</div>
                <div class="value">£${formatCurrency(vat)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// US INCOME TAX
// ==========================================

const usTaxBrackets2024 = {
    single: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 }
    ],
    married: [
        { min: 0, max: 23200, rate: 0.10 },
        { min: 23200, max: 94300, rate: 0.12 },
        { min: 94300, max: 201050, rate: 0.22 },
        { min: 201050, max: 383900, rate: 0.24 },
        { min: 383900, max: 487450, rate: 0.32 },
        { min: 487450, max: 731200, rate: 0.35 },
        { min: 731200, max: Infinity, rate: 0.37 }
    ]
};

function calculateUSTax() {
    const grossIncome = parseFloat(document.getElementById('us-gross-income').value) || 0;
    const filingStatus = document.getElementById('us-filing-status').value;
    const state = document.getElementById('us-state').value;
    
    const brackets = usTaxBrackets2024[filingStatus];
    
    let federalTax = 0;
    let remaining = grossIncome;
    
    for (const bracket of brackets) {
        if (remaining <= 0) break;
        const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
        federalTax += taxableInBracket * bracket.rate;
        remaining -= taxableInBracket;
    }
    
    // Simplified state tax
    const stateTaxRates = { CA: 0.093, TX: 0, NY: 0.085, FL: 0, WA: 0, AZ: 0.025 };
    const stateTax = grossIncome * (stateTaxRates[state] || 0.05);
    
    // FICA
    const socialSecurity = Math.min(grossIncome, 168600) * 0.062;
    const medicare = grossIncome * 0.0145;
    
    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    const netIncome = grossIncome - totalTax;
    
    document.getElementById('us-tax-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Take Home (Annual)</div>
                <div class="value">$${formatCurrency(netIncome)}</div>
            </div>
            <div class="result-item result-highlight">
                <div class="label">Take Home (Monthly)</div>
                <div class="value">$${formatCurrency(netIncome / 12)}</div>
            </div>
            <div class="result-item">
                <div class="label">Federal Tax</div>
                <div class="value">$${formatCurrency(federalTax)}</div>
            </div>
            <div class="result-item">
                <div class="label">State Tax</div>
                <div class="value">$${formatCurrency(stateTax)}</div>
            </div>
            <div class="result-item">
                <div class="label">Social Security</div>
                <div class="value">$${formatCurrency(socialSecurity)}</div>
            </div>
            <div class="result-item">
                <div class="label">Medicare</div>
                <div class="value">$${formatCurrency(medicare)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// US SELF-EMPLOYMENT TAX
// ==========================================

function calculateUSSelfEmployed() {
    const profit = parseFloat(document.getElementById('us-se-profit').value) || 0;
    const filingStatus = document.getElementById('us-se-filing').value;
    
    // Self-employment tax (Social Security + Medicare, both halves)
    const seTax = profit * 0.9235 * 0.153;
    
    // Deduct half of SE tax
    const taxableIncome = profit - (seTax / 2);
    
    // Federal income tax
    const brackets = usTaxBrackets2024[filingStatus];
    let federalTax = 0;
    let remaining = taxableIncome;
    
    for (const bracket of brackets) {
        if (remaining <= 0) break;
        const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
        federalTax += taxableInBracket * bracket.rate;
        remaining -= taxableInBracket;
    }
    
    const totalTax = federalTax + seTax;
    const netProfit = profit - totalTax;
    
    document.getElementById('us-se-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Net Profit</div>
                <div class="value">$${formatCurrency(netProfit)}</div>
            </div>
            <div class="result-item">
                <div class="label">Income Tax</div>
                <div class="value">$${formatCurrency(federalTax)}</div>
            </div>
            <div class="result-item">
                <div class="label">SE Tax</div>
                <div class="value">$${formatCurrency(seTax)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// US CAPITAL GAINS TAX
// ==========================================

function calculateUSCapitalGains() {
    const gain = parseFloat(document.getElementById('us-cg-gain').value) || 0;
    const income = parseFloat(document.getElementById('us-cg-income').value) || 0;
    const filingStatus = document.getElementById('us-cg-filing').value;
    
    const thresholds = filingStatus === 'married' 
        ? [0, 94050, 583750, Infinity]
        : [0, 47025, 518900, Infinity];
    
    const rates = [0, 0.15, 0.20];
    
    let tax = 0;
    let remaining = gain;
    
    for (let i = 0; i < thresholds.length - 1; i++) {
        if (remaining <= 0) break;
        const bracketSpace = thresholds[i + 1] - (thresholds[i] + income);
        if (bracketSpace > 0) {
            const taxableInBracket = Math.min(remaining, bracketSpace);
            tax += taxableInBracket * rates[i];
            remaining -= taxableInBracket;
        }
    }
    
    document.getElementById('us-cg-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Capital Gains Tax</div>
                <div class="value">$${formatCurrency(tax)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Gain</div>
                <div class="value">$${formatCurrency(gain)}</div>
            </div>
            <div class="result-item">
                <div class="label">Effective Rate</div>
                <div class="value">${((tax / gain) * 100).toFixed(2)}%</div>
            </div>
        </div>
    `;
}

// ==========================================
// US STATE TAX COMPARISON
// ==========================================

const stateTaxData = [
    { state: 'California', abbr: 'CA', rate: 0.093 },
    { state: 'Texas', abbr: 'TX', rate: 0 },
    { state: 'New York', abbr: 'NY', rate: 0.085 },
    { state: 'Florida', abbr: 'FL', rate: 0 },
    { state: 'Washington', abbr: 'WA', rate: 0 },
    { state: 'Arizona', abbr: 'AZ', rate: 0.025 },
    { state: 'Colorado', abbr: 'CO', rate: 0.044 },
    { state: 'Illinois', abbr: 'IL', rate: 0.0495 },
    { state: 'Pennsylvania', abbr: 'PA', rate: 0.0307 },
    { state: 'Ohio', abbr: 'OH', rate: 0.0399 }
];

function calculateStateComparison() {
    const income = parseFloat(document.getElementById('state-income').value) || 0;
    
    let html = '<div class="results-grid">';
    
    stateTaxData.forEach(s => {
        const stateTax = income * s.rate;
        html += `
            <div class="result-item">
                <div class="label">${s.state}</div>
                <div class="value">$${formatCurrency(stateTax)}</div>
            </div>
        `;
    });
    
    html += '</div>';
    html += `<p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">State tax rates are approximate. Consult a tax professional for accurate estimates.</p>`;
    
    document.getElementById('state-results').innerHTML = html;
}

// ==========================================
// FIRE CALCULATOR
// ==========================================

function calculateFIRE() {
    const currentSavings = parseFloat(document.getElementById('fire-savings').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('fire-monthly').value) || 0;
    const annualReturn = parseFloat(document.getElementById('fire-return').value) || 7;
    const withdrawalRate = parseFloat(document.getElementById('fire-withdrawal').value) || 4;
    const annualExpenses = parseFloat(document.getElementById('fire-expenses').value) || 0;
    
    const fireNumber = annualExpenses / (withdrawalRate / 100);
    const monthlyRate = annualReturn / 100 / 12;
    
    // Calculate years to FIRE
    let years = 0;
    let savings = currentSavings;
    
    if (monthlyRate > 0) {
        const monthlyGrowth = Math.log(fireNumber / currentSavings + 1) / Math.log(1 + monthlyRate);
        if (monthlyContribution > 0) {
            while (savings < fireNumber && years < 100) {
                savings = savings * (1 + monthlyRate) + monthlyContribution;
                years += 1/12;
            }
        } else {
            years = monthlyGrowth / 12;
        }
    } else {
        if (monthlyContribution > 0) {
            years = (fireNumber - currentSavings) / (monthlyContribution * 12);
        }
    }
    
    const projectedValue = currentSavings * Math.pow(1 + annualReturn/100, years) + 
        monthlyContribution * 12 * ((Math.pow(1 + annualReturn/100, years) - 1) / (annualReturn/100));
    
    document.getElementById('fire-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">FIRE Number</div>
                <div class="value">£${formatCurrency(fireNumber)}</div>
            </div>
            <div class="result-item result-highlight">
                <div class="label">Years to FIRE</div>
                <div class="value">${years.toFixed(1)}</div>
            </div>
            <div class="result-item">
                <div class="label">Current Savings</div>
                <div class="value">£${formatCurrency(currentSavings)}</div>
            </div>
            <div class="result-item">
                <div class="label">Monthly Contribution</div>
                <div class="value">£${formatCurrency(monthlyContribution)}</div>
            </div>
        </div>
        <p style="margin-top: 20px; color: var(--text-secondary); font-size: 14px; text-align: center;">
            You need £${formatCurrency(fireNumber)} to withdraw £${formatCurrency(annualExpenses)} annually at ${withdrawalRate}% withdrawal rate.
        </p>
    `;
}

// ==========================================
// INVESTMENT FEE ANALYZER
// ==========================================

function calculateInvestmentFees() {
    const principal = parseFloat(document.getElementById('fee-principal').value) || 0;
    const years = parseInt(document.getElementById('fee-years').value) || 0;
    const annualReturn = parseFloat(document.getElementById('fee-return').value) || 7;
    const fee1 = parseFloat(document.getElementById('fee-1').value) || 0;
    const fee2 = parseFloat(document.getElementById('fee-2').value) || 0;
    
    const value1 = principal * Math.pow(1 + (annualReturn - fee1) / 100, years);
    const value2 = principal * Math.pow(1 + (annualReturn - fee2) / 100, years);
    const difference = Math.abs(value1 - value2);
    
    document.getElementById('fee-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item">
                <div class="label">Portfolio 1 (${fee1}% fee)</div>
                <div class="value">£${formatCurrency(value1)}</div>
            </div>
            <div class="result-item">
                <div class="label">Portfolio 2 (${fee2}% fee)</div>
                <div class="value">£${formatCurrency(value2)}</div>
            </div>
            <div class="result-item result-highlight">
                <div class="label">Difference</div>
                <div class="value">£${formatCurrency(difference)}</div>
            </div>
        </div>
        <p style="margin-top: 20px; color: var(--text-secondary); font-size: 14px; text-align: center;">
            A ${Math.abs(fee1 - fee2).toFixed(2)}% fee difference costs £${formatCurrency(difference)} over ${years} years.
        </p>
    `;
}

// ==========================================
// DIVIDEND REINVESTMENT (DRIP)
// ==========================================

function calculateDRIP() {
    const initialInvestment = parseFloat(document.getElementById('drip-initial').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('drip-monthly').value) || 0;
    const years = parseInt(document.getElementById('drip-years').value) || 0;
    const dividendYield = parseFloat(document.getElementById('drip-yield').value) || 0;
    const sharePrice = parseFloat(document.getElementById('drip-price').value) || 100;
    const growthRate = parseFloat(document.getElementById('drip-growth').value) || 0;
    
    let shares = initialInvestment / sharePrice;
    let totalInvested = initialInvestment;
    const months = years * 12;
    const monthlyDividend = dividendYield / 100 / 12;
    
    for (let i = 0; i < months; i++) {
        // Add monthly contribution
        shares += monthlyContribution / sharePrice;
        totalInvested += monthlyContribution;
        
        // Reinvest dividends
        const dividend = shares * sharePrice * monthlyDividend;
        shares += dividend / sharePrice;
        
        // Share price growth
        // (simplified - in reality would compound differently)
    }
    
    const finalValue = shares * sharePrice * Math.pow(1 + growthRate/100, years);
    const totalDividends = finalValue - totalInvested;
    
    document.getElementById('drip-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Final Value</div>
                <div class="value">£${formatCurrency(finalValue)}</div>
            </div>
            <div class="result-item">
                <div class="label">Total Invested</div>
                <div class="value">£${formatCurrency(totalInvested)}</div>
            </div>
            <div class="result-item">
                <div class="label">Dividends Earned</div>
                <div class="value">£${formatCurrency(totalDividends)}</div>
            </div>
            <div class="result-item">
                <div class="label">Final Shares</div>
                <div class="value">${shares.toFixed(4)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// ROI CALCULATOR
// ==========================================

function calculateROI() {
    const initialInvestment = parseFloat(document.getElementById('roi-initial').value) || 0;
    const finalValue = parseFloat(document.getElementById('roi-final').value) || 0;
    const years = parseFloat(document.getElementById('roi-years').value) || 1;
    
    const totalReturn = finalValue - initialInvestment;
    const roi = (totalReturn / initialInvestment) * 100;
    const annualizedReturn = (Math.pow(finalValue / initialInvestment, 1 / years) - 1) * 100;
    
    document.getElementById('roi-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Total ROI</div>
                <div class="value">${roi.toFixed(2)}%</div>
            </div>
            <div class="result-item result-highlight">
                <div class="label">Annualized Return</div>
                <div class="value">${annualizedReturn.toFixed(2)}%</div>
            </div>
            <div class="result-item">
                <div class="label">Total Gain</div>
                <div class="value">£${formatCurrency(totalReturn)}</div>
            </div>
            <div class="result-item">
                <div class="label">Initial Investment</div>
                <div class="value">£${formatCurrency(initialInvestment)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// RETIREMENT CALCULATOR
// ==========================================

function calculateRetirement() {
    const currentAge = parseInt(document.getElementById('ret-age').value) || 30;
    const retirementAge = parseInt(document.getElementById('ret-retire-age').value) || 65;
    const currentSavings = parseFloat(document.getElementById('ret-savings').value) || 0;
    const monthlyContribution = parseFloat(document.getElementById('ret-monthly').value) || 0;
    const annualReturn = parseFloat(document.getElementById('ret-return').value) || 7;
    const desiredIncome = parseFloat(document.getElementById('ret-income').value) || 0;
    
    const yearsToRetire = retirementAge - currentAge;
    const months = yearsToRetire * 12;
    const monthlyRate = annualReturn / 100 / 12;
    
    let futureValue = currentSavings * Math.pow(1 + monthlyRate, months);
    if (monthlyRate > 0) {
        futureValue += monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else {
        futureValue += monthlyContribution * months;
    }
    
    const safeWithdrawal = futureValue * 0.04;
    const yearsOfIncome = futureValue / desiredIncome;
    
    document.getElementById('ret-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Projected Savings</div>
                <div class="value">£${formatCurrency(futureValue)}</div>
            </div>
            <div class="result-item">
                <div class="label">Years to Retirement</div>
                <div class="value">${yearsToRetire}</div>
            </div>
            <div class="result-item">
                <div class="label">4% Safe Withdrawal</div>
                <div class="value">£${formatCurrency(safeWithdrawal)}/yr</div>
            </div>
            <div class="result-item">
                <div class="label">Years of Desired Income</div>
                <div class="value">${yearsOfIncome.toFixed(1)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// BREAK-EVEN CALCULATOR
// ==========================================

function calculateBreakEven() {
    const fixedCosts = parseFloat(document.getElementById('be-fixed').value) || 0;
    const variableCost = parseFloat(document.getElementById('be-variable').value) || 0;
    const price = parseFloat(document.getElementById('be-price').value) || 0;
    
    const contributionMargin = price - variableCost;
    const breakEvenUnits = fixedCosts / contributionMargin;
    const breakEvenRevenue = breakEvenUnits * price;
    
    document.getElementById('be-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Break-Even Units</div>
                <div class="value">${Math.ceil(breakEvenUnits)}</div>
            </div>
            <div class="result-item result-highlight">
                <div class="label">Break-Even Revenue</div>
                <div class="value">£${formatCurrency(breakEvenRevenue)}</div>
            </div>
            <div class="result-item">
                <div class="label">Contribution Margin</div>
                <div class="value">£${formatCurrency(contributionMargin)}</div>
            </div>
            <div class="result-item">
                <div class="label">Fixed Costs</div>
                <div class="value">£${formatCurrency(fixedCosts)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// PROFIT MARGIN CALCULATOR
// ==========================================

function calculateProfitMargin() {
    const revenue = parseFloat(document.getElementById('pm-revenue').value) || 0;
    const cost = parseFloat(document.getElementById('pm-cost').value) || 0;
    
    const profit = revenue - cost;
    const grossMargin = (profit / revenue) * 100;
    const markup = (profit / cost) * 100;
    
    document.getElementById('pm-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Profit</div>
                <div class="value">£${formatCurrency(profit)}</div>
            </div>
            <div class="result-item">
                <div class="label">Gross Margin</div>
                <div class="value">${grossMargin.toFixed(2)}%</div>
            </div>
            <div class="result-item">
                <div class="label">Markup</div>
                <div class="value">${markup.toFixed(2)}%</div>
            </div>
            <div class="result-item">
                <div class="label">Revenue</div>
                <div class="value">£${formatCurrency(revenue)}</div>
            </div>
        </div>
    `;
}

// ==========================================
// CASH FLOW PROJECTOR
// ==========================================

function calculateCashFlow() {
    const startingBalance = parseFloat(document.getElementById('cf-balance').value) || 0;
    const monthlyIncome = parseFloat(document.getElementById('cf-income').value) || 0;
    const monthlyExpenses = parseFloat(document.getElementById('cf-expenses').value) || 0;
    const months = parseInt(document.getElementById('cf-months').value) || 12;
    
    const netMonthly = monthlyIncome - monthlyExpenses;
    
    let html = '<h3 style="margin-bottom: 15px;">Monthly Projection</h3>';
    html += '<div class="tax-breakdown">';
    
    let balance = startingBalance;
    for (let i = 1; i <= months; i++) {
        balance += netMonthly;
        const balanceClass = balance < 0 ? 'color: var(--error)' : 'color: var(--success)';
        html += `
            <div class="tax-row">
                <span class="label">Month ${i}</span>
                <span class="amount" style="${balanceClass}">£${formatCurrency(balance)}</span>
            </div>
        `;
    }
    html += '</div>';
    
    const endBalance = startingBalance + (netMonthly * months);
    
    document.getElementById('cf-results').innerHTML = `
        <div class="results-grid">
            <div class="result-item result-highlight">
                <div class="label">Ending Balance</div>
                <div class="value">£${formatCurrency(endBalance)}</div>
            </div>
            <div class="result-item">
                <div class="label">Net Monthly</div>
                <div class="value">£${formatCurrency(netMonthly)}</div>
            </div>
            <div class="result-item">
                <div class="label">12-Month Total</div>
                <div class="value">£${formatCurrency(netMonthly * 12)}</div>
            </div>
        </div>
        ${html}
    `;
}
