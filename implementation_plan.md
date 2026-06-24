# Implementation Plan: Busan Festival Information Hub

This plan outlines the steps to build a high-quality, responsive web application for Busan Festival Information using **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Leaflet.js** for interactive maps.

---

## User Review Required

> [!IMPORTANT]
> **Tailwind CSS Version Choice:**
> By default, the latest `create-next-app` installs Next.js 15, which uses **Tailwind CSS v4**. Tailwind v4 does away with `tailwind.config.js` and configures theme extensions in the CSS file (`src/app/globals.css`) using `@theme`.
> **Recommendation:** We will use the latest Tailwind CSS v4, which is the default in Next.js 15 and is faster and cleaner. If you prefer Tailwind CSS v3, please let us know.
>
> **Node.js Path Handling:**
> Since `node` is installed in `C:\Program Files\nodejs` but not registered in the system's global environment variables (`PATH`), all build and run commands will be executed by prepending the path: `$env:PATH = "C:\Program Files\nodejs;" + $env:PATH;`.

---

## Open Questions

1. **Map Integration choice:**
   - We plan to use **Leaflet.js** via `react-leaflet`. It is free, open-source, does not require an API key, and is fully customizable. If you prefer Naver Maps or Kakao Maps (which require registering for developer API keys), please let us know.
2. **Detail Page vs. Modal:**
   - We will support **both**:
     - Clicking a festival card opens a beautiful, animated modal for quick details.
     - We will also support a direct link (e.g. `/festival/[id]`) for search engines and direct sharing.

---

## Proposed Changes

### Project Initialization

We will initialize the Next.js project in the current directory using the following non-interactive command:
```powershell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; & "C:\Program Files\nodejs\npx.cmd" -y create-next-app@latest ./ --typescript --tailwind --app --src-dir --eslint --import-alias "@/*" --use-npm --yes
```

---

### Component & Library Structure

We will structure the application in the `src/` directory:

```
src/
├── app/
│   ├── layout.tsx         # Root layout with responsive navigation & styling
│   ├── page.tsx           # Home page with hero, search, filters & festival lists
│   ├── map/
│   │   └── page.tsx       # Map page displaying all festivals in Busan using Leaflet
│   ├── favorites/
│   │   └── page.tsx       # Saved/bookmarked festivals view
│   └── globals.css        # Tailwind directives and customized styling
├── components/
│   ├── Header.tsx         # Modern navbar with glassmorphism effects
│   ├── Footer.tsx         # Clean footer
│   ├── FestivalCard.tsx   # Individual festival card with image, badges, animations
│   ├── FestivalModal.tsx  # Detailed overlay for individual festivals
│   ├── MapComponent.tsx   # Map renderer using react-leaflet (Client Component)
│   └── SkeletonCard.tsx   # Loading states for the dashboard
├── lib/
│   ├── api.ts             # Fetching and sanitizing data from getFestivalKr API
│   └── types.ts           # Type definitions for the API response
```

#### [NEW] [types.ts](file:///c:/Users/lmy45/PNU/Vibe_edu/src/lib/types.ts)
Define TypeScript interfaces matching the Busan Festival API response schema.
- Sanitized dataset structure.
- Fields mapping (`UC_SEQ`, `MAIN_TITLE`, `GUGUN_NM`, `LAT`, `LNG`, `PLACE`, `TITLE`, `SUBTITLE`, `USAGE_DAY_WEEK_AND_TIME`, `MAIN_IMG_NORMAL`, `MAIN_IMG_THUMB`, `ITEMCNTNTS`, `MIDDLE_SIZE_RM1`, etc.).

#### [NEW] [api.ts](file:///c:/Users/lmy45/PNU/Vibe_edu/src/lib/api.ts)
Implement data fetcher with cache support.
- Removes trailing 다국어 suffix like `(한,영, 중간,중번,일)` from titles.
- Sanitizes coordinates (sets fallback default coordinates if API lat/lng is invalid).
- Standardizes content paragraphs.

#### [NEW] [MapComponent.tsx](file:///c:/Users/lmy45/PNU/Vibe_edu/src/components/MapComponent.tsx)
Build Leaflet.js map component wrapper with dynamic loading (to prevent Next.js SSR build errors since Leaflet uses `window` APIs).
- Render customized map pins representing festivals.
- Click to open details.

#### [MODIFY] [page.tsx](file:///c:/Users/lmy45/PNU/Vibe_edu/src/app/page.tsx)
Create a premium dashboard UI.
- Vibrant hero banner with sea theme and search bar.
- Filters panel: District Selector, Month Selector, Price Selector.
- Grid list of festivals with pagination or infinite scroll.

---

## Verification Plan

### Automated Build Verification
Verify if Next.js compiles and builds clean:
```powershell
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npm run build
```

### Manual Verification
1. Verify search & filter capabilities (type "해운대", select "수영구", filter by month).
2. Save favorites (localStorage check, check if persistence remains after reloading).
3. Test responsiveness (Mobile, Desktop).
4. Run locally via development server:
   ```powershell
   $env:PATH = "C:\Program Files\nodejs;" + $env:PATH; npm run dev
   ```
