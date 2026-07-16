# Open Questions / Gaps

Things I noticed while writing the API docs that need your decision — not implementation details I can just pick for you, per AGENTS.md ("ask before adding a library", "no auth/validation decided yet").

1. **MongoDB client library** — nothing is installed yet. Options:
   - Native `mongodb` driver — lighter, matches the "keep it simple" philosophy, but you write query/validation code by hand.
   - `mongoose` — schemas + validation + casting built in, less boilerplate, but it's a bigger dependency and a different mental model than the rest of the stack.
   - My lean: native driver, since the schema here is tiny (2 collections) and Mongoose's schema layer isn't buying much yet. Confirm before I install anything.

2. **Validation library** — same question as above but for request-body validation (Zod is the natural fit given TypeScript + the rest of the stack). Needed for both modules regardless of the Mongo client choice.

3. **Case-insensitive uniqueness on medicine name** — should "Panadol" and "panadol" be treated as the same medicine? Doc 01 assumes yes (reject duplicates). If no, drop the unique index and just allow duplicates.

4. **Pagination on `GET /api/lists`** — skipped for v1 since this is a personal app and lists accumulate slowly (one save per month, realistically). Flag if you expect this to grow large enough to need it later.

5. **No delete/edit on saved lists** — confirmed as intentionally out of scope per your instructions. Worth asking anyway: if someone saves a list with a typo or wrong month, there's currently no way to fix or remove it short of a direct DB edit. Fine for v1, but likely the first thing requested after launch.

6. **Auth** — still none, per AGENTS.md. This app stores medicine names (arguably personal health data) with zero access control once it's on a real server instead of localhost. Not blocking for v1, but worth a conscious "yes, later" or "yes, now" rather than staying silent on it indefinitely.

7. **`month` as a string vs. a real date** — kept as `"YYYY-MM"` string to match the existing `<input type="month">` and `MedicineList.month` type exactly. No change needed unless you want month-range queries/sorting beyond simple string sort (which happens to work fine for `YYYY-MM`).
