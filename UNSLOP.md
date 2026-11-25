# Unslop notes

Pass made with the unslop skill by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0.

## Audit (first build)

Level: light. The template was built against the skill from the start (neutral ink surfaces, one cobalt accent, weights 400 to 600, sentence case, numbers-only figures, one main chart), so the first render showed a handful of real signs rather than a pile:

- Overview, cash flow header: the month's net shown as a big red figure, so a semantic color acted as a second accent
- Overview, cash flow header: "In $19,650.00 vs $29,480.00 last month" compared a month to date with a full month, a change with a misleading reference
- Overview, net position: the change against last month didn't match the month's net in the chart (two numbers for one fact)
- Budgets: fixed costs paid in full (rent, insurance) shown in warning amber, so three of ten bars were highlighted and the warning meant nothing
- Overview on phones: the 12 month chart shrank to 6 to 7px labels
- Bills on phones: the table ran 170px past the screen edge; Activity at 360px overflowed by 21px from the chart header
- Bills on phones: hiding the due column dropped the date entirely
- Bills side panel: "Bills, monthly average" read as a statistic it wasn't

None of: gradients, glows, gradient text, emoji, uppercase tracked labels, pill badges, greeting headline, sparklines, hover scale, transition-all, looping motion, heavy weights.

## Direction

- Product: a money overview for a small business (a fictional landscaping company, Greenway Grounds) or a household: balances, cash flow, transactions, budgets and bills
- Character: steady, plain-spoken, exact to the cent
- World: the bank statement and the ruled ledger book kept in the truck's glove box, the seasons of outdoor work
- Moments: the accounts drawn as their real cards (soft card stock, engraved arcs, a metal chip on the credit card), and the mirrored cash flow chart where the season shows, the current month in cobalt
- Signature: ledger amounts, signed in mono with a true minus and a filled (cleared) or open (pending) mark, the same on every page

## Fixes

- Spacing: rows on 56px with 8px steps, panels 24px padding (16px on phones), rail links 60 by 56 with 4px gaps
- Color: the big net figure back to primary text, the sign carries the meaning; amber only for categories at 90 to 99% and ahead of pace, red only over the limit
- Copy: "In $19,650.00, out $20,911.30" instead of the uneven comparison; net position change now equals the month's net; "All bills, per month"
- Layout: phones get a 6 month version of the chart at readable size, the chart header stacks, the bills table becomes two-line rows with the due date in the subline and the action below
- Type and details: unchanged (Plex Sans and Plex Mono, 400 to 600, tabular figures, 8/14/16 radii)
- Motion: unchanged (one 360ms fade and rise per page, color transitions only, 2px lift on the account cards)

## Screenshots

- screenshot-2: Activity (transactions grouped by day, filters and totals)
- screenshot-3: Budgets (category limits with pace markers and over-budget states)
