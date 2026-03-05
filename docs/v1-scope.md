# Library Dashboard — v1 Scope

## Purpose
This dashboard provides a **high-level, read-only overview** of library circulation, demand, and collection activity using data exported from Koha.

Version 1 is intentionally limited in scope. Its goals are:
- clarity over completeness
- consistency over experimentation
- confidence in numbers shown

The dashboard is designed to support **operational awareness and summary reporting**, not detailed analysis.

---

## Audience
v1 is intended for:
- library management
- senior staff
- internal reporting and briefing

It is **not** intended to replace Koha reports or staff-facing operational tools.

---

## Data Source
- All data originates from **Koha saved reports**
- Reports are exported to CSV and processed by an automated build script
- The dashboard **does not query Koha directly**
- Data represents the reporting period defined in each CSV

---

## Reporting Period
- KPIs generally represent activity **within a defined reporting period** (e.g. monthly)
- Some collection metrics may be **all-time**, where this aligns with common reporting expectations
- The reporting period is visible in the underlying data but may not be shown prominently in the UI in v1
-For KPIs with historical comparison enabled, the dashboard compares the current reporting period to the same calendar period in the previous year, if available.
---

## Included in v1

### Headline KPIs (Primary)
These metrics are shown prominently and require minimal explanation:

- Total loans
- Active borrowers
- Holds placed
- New items added

---

### Secondary KPIs
These metrics are shown in a secondary or expandable context:

- Loans per active borrower
- Renewals count
- Average loan duration

These figures may be influenced by local policy or system configuration and should be interpreted with context.

---

### Equity & Coverage Widgets
Visual breakdowns showing:

- Loans by branch / location
- Loans by item type
- Loans by borrower category

These widgets are intended to highlight distribution patterns, not performance rankings.

---

## Explicitly Excluded from v1

The following metrics are **intentionally not shown by default** in v1 due to their interpretive risk:

- Percentage of collection never borrowed
- Overdue rate
- In-library use

These metrics may be calculated internally for validation or future use but are not exposed in the initial release.

---

## Design Constraints
- Static frontend (HTML, CSS, JavaScript)
- No authentication or role-based access in v1
- No real-time data updates
- No historical trend comparison across periods

---

## Non-Goals
v1 does **not** aim to:
- replicate Koha reporting functionality
- provide item-level or borrower-level data
- support ad-hoc querying or filtering
- enable data export from the dashboard

---

### Historical Comparison (Optional)
When enabled, the dashboard compares selected KPIs to the same reporting period in the previous year.

Comparison is:
- optional
- limited to management-safe KPIs
- based on identical calendar periods only

## Future Considerations (Out of Scope for v1)
These may be considered in later versions:

- Historical trend comparisons (month-over-month, year-over-year)
- Role-based KPI visibility
- Interactive filtering and drill-down
- Automated ingestion of Koha report emails
- Public-facing dashboard views

---

## Change Control
Once v1 is released:
- KPIs will not be removed without notice
- Definitions will not change retroactively
- Additions will be clearly documented and versioned

This document exists to protect both the dashboard and its users from unplanned scope expansion.



