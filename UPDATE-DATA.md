# FinTools Data Maintenance

## When to Update

| Jurisdiction | Tax Year | Announcement | Effective | Run Script |
|--------------|----------|--------------|-----------|------------|
| UK | Apr 6 - Apr 5 | Autumn Budget (Oct/Nov) | April 6 | Late Nov/Dec |
| US | Jan 1 - Dec 31 | IRS inflation adjustments (Oct/Nov) | January 1 | Late Nov/Dec |

**Recommended:** Run the update script in late November/December after both UK Autumn Budget and US IRS announcements.

## How to Update

```bash
# Make script executable (first time only)
chmod +x update-data.sh

# Run for next tax year (auto-detects)
./update-data.sh

# Or specify year explicitly
./update-data.sh 2026
```

## Data Sources

### UK Tax Data
- [GOV.UK - Rates and thresholds for employers](https://www.gov.uk/guidance/rates-and-thresholds-for-employers)
- [GOV.UK - Income Tax rates](https://www.gov.uk/income-tax-rates)
- [HMRC - National Insurance](https://www.gov.uk/national-insurance-rates-letters)
- [Student Loan repayment thresholds](https://www.gov.uk/repaying-your-student-loan)

### US Tax Data
- [IRS Tax Inflation Adjustments](https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments)
- [Social Security Wage Base](https://www.ssa.gov/oact/cola/cbb.html)
- [401k Contribution Limits](https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-401k-and-profit-sharing-plan-contribution-limits)

## What Gets Updated

### UK
- Personal Allowance
- Basic/Higher/Additional rate thresholds
- NI thresholds and rates
- Dividend Allowance
- Capital Gains annual exempt amount
- Student Loan repayment thresholds

### US
- Tax brackets (Single & Married Filing Jointly)
- Standard Deduction
- Social Security Wage Base
- 401k contribution limits
- Catch-up contribution limits

## Files Modified

1. `tax-data.json` - Primary data source (loaded at runtime)
2. `tools.js` - Embedded fallback data (if JSON fails to load)

## Static Data (Not Auto-Updated)

These contain historical/reference data and don't need regular updates:

| Calculator | Data Type | Notes |
|------------|-----------|-------|
| Historical Exchange Rates | Historical rates | Fixed historical data |
| Cost of Living Indices | City indices | Update manually if significant changes |
| Crypto Rates | Live API | CoinGecko API with fallback |
| Currency Rates | Live API | ExchangeRate-API with fallback |
| BNPL Comparison | Fee structures | Update if providers change terms |

## Manual Updates Required

### Cost of Living Indices (Remote Salary Adjuster)
If you need to update city indices, edit `tools.js`:

```javascript
const colIndices = {
  'London': 100, 'Manchester': 75, ...
};
```

Source: [Numbeo Cost of Living Index](https://www.numbeo.com/cost-of-living/)

### BNPL Provider Fees
If provider terms change, edit `tools.js`:

```javascript
const bnplProviders = [
  { name: 'Klarna', feeAfterWeeks: 6, feePercent: 0, lateFee: 7 },
  ...
];
```

## Testing After Update

1. Open FinTools locally
2. Test UK Income Tax calculator with new tax year
3. Test US Income Tax calculator
4. Verify "Tax rates last updated" footer shows current date
5. Check that tax year selectors show new year

## Rollback

If something goes wrong:

```bash
# Restore backup
cp tax-data.json.backup tax-data.json

# Or restore from git
git checkout HEAD -- tax-data.json tools.js
```
