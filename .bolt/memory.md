# Project memory

## Product intent & audience

- Uptime monitoring SaaS dashboard named "PulseWatch".
- Target users: DevOps / site-reliability / IT teams monitoring multiple websites.
- Frontend-only at this stage; real monitoring intentionally not implemented.
- Demo data is used initially and must be clearly labeled (banner + footer note).

## Brand personality & voice

- Professional, modern SaaS tone.
- Trustworthy and technical; clarity over marketing language.

## Visual design & UX direction

- Clean SaaS dashboard aesthetic; production-worthy, not generic/cookie-cutter.
- Components built so far: overview stat cards, monitors table, individual monitor status cards, interactive uptime history chart, incident history section, demo-data banner.
- Custom SVG line/area chart (no chart library installed); supports 12h/24h/48h toggles.
- Monitor status cards include 48-hour uptime bar strips plus uptime/response stats.
- Monitors table columns adapt to screen size (hide/reorder on mobile).
- Responsive layout for desktop and mobile.
- Icons from lucide-react; Tailwind for styling.
- No extra UI/theme packages added unless explicitly requested.

## Decisions, constraints & rationale

- Stack: Vite + React + TypeScript + Tailwind CSS.
- Path alias `@/` → `src/`; avoid deep relative imports.
- Data flows through a single service function returning sample data, isolating future backend integration to one location.
- Project prepared for future Node.js backend integration; only the service layer needs to change to fetch live data.
- Chart implemented with hand-rolled SVG to avoid adding a charting dependency.
- Components organized for reuse across dashboard sections.

## Open questions & assumptions

- Backend API contract not yet defined; service layer structure is a placeholder assumption.
- Auth, multi-tenant/org support, and alerting configuration not addressed yet.
- Real-time vs polling update model undecided for future backend.
- Demo dataset shape assumed from dashboard needs (URL, status, response time, last checked, 24h/48h uptime, incidents with severity/duration).