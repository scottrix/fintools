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

function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value) || 0;
    const from = document.getElementById('currency-from').value;
    const to = document.getElementById('currency-to').value;
    
    let result;
    if (from === to) {
        result = amount;
    } else {
        const rate = exchangeRates[from]?.[to] || 1;
        result = amount * rate;
    }
    
    document.getElementById('currency-result').value = result.toFixed(4);
    
    const rate = from === to ? 1 : (exchangeRates[from]?.[to] || 1);
    document.getElementById('rate-info').innerHTML = 
        `<strong>1 ${from}</strong> = <strong>${rate.toFixed(4)} ${to}</strong><br>
        <span style="font-size: 12px; color: var(--text-secondary);">Rates are approximate. Check your bank for actual rates.</span>`;
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
