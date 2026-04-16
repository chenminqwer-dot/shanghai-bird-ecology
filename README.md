# shanghai-bird-ecology

Static React + TypeScript data visualization page for the bird ecology CSV files in `public/data`.

## Current scope

- Single-page poster-like layout
- No language toggle
- No compare or explore controls
- No modals, clickable cards, map, or network graph
- All displayed values derived from the four existing CSV files only

## Source files

- `ERDP-2021-02.2.1-Bird_List.csv`
- `ERDP-2021-02.3.1-Locality_Infor.csv`
- `ERDP-2021-02.5.1-Source_List.csv`
- `Shanghai_Bird_Biodiversity.csv`

## Final page structure

- Hero / Title
- Overview
- Park-level charts
- Taxonomy and migration charts
- Relationship matrix
- Findings
- Footer

## Main files

- `src/App.tsx`
- `src/styles.css`
- `src/utils/storyData.ts`
- `src/hooks/useCsvDatasets.ts`
- `src/utils/csv.ts`
- `src/data/datasets.ts`

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```
