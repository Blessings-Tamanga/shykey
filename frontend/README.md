# Shykey frontend

Shykey is a mobile-first React application built with Vite and TypeScript. It keeps the original prototype’s phone-width canvas, gradient backdrop, typography, mode colors, mascot, and mission-to-check-in loop while separating each screen and its reusable UI.

## Run locally

```sh
npm install
npm run dev
```

Create and verify the production build with `npm run build`, then preview it with `npm run preview`.

## Project structure

```text
src/
  components/  Shared buttons, mascot, mode cards, iconography, and screen helpers
  data/        Temporary demo content and sample readings
  hooks/       Shared demo state and theme behavior
  layouts/     Shared routed application shell
  pages/       Home, Mission, Check-in, Win, Chat, Read, and Profile screens
  services/    Mock service and typed FastAPI-compatible service adapter
  styles/      Design tokens, responsive styling, and reusable UI styles
  types/       Shared application and service contracts
  utils/       Local demo persistence and optional haptics
```

The app uses React Router paths `/`, `/mission`, `/checkin`, `/win`, `/chat`, `/read`, and `/profile`. `mockApi` is the active service, so screens work without a backend. Mock copy and example outputs live in `src/data/mockData.ts`; service contracts and the replaceable API adapter live in `src/services/`. The adapter targets documented `/v1` FastAPI endpoints and can be created with `createApiService(baseUrl, getAccessToken)` when the backend is ready. Client-side streak and mission data are demo state, not authoritative records.

## Notes

- Demo progress is stored locally under `shykey:v1`; reset it from Profile.
- The message-reading screen uses fixed illustrative readings. It does not send or persist pasted text in the mock experience.
- The UI uses the documented fixed support levels without presenting them as probabilities.
- No PWA, authentication, or live backend integration is enabled in this frontend milestone.
