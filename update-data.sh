#!/bin/bash
# FinTools Data Update Script
# Run annually after budget announcements (Nov-Dec for following year)

set -e

YEAR=${1:-$(date +%Y)}
NEXT_YEAR=$((YEAR + 1))
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_FILE="$SCRIPT_DIR/tax-data.json"

echo "=== FinTools Data Update ==="
echo "Target year: $NEXT_YEAR/$((NEXT_YEAR + 1))"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_section() { echo -e "\n${YELLOW}=== $1 ===${NC}"; }
print_ok() { echo -e "${GREEN}✓${NC} $1"; }
print_warn() { echo -e "${RED}✗${NC} $1"; }

# ============================================
# UK TAX DATA
# ============================================
print_section "UK Tax Data ($NEXT_YEAR/$((NEXT_YEAR + 1)))"

echo "Check https://www.gov.uk/guidance/rates-and-thresholds-for-employers"
echo ""
echo "Enter UK tax bands for $NEXT_YEAR/$((NEXT_YEAR + 1)):"
echo ""

read -p "Personal Allowance (£) [default: 12570]: " uk_pa
UK_PA=${uk_pa:-12570}

read -p "Basic Rate Limit (£) [default: 50270]: " uk_basic
UK_BASIC=${uk_basic:-50270}

read -p "Additional Rate Threshold (£) [default: 125140]: " uk_add
UK_ADD=${uk_add:-125140}

read -p "NI Primary Threshold (£/yr) [default: 12570]: " uk_ni_pt
UK_NI_PT=${uk_ni_pt:-12570}

read -p "NI Upper Threshold (£/yr) [default: 50270]: " uk_ni_ut
UK_NI_UT=${uk_ni_ut:-50270}

read -p "NI Lower Rate (%) [default: 8]: " uk_ni_lr
UK_NI_LR=${uk_ni_lr:-8}
UK_NI_LR_DECIMAL=$(echo "scale=2; $UK_NI_LR / 100" | bc)

read -p "NI Upper Rate (%) [default: 2]: " uk_ni_ur
UK_NI_UR=${uk_ni_ur:-2}
UK_NI_UR_DECIMAL=$(echo "scale=2; $UK_NI_UR / 100" | bc)

read -p "Dividend Allowance (£) [default: 500]: " uk_div
UK_DIV=${uk_div:-500}

read -p "Capital Gains Annual Exempt (£) [default: 3000]: " uk_cg
UK_CG=${uk_cg:-3000}

echo ""
echo "Student Loan Thresholds:"
read -p "Plan 1 (£) [default: 26100]: " uk_sl1
UK_SL1=${uk_sl1:-26100}

read -p "Plan 2 (£) [default: 27295]: " uk_sl2
UK_SL2=${uk_sl2:-27295}

read -p "Plan 4 (£) [default: 32185]: " uk_sl4
UK_SL4=${uk_sl4:-32185}

read -p "Plan 5 (£) [default: 25000]: " uk_sl5
UK_SL5=${uk_sl5:-25000}

read -p "Postgraduate (£) [default: 21000]: " uk_slpg
UK_SLPG=${uk_slpg:-21000}

print_ok "UK tax data collected"

# ============================================
# US TAX DATA
# ============================================
print_section "US Tax Data ($NEXT_YEAR)"

echo "Check https://www.irs.gov/newsroom/irs-provides-tax-inflation-adjustments"
echo ""
echo "Enter US tax brackets for $NEXT_YEAR:"
echo ""

echo "Single Filer Brackets:"
read -p "10% bracket max ($) [default: 11950]: " us_s10
US_S10=${us_s10:-11950}

read -p "12% bracket max ($) [default: 48475]: " us_s12
US_S12=${us_s12:-48475}

read -p "22% bracket max ($) [default: 103350]: " us_s22
US_S22=${us_s22:-103350}

read -p "24% bracket max ($) [default: 197300]: " us_s24
US_S24=${us_s24:-197300}

read -p "32% bracket max ($) [default: 250525]: " us_s32
US_S32=${us_s32:-250525}

read -p "35% bracket max ($) [default: 626350]: " us_s35
US_S35=${us_s35:-626350}

echo ""
echo "Married Filing Jointly Brackets:"
read -p "10% bracket max ($) [default: 23900]: " us_m10
US_M10=${us_m10:-23900}

read -p "12% bracket max ($) [default: 96950]: " us_m12
US_M12=${us_m12:-96950}

read -p "22% bracket max ($) [default: 206700]: " us_m22
US_M22=${us_m22:-206700}

read -p "24% bracket max ($) [default: 394600]: " us_m24
US_M24=${us_m24:-394600}

read -p "32% bracket max ($) [default: 501050]: " us_m32
US_M32=${us_m32:-501050}

read -p "35% bracket max ($) [default: 752700]: " us_m35
US_M35=${us_m35:-752700}

echo ""
read -p "Social Security Wage Base ($) [default: 176100]: " us_ss
US_SS=${us_ss:-176100}

read -p "401k Contribution Limit ($) [default: 23500]: " us_401k
US_401K=${us_401k:-23500}

read -p "401k Catch-up 50+ ($) [default: 7500]: " us_401k_catch
US_401K_CATCH=${us_401k_catch:-7500}

print_ok "US tax data collected"

# ============================================
# UPDATE JSON FILE
# ============================================
print_section "Updating tax-data.json"

# Create backup
cp "$DATA_FILE" "$DATA_FILE.backup"

# Use Python for JSON manipulation (more reliable than jq)
python3 << EOF
import json

with open('$DATA_FILE', 'r') as f:
    data = json.load(f)

# Update last updated date
data['lastUpdated'] = '$(date +%Y-%m-%d)'

# Add UK data
data['uk']['$NEXT_YEAR'] = {
    'personalAllowance': $UK_PA,
    'basicRate': 0.20,
    'basicLimit': $UK_BASIC,
    'higherRate': 0.40,
    'additionalRate': 0.45,
    'additionalLimit': $UK_ADD,
    'niPrimaryThreshold': $UK_NI_PT,
    'niUpperThreshold': $UK_NI_UT,
    'niLowerRate': $UK_NI_LR_DECIMAL,
    'niUpperRate': $UK_NI_UR_DECIMAL,
    'class2NI': 179.40,
    'dividendAllowance': $UK_DIV,
    'capitalGainsExempt': $UK_CG,
    'studentLoanThresholds': {
        'plan1': $UK_SL1,
        'plan2': $UK_SL2,
        'plan4': $UK_SL4,
        'plan5': $UK_SL5,
        'postgrad': $UK_SLPG
    },
    'studentLoanRates': {
        'plan1': 0.09,
        'plan2': 0.09,
        'plan4': 0.09,
        'plan5': 0.09,
        'postgrad': 0.06
    }
}

# Add US data
data['us']['$NEXT_YEAR'] = {
    'single': [
        {'min': 0, 'max': $US_S10, 'rate': 0.10},
        {'min': $US_S10, 'max': $US_S12, 'rate': 0.12},
        {'min': $US_S12, 'max': $US_S22, 'rate': 0.22},
        {'min': $US_S22, 'max': $US_S24, 'rate': 0.24},
        {'min': $US_S24, 'max': $US_S32, 'rate': 0.32},
        {'min': $US_S32, 'max': $US_S35, 'rate': 0.35},
        {'min': $US_S35, 'max': None, 'rate': 0.37}
    ],
    'married': [
        {'min': 0, 'max': $US_M10, 'rate': 0.10},
        {'min': $US_M10, 'max': $US_M12, 'rate': 0.12},
        {'min': $US_M12, 'max': $US_M22, 'rate': 0.22},
        {'min': $US_M22, 'max': $US_M24, 'rate': 0.24},
        {'min': $US_M24, 'max': $US_M32, 'rate': 0.32},
        {'min': $US_M32, 'max': $US_M35, 'rate': 0.35},
        {'min': $US_M35, 'max': None, 'rate': 0.37}
    ],
    'standardDeduction': {'single': 15000, 'married': 30000},
    'socialSecurity': {'wageBase': $US_SS, 'rate': 0.062},
    'medicare': {'rate': 0.0145, 'additionalThreshold': {'single': 200000, 'married': 250000}},
    'contributionLimits': {
        '401k': $US_401K,
        '401kCatchUp': $US_401K_CATCH
    }
}

with open('$DATA_FILE', 'w') as f:
    json.dump(data, f, indent=2)

print('JSON updated successfully')
EOF

print_ok "tax-data.json updated"

# ============================================
# UPDATE TOOLS.JS EMBEDDED DATA
# ============================================
print_section "Updating tools.js embedded fallback data"

# Update the embedded ukTaxBands
sed -i "s/ukTaxBands = {/ukTaxBands = {\n  $NEXT_YEAR: {\n    personalAllowance: $UK_PA,\n    basicRate: 0.20,\n    basicLimit: $UK_BASIC,\n    higherRate: 0.40,\n    additionalRate: 0.45,\n    additionalLimit: $UK_ADD,\n    niPrimaryThreshold: $UK_NI_PT,\n    niUpperThreshold: $UK_NI_UT,\n    niLowerRate: $UK_NI_LR_DECIMAL,\n    niUpperRate: $UK_NI_UR_DECIMAL,\n    class2NI: 179.40,\n    dividendAllowance: $UK_DIV,\n    capitalGainsExempt: $UK_CG,\n    studentLoanThresholds: { plan1: $UK_SL1, plan2: $UK_SL2, plan4: $UK_SL4, plan5: $UK_SL5, postgrad: $UK_SLPG },\n    studentLoanRates: { plan1: 0.09, plan2: 0.09, plan4: 0.09, plan5: 0.09, postgrad: 0.06 }\n  },/" "$SCRIPT_DIR/tools.js"

print_ok "tools.js updated"

# ============================================
# SUMMARY
# ============================================
print_section "Summary"

echo ""
echo "Updated for tax year: $NEXT_YEAR/$((NEXT_YEAR + 1)) (UK) and $NEXT_YEAR (US)"
echo ""
echo "Files modified:"
echo "  - tax-data.json"
echo "  - tools.js"
echo ""
echo "Backup saved to: tax-data.json.backup"
echo ""
echo -e "${YELLOW}IMPORTANT:${NC}"
echo "  1. Review changes: git diff"
echo "  2. Test all tax calculators"
echo "  3. Commit: git add -A && git commit -m 'Update tax data for $NEXT_YEAR'"
echo "  4. Push: git push"
echo ""
print_ok "Update complete!"
