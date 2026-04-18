document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  loadTheme();
  loadTaxData();
});

let taxData = null;
let taxDataLastUpdated = null;

async function loadTaxData() {
  try {
    const response = await fetch('tax-data.json');
    if (!response.ok) throw new Error('Failed to load tax data');
    taxData = await response.json();
    taxDataLastUpdated = taxData.lastUpdated;
    updateTaxYearSelectors();
    updateFooterDate();
  } catch (e) {
    console.log('Using embedded tax data');
    updateFooterDate();
  }
}

function updateFooterDate() {
  const footerEl = document.getElementById('tax-data-updated');
  if (footerEl) {
    const date = taxDataLastUpdated || '2025-04-18';
    footerEl.textContent = `Tax rates last updated: ${date}. Tax data is for informational purposes only.`;
  }
}

function updateTaxYearSelectors() {
  if (!taxData) return;
  
  const ukSelect = document.getElementById('uk-tax-year');
  if (ukSelect && taxData.uk) {
    const years = Object.keys(taxData.uk).sort((a, b) => b - a);
    ukSelect.innerHTML = years.map(y => 
      `<option value="${y}">${y}/${parseInt(y.toString().slice(-2)) + 1}</option>`
    ).join('');
  }
  
  const selfEmployedSelect = document.getElementById('self-employed-tax-year');
  if (selfEmployedSelect && taxData.uk) {
    const years = Object.keys(taxData.uk).sort((a, b) => b - a);
    selfEmployedSelect.innerHTML = years.map(y => 
      `<option value="${y}">${y}/${parseInt(y.toString().slice(-2)) + 1}</option>`
    ).join('');
  }
  
  const dividendSelect = document.getElementById('dividend-tax-year');
  if (dividendSelect && taxData.uk) {
    const years = Object.keys(taxData.uk).sort((a, b) => b - a);
    dividendSelect.innerHTML = years.map(y => 
      `<option value="${y}">${y}/${parseInt(y.toString().slice(-2)) + 1}</option>`
    ).join('');
  }
}

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
  2025: {
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
    class2NI: 179.40,
    dividendAllowance: 500,
    capitalGainsExempt: 3000,
    studentLoanThresholds: { plan1: 26100, plan2: 27295, plan4: 32185, plan5: 25000, postgrad: 21000 },
    studentLoanRates: { plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, postgrad: 0.06 }
  },
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
    class2NI: 179.40,
    dividendAllowance: 500,
    capitalGainsExempt: 3000,
    studentLoanThresholds: { plan1: 24990, plan2: 27295, plan4: 31565, plan5: 25000, postgrad: 21000 },
    studentLoanRates: { plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, postgrad: 0.06 }
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
    class2NI: 179.40,
    dividendAllowance: 1000,
    capitalGainsExempt: 6000,
    studentLoanThresholds: { plan1: 22615, plan2: 27295, plan4: 27660, plan5: 25000, postgrad: 21000 },
    studentLoanRates: { plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, postgrad: 0.06 }
  }
};

function getUKTaxBands(year) {
  if (taxData && taxData.uk && taxData.uk[year]) {
    return taxData.uk[year];
  }
  return ukTaxBands[year] || ukTaxBands['2025'];
}

function calculateUKTax() {
  const taxYear = document.getElementById('uk-tax-year').value;
  const grossSalary = parseFloat(document.getElementById('uk-gross-salary').value) || 0;
  const pensionPercent = parseFloat(document.getElementById('uk-pension').value) || 0;
  const studentLoan = document.getElementById('uk-student-loan').value;

  const bands = getUKTaxBands(taxYear);
    
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
    
    const bands = getUKTaxBands(taxYear);
    
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

  const bands = getUKTaxBands(taxYear);

  const dividendAllowance = bands.dividendAllowance || 500;
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

  const bands = getUKTaxBands('2025');
  const annualExempt = bands.capitalGainsExempt || 3000;
  const basicLimit = bands.basicLimit || 50270;
  const residentialRate = income > basicLimit ? 0.24 : 0.18;
  const otherRate = income > basicLimit ? 0.20 : 0.10;

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

const usTaxBrackets = {
  2025: {
    single: [
      { min: 0, max: 11950, rate: 0.10 },
      { min: 11950, max: 48475, rate: 0.12 },
      { min: 48475, max: 103350, rate: 0.22 },
      { min: 103350, max: 197300, rate: 0.24 },
      { min: 197300, max: 250525, rate: 0.32 },
      { min: 250525, max: 626350, rate: 0.35 },
      { min: 626350, max: Infinity, rate: 0.37 }
    ],
    married: [
      { min: 0, max: 23900, rate: 0.10 },
      { min: 23900, max: 96950, rate: 0.12 },
      { min: 96950, max: 206700, rate: 0.22 },
      { min: 206700, max: 394600, rate: 0.24 },
      { min: 394600, max: 501050, rate: 0.32 },
      { min: 501050, max: 752700, rate: 0.35 },
      { min: 752700, max: Infinity, rate: 0.37 }
    ],
    socialSecurityWageBase: 176100,
    standardDeduction: { single: 15000, married: 30000 }
  },
  2024: {
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
    ],
    socialSecurityWageBase: 168600,
    standardDeduction: { single: 14600, married: 29200 }
  }
};

const usStateTaxRates = { 
  CA: 0.093, TX: 0, NY: 0.085, FL: 0, WA: 0, AZ: 0.025,
  IL: 0.0495, PA: 0.0307, OH: 0.04, GA: 0.0549
};

function getUSTaxBrackets(year) {
  if (taxData && taxData.us && taxData.us[year]) {
    return taxData.us[year];
  }
  return usTaxBrackets[year] || usTaxBrackets['2025'];
}

function calculateUSTax() {
  const grossIncome = parseFloat(document.getElementById('us-gross-income').value) || 0;
  const filingStatus = document.getElementById('us-filing-status').value;
  const state = document.getElementById('us-state').value;

  const yearData = getUSTaxBrackets('2025');
  const brackets = yearData[filingStatus];
  const ssWageBase = yearData.socialSecurityWageBase || 176100;

  let federalTax = 0;
  let remaining = grossIncome;

  for (const bracket of brackets) {
    if (remaining <= 0) break;
    const taxableInBracket = Math.min(remaining, bracket.max - bracket.min);
    federalTax += taxableInBracket * bracket.rate;
    remaining -= taxableInBracket;
  }

  const stateTax = grossIncome * (usStateTaxRates[state] || 0.05);

  const socialSecurity = Math.min(grossIncome, ssWageBase) * 0.062;
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

  const seTax = profit * 0.9235 * 0.153;
  const taxableIncome = profit - (seTax / 2);

  const yearData = getUSTaxBrackets('2025');
  const brackets = yearData[filingStatus];
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

  const yearData = getUSTaxBrackets('2025');
  const cgBrackets = yearData.capitalGains?.[filingStatus] || 
    (filingStatus === 'married' 
      ? [{min: 0, max: 96700, rate: 0}, {min: 96700, max: 600050, rate: 0.15}, {min: 600050, max: Infinity, rate: 0.20}]
      : [{min: 0, max: 48350, rate: 0}, {min: 48350, max: 533400, rate: 0.15}, {min: 533400, max: Infinity, rate: 0.20}]);

  let tax = 0;
  let remaining = gain;

  for (const bracket of cgBrackets) {
    if (remaining <= 0) break;
    const bracketSpace = bracket.max === Infinity ? Infinity : bracket.max - Math.max(income, bracket.min);
    if (bracketSpace > 0) {
      const taxableInBracket = Math.min(remaining, bracketSpace);
      tax += taxableInBracket * bracket.rate;
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

// ==========================================
// HISTORICAL EXCHANGE RATES
// ==========================================

const historicalRates = {
  2024: { GBP_USD: 1.27, GBP_EUR: 1.16, EUR_USD: 1.09 },
  2023: { GBP_USD: 1.23, GBP_EUR: 1.14, EUR_USD: 1.08 },
  2022: { GBP_USD: 1.21, GBP_EUR: 1.17, EUR_USD: 1.05 },
  2021: { GBP_USD: 1.38, GBP_EUR: 1.16, EUR_USD: 1.18 },
  2020: { GBP_USD: 1.28, GBP_EUR: 1.12, EUR_USD: 1.14 },
  2019: { GBP_USD: 1.28, GBP_EUR: 1.12, EUR_USD: 1.12 },
  2018: { GBP_USD: 1.33, GBP_EUR: 1.13, EUR_USD: 1.18 },
  2017: { GBP_USD: 1.30, GBP_EUR: 1.12, EUR_USD: 1.16 },
  2016: { GBP_USD: 1.32, GBP_EUR: 1.23, EUR_USD: 1.08 },
  2015: { GBP_USD: 1.53, GBP_EUR: 1.38, EUR_USD: 1.11 },
  2014: { GBP_USD: 1.65, GBP_EUR: 1.24, EUR_USD: 1.33 },
  2010: { GBP_USD: 1.55, GBP_EUR: 1.16, EUR_USD: 1.33 },
  2005: { GBP_USD: 1.82, GBP_EUR: 1.47, EUR_USD: 1.24 },
  2000: { GBP_USD: 1.52, GBP_EUR: 1.64, EUR_USD: 0.93 },
  1995: { GBP_USD: 1.54, GBP_EUR: 1.35, EUR_USD: 1.14 }
};

function lookupHistoricalRate() {
  const year = document.getElementById('hist-year').value;
  const from = document.getElementById('hist-from').value;
  const to = document.getElementById('hist-to').value;
  const amount = parseFloat(document.getElementById('hist-amount').value) || 1;

  const rates = historicalRates[year];
  if (!rates) {
    document.getElementById('hist-results').innerHTML = '<p style="color: var(--error);">No data available for selected year.</p>';
    return;
  }

  const key = `${from}_${to}`;
  const reverseKey = `${to}_${from}`;
  
  let rate, result;
  if (from === to) {
    rate = 1;
    result = amount;
  } else if (rates[key]) {
    rate = rates[key];
    result = amount * rate;
  } else if (rates[reverseKey]) {
    rate = 1 / rates[reverseKey];
    result = amount * rate;
  } else if (from === 'GBP' || to === 'GBP') {
    const usdKey = from === 'GBP' ? `GBP_USD` : `USD_GBP`;
    const eurKey = from === 'GBP' ? `GBP_EUR` : `EUR_GBP`;
    if (rates[usdKey] && (to === 'USD' || from === 'USD')) {
      rate = to === 'USD' ? rates.GBP_USD : 1/rates.GBP_USD;
      result = amount * rate;
    } else if (rates[eurKey] && (to === 'EUR' || from === 'EUR')) {
      rate = to === 'EUR' ? rates.GBP_EUR : 1/rates.GBP_EUR;
      result = amount * rate;
    } else {
      document.getElementById('hist-results').innerHTML = '<p style="color: var(--error);">Rate combination not available.</p>';
      return;
    }
  } else {
    const usdTo = rates[`USD_${to}`] || (rates[`${to}_USD`] ? 1/rates[`${to}_USD`] : null);
    const usdFrom = rates[`USD_${from}`] || (rates[`${from}_USD`] ? 1/rates[`${from}_USD`] : null);
    if (usdTo && usdFrom) {
      rate = usdTo / usdFrom;
      result = amount * rate;
    } else {
      document.getElementById('hist-results').innerHTML = '<p style="color: var(--error);">Rate not available.</p>';
      return;
    }
  }

  document.getElementById('hist-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">${amount} ${from} in ${year}</div>
        <div class="value">${result.toFixed(2)} ${to}</div>
      </div>
      <div class="result-item">
        <div class="label">Exchange Rate</div>
        <div class="value">1 ${from} = ${rate.toFixed(4)} ${to}</div>
      </div>
    </div>
  `;
}

// ==========================================
// IR35 CALCULATOR
// ==========================================

function calculateIR35() {
  const dayRate = parseFloat(document.getElementById('ir35-rate').value) || 0;
  const days = parseInt(document.getElementById('ir35-days').value) || 220;
  const expenses = parseFloat(document.getElementById('ir35-expenses').value) || 0;

  const grossIncome = dayRate * days;
  const insideExpenses = Math.min(expenses, grossIncome * 0.05);

  // Inside IR35 (deemed employment)
  const insideSalary = grossIncome - insideExpenses;
  const insideTax = calculateSimpleUKTax(insideSalary);
  const insideNet = insideSalary - insideTax.total - insideExpenses;

  // Outside IR35 (dividend route)
  const outsideSalary = Math.min(12570, grossIncome * 0.3);
  const outsideCorpProfit = grossIncome - outsideSalary - expenses;
  const corpTax = outsideCorpProfit * 0.25;
  const outsideDividends = outsideCorpProfit - corpTax;
  const outsideDivTax = calculateDividendTax(outsideDividends, outsideSalary);
  const outsideNet = outsideSalary - calculateSimpleUKTax(outsideSalary).total + outsideDividends - outsideDivTax - expenses;

  document.getElementById('ir35-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight" style="background: linear-gradient(135deg, var(--success), #1e8449)">
        <div class="label">Outside IR35 Net</div>
        <div class="value">£${formatCurrency(outsideNet)}</div>
      </div>
      <div class="result-item">
        <div class="label">Inside IR35 Net</div>
        <div class="value">£${formatCurrency(insideNet)}</div>
      </div>
      <div class="result-item">
        <div class="label">Difference</div>
        <div class="value">£${formatCurrency(outsideNet - insideNet)}</div>
      </div>
      <div class="result-item">
        <div class="label">Gross Income</div>
        <div class="value">£${formatCurrency(grossIncome)}</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      Outside IR35 assumes salary + dividend extraction. Consult an accountant for accurate advice.
    </p>
  `;
}

function calculateSimpleUKTax(income) {
  const personalAllowance = 12570;
  const taxableIncome = Math.max(0, income - personalAllowance);
  
  let tax = 0;
  if (taxableIncome > 0) {
    const basic = Math.min(taxableIncome, 37700);
    tax += basic * 0.20;
  }
  if (taxableIncome > 37700) {
    const higher = Math.min(taxableIncome - 37700, 74900);
    tax += higher * 0.40;
  }
  if (taxableIncome > 112700) {
    tax += (taxableIncome - 112700) * 0.45;
  }
  
  return { tax, total: tax };
}

function calculateDividendTax(dividends, otherIncome) {
  const allowance = 500;
  const basicRemaining = Math.max(0, 50270 - otherIncome);
  
  let tax = 0;
  const taxable = Math.max(0, dividends - allowance);
  
  if (taxable > 0) {
    const basic = Math.min(taxable, basicRemaining);
    tax += basic * 0.0875;
    if (taxable > basicRemaining) {
      tax += (taxable - basicRemaining) * 0.3375;
    }
  }
  
  return tax;
}

// ==========================================
// REMOTE SALARY ADJUSTER
// ==========================================

const colIndices = {
  'London': 100, 'Manchester': 75, 'Birmingham': 73, 'Edinburgh': 85,
  'Bristol': 82, 'Leeds': 70, 'Glasgow': 72, 'Liverpool': 68,
  'New York': 135, 'San Francisco': 150, 'Seattle': 115, 'Austin': 95,
  'Berlin': 80, 'Amsterdam': 90, 'Paris': 95, 'Barcelona': 70,
  'Tokyo': 95, 'Singapore': 110, 'Sydney': 100, 'Dubai': 85
};

function calculateRemoteSalary() {
  const currentSalary = parseFloat(document.getElementById('remote-current').value) || 0;
  const currentCity = document.getElementById('remote-current-city').value;
  const newCity = document.getElementById('remote-new-city').value;

  const currentIndex = colIndices[currentCity] || 100;
  const newIndex = colIndices[newCity] || 100;

  const adjustedSalary = currentSalary * (newIndex / currentIndex);
  const difference = adjustedSalary - currentSalary;

  document.getElementById('remote-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">Adjusted Salary</div>
        <div class="value">£${formatCurrency(adjustedSalary)}</div>
      </div>
      <div class="result-item">
        <div class="label">Current Salary</div>
        <div class="value">£${formatCurrency(currentSalary)}</div>
      </div>
      <div class="result-item" style="color: ${difference >= 0 ? 'var(--success)' : 'var(--error)'}">
        <div class="label">Difference</div>
        <div class="value">${difference >= 0 ? '+' : ''}£${formatCurrency(Math.abs(difference))}</div>
      </div>
      <div class="result-item">
        <div class="label">${currentCity} Index</div>
        <div class="value">${currentIndex}</div>
      </div>
      <div class="result-item">
        <div class="label">${newCity} Index</div>
        <div class="value">${newIndex}</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      Cost of living indices are approximate. Negotiate based on your specific skills and market rates.
    </p>
  `;
}

// ==========================================
// PAYCHECK CALCULATOR
// ==========================================

function calculatePaycheck() {
  const salary = parseFloat(document.getElementById('pay-salary').value) || 0;
  const frequency = document.getElementById('pay-frequency').value;
  const pension = parseFloat(document.getElementById('pay-pension').value) || 0;
  const studentLoan = document.getElementById('pay-student-loan').value;

  const annualTax = calculateDetailedUKTax(salary, pension, studentLoan);
  
  const periods = frequency === 'monthly' ? 12 : frequency === 'weekly' ? 52 : 26;
  const grossPerPeriod = salary / periods;
  const netPerPeriod = annualTax.net / periods;
  const taxPerPeriod = annualTax.incomeTax / periods;
  const niPerPeriod = annualTax.ni / periods;
  const pensionPerPeriod = annualTax.pension / periods;
  const studentLoanPerPeriod = annualTax.studentLoan / periods;

  document.getElementById('pay-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">Net ${frequency === 'monthly' ? 'Monthly' : frequency === 'weekly' ? 'Weekly' : 'Bi-weekly'}</div>
        <div class="value">£${formatCurrency(netPerPeriod)}</div>
      </div>
      <div class="result-item">
        <div class="label">Gross per Period</div>
        <div class="value">£${formatCurrency(grossPerPeriod)}</div>
      </div>
      <div class="result-item">
        <div class="label">Income Tax</div>
        <div class="value">-£${formatCurrency(taxPerPeriod)}</div>
      </div>
      <div class="result-item">
        <div class="label">National Insurance</div>
        <div class="value">-£${formatCurrency(niPerPeriod)}</div>
      </div>
      <div class="result-item">
        <div class="label">Pension</div>
        <div class="value">-£${formatCurrency(pensionPerPeriod)}</div>
      </div>
      <div class="result-item">
        <div class="label">Student Loan</div>
        <div class="value">-£${formatCurrency(studentLoanPerPeriod)}</div>
      </div>
    </div>
  `;
}

function calculateDetailedUKTax(gross, pensionPercent, studentLoan) {
  const pension = gross * (pensionPercent / 100);
  const taxableIncome = gross - pension;

  let personalAllowance = 12570;
  if (taxableIncome > 100000) {
    personalAllowance = Math.max(0, personalAllowance - (taxableIncome - 100000) / 2);
  }

  const basicBand = 50270 - personalAllowance;
  let incomeTax = 0;
  let taxable = taxableIncome;

  const taxFree = Math.min(taxable, personalAllowance);
  taxable -= taxFree;

  const basicAmount = Math.min(taxable, basicBand);
  incomeTax += basicAmount * 0.20;
  taxable -= basicAmount;

  const higherAmount = Math.min(taxable, 125140 - 50270);
  incomeTax += higherAmount * 0.40;
  taxable -= higherAmount;

  incomeTax += Math.max(0, taxable) * 0.45;

  let ni = 0;
  if (gross > 12570) {
    ni += Math.min(gross - 12570, 37700) * 0.08;
    if (gross > 50270) {
      ni += (gross - 50270) * 0.02;
    }
  }

  let studentLoanAmount = 0;
  const thresholds = { plan1: 26100, plan2: 27295, plan4: 32185, plan5: 25000, postgrad: 21000 };
  const rates = { plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, postgrad: 0.06 };
  
  if (studentLoan !== 'none' && thresholds[studentLoan]) {
    const threshold = thresholds[studentLoan];
    const rate = rates[studentLoan];
    studentLoanAmount = Math.max(0, gross - threshold) * rate;
  }

  const totalDeductions = incomeTax + ni + pension + studentLoanAmount;
  const net = gross - totalDeductions;

  return { incomeTax, ni, pension, studentLoan: studentLoanAmount, totalDeductions, net };
}

// ==========================================
// CONTRACTOR RATE CALCULATOR
// ==========================================

function calculateContractorRate() {
  const permSalary = parseFloat(document.getElementById('contract-perm').value) || 0;
  const days = parseInt(document.getElementById('contract-days').value) || 220;
  const insideIR35 = document.getElementById('contract-ir35').value === 'inside';

  const grossPerm = permSalary;
  const permTax = calculateDetailedUKTax(grossPerm, 5, 'none');
  const permNet = permTax.net;

  const insideDivisor = insideIR35 ? 1.3 : 1.5;
  const equivalentDayRate = permSalary / days * insideDivisor;
  const roundedDayRate = Math.ceil(equivalentDayRate / 25) * 25;

  const grossContract = roundedDayRate * days;
  const contractTax = calculateDetailedUKTax(grossContract, 0, 'none');
  const contractNet = contractTax.net;

  document.getElementById('contract-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">Equivalent Day Rate</div>
        <div class="value">£${roundedDayRate}</div>
      </div>
      <div class="result-item">
        <div class="label">Permanent Net</div>
        <div class="value">£${formatCurrency(permNet)}/yr</div>
      </div>
      <div class="result-item">
        <div class="label">Contract Net (est.)</div>
        <div class="value">£${formatCurrency(contractNet)}/yr</div>
      </div>
      <div class="result-item">
        <div class="label">Working Days</div>
        <div class="value">${days}/year</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      Day rate multiplier: ${insideIR35 ? '1.3x (Inside IR35)' : '1.5x (Outside IR35)'}. 
      Adjust based on market rates and skills.
    </p>
  `;
}

// ==========================================
// DEBT PAYOFF STRATEGY
// ==========================================

function calculateDebtPayoff() {
  const debts = [];
  const debtInputs = document.querySelectorAll('.debt-entry');
  debtInputs.forEach((entry, i) => {
    const balance = parseFloat(entry.querySelector('.debt-balance').value) || 0;
    const rate = parseFloat(entry.querySelector('.debt-rate').value) || 0;
    const minPayment = parseFloat(entry.querySelector('.debt-min').value) || 0;
    if (balance > 0) {
      debts.push({ balance, rate, minPayment, name: `Debt ${i + 1}` });
    }
  });

  const monthlyPayment = parseFloat(document.getElementById('debt-monthly').value) || 0;
  const strategy = document.getElementById('debt-strategy').value;

  if (debts.length === 0 || monthlyPayment === 0) {
    document.getElementById('debt-results').innerHTML = '<p style="color: var(--error);">Please enter your debts and monthly payment.</p>';
    return;
  }

  const minTotal = debts.reduce((sum, d) => sum + d.minPayment, 0);
  if (monthlyPayment < minTotal) {
    document.getElementById('debt-results').innerHTML = `<p style="color: var(--error);">Monthly payment must be at least £${minTotal.toFixed(2)} to cover minimums.</p>`;
    return;
  }

  const extraPayment = monthlyPayment - minTotal;

  const result = simulateDebtPayoff(debts, strategy, monthlyPayment, extraPayment);
  const oppositeResult = simulateDebtPayoff([...debts], strategy === 'avalanche' ? 'snowball' : 'avalanche', monthlyPayment, extraPayment);

  document.getElementById('debt-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">${strategy === 'avalanche' ? 'Avalanche' : 'Snowball'} Method</div>
        <div class="value">${result.months} months</div>
      </div>
      <div class="result-item">
        <div class="label">Total Interest</div>
        <div class="value">£${formatCurrency(result.interest)}</div>
      </div>
      <div class="result-item">
        <div class="label">${strategy === 'avalanche' ? 'Snowball' : 'Avalanche'} Alternative</div>
        <div class="value">${oppositeResult.months} months</div>
      </div>
      <div class="result-item">
        <div class="label">Alternative Interest</div>
        <div class="value">£${formatCurrency(oppositeResult.interest)}</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      ${strategy === 'avalanche' ? 'Avalanche pays highest interest first (saves money). Snowball pays smallest first (motivation).' : 'Snowball pays smallest first (quick wins). Avalanche pays highest interest first (saves money).'}
    </p>
  `;
}

function simulateDebtPayoff(debts, strategy, monthlyPayment, extraPayment) {
  debts = debts.map(d => ({ ...d }));
  
  if (strategy === 'avalanche') {
    debts.sort((a, b) => b.rate - a.rate);
  } else {
    debts.sort((a, b) => a.balance - b.balance);
  }

  let months = 0;
  let totalInterest = 0;

  while (debts.some(d => d.balance > 0) && months < 600) {
    months++;
    let remaining = extraPayment;

    debts.forEach(d => {
      if (d.balance > 0) {
        const interest = d.balance * (d.rate / 100 / 12);
        totalInterest += interest;
        d.balance += interest;

        d.balance -= d.minPayment;
        remaining -= d.minPayment;
      }
    });

    while (remaining > 0) {
      const unpaid = debts.find(d => d.balance > 0);
      if (!unpaid) break;
      const payment = Math.min(remaining, unpaid.balance);
      unpaid.balance -= payment;
      remaining -= payment;
    }
  }

  return { months, interest: totalInterest };
}

function addDebtEntry() {
  const container = document.getElementById('debt-entries');
  const count = container.querySelectorAll('.debt-entry').length + 1;
  const entry = document.createElement('div');
  entry.className = 'debt-entry';
  entry.innerHTML = `
    <div class="input-grid" style="grid-template-columns: 2fr 1fr 1fr; gap: 10px;">
      <div class="input-group">
        <input type="number" class="debt-balance" placeholder="Balance £" value="5000">
      </div>
      <div class="input-group">
        <input type="number" class="debt-rate" placeholder="APR %" value="18" step="0.1">
      </div>
      <div class="input-group">
        <input type="number" class="debt-min" placeholder="Min £" value="100">
      </div>
    </div>
  `;
  container.appendChild(entry);
}

// ==========================================
// DTI CALCULATOR
// ==========================================

function calculateDTI() {
  const grossIncome = parseFloat(document.getElementById('dti-income').value) || 0;
  const mortgage = parseFloat(document.getElementById('dti-mortgage').value) || 0;
  const carLoan = parseFloat(document.getElementById('dti-car').value) || 0;
  const creditCards = parseFloat(document.getElementById('dti-credit').value) || 0;
  const otherDebts = parseFloat(document.getElementById('dti-other').value) || 0;
  const rent = parseFloat(document.getElementById('dti-rent').value) || 0;

  const monthlyIncome = grossIncome / 12;
  const housingPayment = mortgage || rent;
  const totalDebts = housingPayment + carLoan + creditCards + otherDebts;
  const dti = (totalDebts / monthlyIncome) * 100;
  const housingDTI = (housingPayment / monthlyIncome) * 100;

  let rating, ratingColor;
  if (dti <= 35) {
    rating = 'Good';
    ratingColor = 'var(--success)';
  } else if (dti <= 43) {
    rating = 'Fair';
    ratingColor = '#f39c12';
  } else if (dti <= 50) {
    rating = 'High';
    ratingColor = '#e67e22';
  } else {
    rating = 'Poor';
    ratingColor = 'var(--error)';
  }

  document.getElementById('dti-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight" style="background: ${ratingColor}">
        <div class="label">DTI Ratio</div>
        <div class="value">${dti.toFixed(1)}% - ${rating}</div>
      </div>
      <div class="result-item">
        <div class="label">Housing DTI</div>
        <div class="value">${housingDTI.toFixed(1)}%</div>
      </div>
      <div class="result-item">
        <div class="label">Total Monthly Debts</div>
        <div class="value">£${formatCurrency(totalDebts)}</div>
      </div>
      <div class="result-item">
        <div class="label">Monthly Income</div>
        <div class="value">£${formatCurrency(monthlyIncome)}</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      Lenders typically prefer DTI below 43%. Ideal is below 36%.
    </p>
  `;
}

// ==========================================
// BNPL COMPARISON
// ==========================================

const bnplProviders = [
  { name: 'Klarna', feeAfterWeeks: 6, feePercent: 0, lateFee: 7 },
  { name: 'Clearpay', feeAfterWeeks: 2, feePercent: 0, lateFee: 6 },
  { name: 'Laybuy', feeAfterWeeks: 1, feePercent: 0, lateFee: 10 },
  { name: 'PayPal Pay in 3', feeAfterWeeks: 3, feePercent: 0, lateFee: 12 }
];

function calculateBNPL() {
  const amount = parseFloat(document.getElementById('bnpl-amount').value) || 0;
  const weeks = parseInt(document.getElementById('bnpl-weeks').value) || 6;

  let html = '<div class="tax-breakdown"><h4>Comparison</h4>';
  
  bnplProviders.forEach(provider => {
    const missed = Math.max(0, weeks - provider.feeAfterWeeks);
    const lateFees = missed * provider.lateFee;
    const percentFees = amount * (provider.feePercent / 100);
    const totalCost = amount + lateFees + percentFees;
    
    html += `
      <div class="tax-row" style="padding: 10px; margin: 5px 0; background: var(--bg-card); border-radius: 8px;">
        <span class="label" style="font-weight: bold;">${provider.name}</span>
        <span class="amount">£${formatCurrency(totalCost)}</span>
      </div>
      <div style="font-size: 11px; color: var(--text-secondary); margin-left: 10px; margin-bottom: 10px;">
        ${missed > 0 ? `${missed} late payments × £${provider.lateFee} = £${lateFees}` : 'No late fees'}
      </div>
    `;
  });
  
  html += '</div>';
  html += `<p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
    Late fees shown for ${weeks} week repayment. Pay on time = 0% interest.
  </p>`;

  document.getElementById('bnpl-results').innerHTML = html;
}

// ==========================================
// APR CALCULATOR
// ==========================================

function calculateAPR() {
  const loanAmount = parseFloat(document.getElementById('apr-amount').value) || 0;
  const interestRate = parseFloat(document.getElementById('apr-rate').value) || 0;
  const fees = parseFloat(document.getElementById('apr-fees').value) || 0;
  const termMonths = parseInt(document.getElementById('apr-term').value) || 12;

  const monthlyRate = interestRate / 100 / 12;
  const totalWithFees = loanAmount + fees;

  let monthlyPayment;
  if (monthlyRate === 0) {
    monthlyPayment = totalWithFees / termMonths;
  } else {
    monthlyPayment = totalWithFees * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
  }

  const totalRepaid = monthlyPayment * termMonths;
  
  const apr = calculateAPRRate(loanAmount, monthlyPayment, termMonths);

  document.getElementById('apr-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">APR</div>
        <div class="value">${apr.toFixed(2)}%</div>
      </div>
      <div class="result-item">
        <div class="label">Monthly Payment</div>
        <div class="value">£${formatCurrency(monthlyPayment)}</div>
      </div>
      <div class="result-item">
        <div class="label">Total Repaid</div>
        <div class="value">£${formatCurrency(totalRepaid)}</div>
      </div>
      <div class="result-item">
        <div class="label">Interest Rate</div>
        <div class="value">${interestRate}%</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      APR includes fees and shows the true cost of borrowing.
    </p>
  `;
}

function calculateAPRRate(principal, payment, months) {
  let low = 0, high = 100;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const rate = mid / 100 / 12;
    const pv = payment * (1 - Math.pow(1 + rate, -months)) / rate;
    if (pv > principal) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) / 2;
}

// ==========================================
// PERSONAL INFLATION RATE
// ==========================================

function calculatePersonalInflation() {
  const categories = [
    { name: 'Housing', weight: 0.28, input: 'inf-housing' },
    { name: 'Transport', weight: 0.14, input: 'inf-transport' },
    { name: 'Food', weight: 0.12, input: 'inf-food' },
    { name: 'Utilities', weight: 0.08, input: 'inf-utilities' },
    { name: 'Healthcare', weight: 0.04, input: 'inf-health' },
    { name: 'Entertainment', weight: 0.06, input: 'inf-entertainment' },
    { name: 'Other', weight: 0.28, input: 'inf-other' }
  ];

  let personalRate = 0;
  let html = '<div class="tax-breakdown"><h4>Your Spending Breakdown</h4>';

  categories.forEach(cat => {
    const spend = parseFloat(document.getElementById(cat.input).value) || 0;
    const weight = cat.weight * 100;
    const contribution = spend * weight / 100;
    personalRate += contribution;
    
    html += `
      <div class="tax-row">
        <span class="label">${cat.name} (${weight.toFixed(0)}%)</span>
        <span class="amount">${spend.toFixed(1)}%</span>
      </div>
    `;
  });

  html += '</div>';

  const officialRate = 3.2;
  const difference = personalRate - officialRate;

  document.getElementById('pinf-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">Your Personal Inflation</div>
        <div class="value">${personalRate.toFixed(1)}%</div>
      </div>
      <div class="result-item">
        <div class="label">Official CPI</div>
        <div class="value">${officialRate}%</div>
      </div>
      <div class="result-item" style="color: ${difference > 0 ? 'var(--error)' : 'var(--success)'}">
        <div class="label">Difference</div>
        <div class="value">${difference > 0 ? '+' : ''}${difference.toFixed(1)}%</div>
      </div>
    </div>
    ${html}
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      Enter your annual spending increase % for each category.
    </p>
  `;
}

// ==========================================
// PENSION CALCULATOR (UK)
// ==========================================

function calculatePension() {
  const age = parseInt(document.getElementById('pen-age').value) || 30;
  const currentPot = parseFloat(document.getElementById('pen-pot').value) || 0;
  const monthlyContrib = parseFloat(document.getElementById('pen-monthly').value) || 0;
  const employerContrib = parseFloat(document.getElementById('pen-employer').value) || 0;
  const salary = parseFloat(document.getElementById('pen-salary').value) || 0;
  const growthRate = parseFloat(document.getElementById('pen-growth').value) || 5;

  const retirementAge = 68;
  const yearsToRetire = retirementAge - age;
  const monthlyRate = growthRate / 100 / 12;
  const totalMonthly = monthlyContrib + employerContrib;

  let futurePot = currentPot * Math.pow(1 + monthlyRate, yearsToRetire * 12);
  if (monthlyRate > 0) {
    futurePot += totalMonthly * ((Math.pow(1 + monthlyRate, yearsToRetire * 12) - 1) / monthlyRate);
  } else {
    futurePot += totalMonthly * yearsToRetire * 12;
  }

  const taxFreeLump = futurePot * 0.25;
  const remainingPot = futurePot - taxFreeLump;
  const annualIncome = remainingPot * 0.04;

  const annualAllowance = 60000;
  const totalAnnualContrib = (monthlyContrib + employerContrib) * 12;
  const allowanceUsed = (totalAnnualContrib / annualAllowance * 100).toFixed(1);

  document.getElementById('pen-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">Projected Pot at ${retirementAge}</div>
        <div class="value">£${formatCurrency(futurePot)}</div>
      </div>
      <div class="result-item">
        <div class="label">Tax-Free Lump Sum (25%)</div>
        <div class="value">£${formatCurrency(taxFreeLump)}</div>
      </div>
      <div class="result-item">
        <div class="label">Safe Withdrawal (4%/yr)</div>
        <div class="value">£${formatCurrency(annualIncome)}</div>
      </div>
      <div class="result-item">
        <div class="label">Years to Retirement</div>
        <div class="value">${yearsToRetire}</div>
      </div>
      <div class="result-item">
        <div class="label">Annual Allowance Used</div>
        <div class="value">${allowanceUsed}%</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      Annual allowance: £60,000. Lifetime allowance abolished from April 2024.
    </p>
  `;
}

// ==========================================
// 401K CALCULATOR
// ==========================================

function calculate401k() {
  const age = parseInt(document.getElementById('401k-age').value) || 30;
  const currentBalance = parseFloat(document.getElementById('401k-balance').value) || 0;
  const salary = parseFloat(document.getElementById('401k-salary').value) || 0;
  const contribution = parseFloat(document.getElementById('401k-contrib').value) || 0;
  const employerMatch = parseFloat(document.getElementById('401k-match').value) || 0;
  const employerLimit = parseFloat(document.getElementById('401k-limit').value) || 6;
  const growthRate = parseFloat(document.getElementById('401k-growth').value) || 7;

  const yearData = getUSTaxBrackets('2025');
  const contributionLimit = 23500;
  const catchUp = age >= 50 ? 7500 : 0;
  const maxContrib = contributionLimit + catchUp;

  const yourContrib = Math.min(salary * (contribution / 100), maxContrib);
  const employerContribAmount = Math.min(salary * (employerMatch / 100), salary * (employerLimit / 100));

  const retirementAge = 65;
  const yearsToRetire = retirementAge - age;
  const monthlyRate = growthRate / 100 / 12;
  const totalAnnual = yourContrib + employerContribAmount;

  let futureValue = currentBalance * Math.pow(1 + monthlyRate, yearsToRetire * 12);
  if (monthlyRate > 0) {
    futureValue += totalAnnual * ((Math.pow(1 + growthRate / 100, yearsToRetire) - 1) / (growthRate / 100));
  } else {
    futureValue += totalAnnual * yearsToRetire;
  }

  document.getElementById('401k-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">Projected 401k at ${retirementAge}</div>
        <div class="value">$${formatCurrency(futureValue)}</div>
      </div>
      <div class="result-item">
        <div class="label">Your Annual Contribution</div>
        <div class="value">$${formatCurrency(yourContrib)}</div>
      </div>
      <div class="result-item">
        <div class="label">Employer Match</div>
        <div class="value">$${formatCurrency(employerContribAmount)}</div>
      </div>
      <div class="result-item">
        <div class="label">Total Annual</div>
        <div class="value">$${formatCurrency(totalAnnual)}</div>
      </div>
      <div class="result-item">
        <div class="label">Contribution Limit</div>
        <div class="value">$${maxContrib.toLocaleString()}</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      2025 limit: $23,500 ($31,000 if 50+). Always contribute at least the employer match.
    </p>
  `;
}

// ==========================================
// SOCIAL SECURITY ESTIMATOR
// ==========================================

function calculateSocialSecurity() {
  const currentAge = parseInt(document.getElementById('ss-age').value) || 35;
  const averageEarnings = parseFloat(document.getElementById('ss-earnings').value) || 0;
  const retirementAge = parseInt(document.getElementById('ss-retire-age').value) || 67;
  const workYears = parseInt(document.getElementById('ss-years').value) || 35;

  const fullRetirementAge = 67;
  const bendPoint1 = 1174;
  const bendPoint2 = 7078;

  const aime = averageEarnings;
  let pia = 0;
  
  if (aime <= bendPoint1) {
    pia = aime * 0.90;
  } else if (aime <= bendPoint2) {
    pia = bendPoint1 * 0.90 + (aime - bendPoint1) * 0.32;
  } else {
    pia = bendPoint1 * 0.90 + (bendPoint2 - bendPoint1) * 0.32 + (aime - bendPoint2) * 0.15;
  }

  const maxBenefit = 3822;
  pia = Math.min(pia, maxBenefit);

  let adjustment = 0;
  if (retirementAge < fullRetirementAge) {
    const monthsEarly = (fullRetirementAge - retirementAge) * 12;
    if (monthsEarly <= 36) {
      adjustment = -0.0056 * monthsEarly;
    } else {
      adjustment = -0.0056 * 36 - 0.0042 * (monthsEarly - 36);
    }
  } else if (retirementAge > fullRetirementAge) {
    const monthsLate = (retirementAge - fullRetirementAge) * 12;
    adjustment = 0.0067 * monthsLate;
  }

  const monthlyBenefit = pia * (1 + adjustment);
  const annualBenefit = monthlyBenefit * 12;
  const lifetimeBenefit = annualBenefit * 20;

  document.getElementById('ss-results').innerHTML = `
    <div class="results-grid">
      <div class="result-item result-highlight">
        <div class="label">Monthly Benefit</div>
        <div class="value">$${formatCurrency(monthlyBenefit)}</div>
      </div>
      <div class="result-item">
        <div class="label">Annual Benefit</div>
        <div class="value">$${formatCurrency(annualBenefit)}</div>
      </div>
      <div class="result-item">
        <div class="label">20-Year Total</div>
        <div class="value">$${formatCurrency(lifetimeBenefit)}</div>
      </div>
      <div class="result-item">
        <div class="label">${retirementAge < fullRetirementAge ? 'Early' : retirementAge > fullRetirementAge ? 'Delayed' : 'Full'} Retirement</div>
        <div class="value">${(adjustment * 100).toFixed(1)}%</div>
      </div>
    </div>
    <p style="margin-top: 15px; color: var(--text-secondary); font-size: 12px; text-align: center;">
      Full retirement age: 67. Early: -6.7%/year. Delayed to 70: +24%.
    </p>
  `;
}

// ==========================================
// INVOICE CALCULATOR
// ==========================================

function calculateInvoice() {
  const items = [];
  const itemRows = document.querySelectorAll('.invoice-item');
  
  itemRows.forEach(row => {
    const desc = row.querySelector('.invoice-desc').value || '';
    const qty = parseFloat(row.querySelector('.invoice-qty').value) || 0;
    const price = parseFloat(row.querySelector('.invoice-price').value) || 0;
    if (desc && qty && price) {
      items.push({ desc, qty, price, total: qty * price });
    }
  });

  const vatRate = parseFloat(document.getElementById('invoice-vat').value) || 20;
  const discount = parseFloat(document.getElementById('invoice-discount').value) || 0;

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = subtotal * (discount / 100);
  const afterDiscount = subtotal - discountAmount;
  const vat = afterDiscount * (vatRate / 100);
  const total = afterDiscount + vat;

  let itemsHtml = items.map(item => `
    <div class="tax-row">
      <span class="label">${item.desc} (${item.qty} × £${item.price.toFixed(2)})</span>
      <span class="amount">£${formatCurrency(item.total)}</span>
    </div>
  `).join('');

  document.getElementById('invoice-results').innerHTML = `
    <div class="tax-breakdown">
      ${itemsHtml}
    </div>
    <div class="results-grid" style="margin-top: 15px;">
      <div class="result-item">
        <div class="label">Subtotal</div>
        <div class="value">£${formatCurrency(subtotal)}</div>
      </div>
      ${discount > 0 ? `
      <div class="result-item">
        <div class="label">Discount (${discount}%)</div>
        <div class="value">-£${formatCurrency(discountAmount)}</div>
      </div>
      ` : ''}
      <div class="result-item">
        <div class="label">VAT (${vatRate}%)</div>
        <div class="value">£${formatCurrency(vat)}</div>
      </div>
      <div class="result-item result-highlight">
        <div class="label">Total Due</div>
        <div class="value">£${formatCurrency(total)}</div>
      </div>
    </div>
  `;
}

function addInvoiceItem() {
  const container = document.getElementById('invoice-items');
  const row = document.createElement('div');
  row.className = 'invoice-item';
  row.innerHTML = `
    <div class="input-grid" style="grid-template-columns: 3fr 1fr 1fr; gap: 10px;">
      <div class="input-group">
        <input type="text" class="invoice-desc" placeholder="Description" value="">
      </div>
      <div class="input-group">
        <input type="number" class="invoice-qty" placeholder="Qty" value="1">
      </div>
      <div class="input-group">
        <input type="number" class="invoice-price" placeholder="£" value="100">
      </div>
    </div>
  `;
  container.appendChild(row);
}
