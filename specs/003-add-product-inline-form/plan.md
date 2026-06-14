# Implementation Plan: Add Product Inline Form

**Branch**: `master` | **Date**: 2026-06-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-add-product-inline-form/spec.md`

**Note**: This plan is based on the existing Vite React TypeScript frontend and extends the current product management page with an inline Add Product form and mutual exclusion between add and edit workflows.

## Summary

Add an inline product creation flow to the product management page. The feature introduces an Add Product button that opens a form on the current screen to capture name, description, price, and quantity. On successful submission, the form closes, the product list is refreshed, and the UI prevents conflicts by disabling edit controls while adding and disabling the add button while an edit is active.

## Technical Context

**Language/Version**: TypeScript 5.x, React 18

**Primary Dependencies**: React, Axios, Vite, Vitest, @testing-library/react, MSW, Playwright

**Storage**: UI state in browser memory; product data loaded from the existing product service boundary and refreshed after successful add operations

**Testing**: Vitest unit/component tests, Playwright end-to-end validation, manual quickstart verification in Vite dev server

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Single frontend web application using Vite + React + TypeScript

**Performance Goals**: Add form opens without navigation; a successful add refreshes the product list and closes the form in the same interaction; add/edit mutual exclusion is immediately visible to the user.

**Constraints**: The add form must remain on the existing page, use the current product data model, and enforce that only one of add or edit workflows is active at a time.

**Scale/Scope**: One feature on the product management screen focused on inline product creation and existing edit-flow coexistence.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- User-first specification: PASS — the plan directly addresses add form opening, validation, refresh, and add/edit exclusivity.
- Incremental delivery: PASS — the feature can be implemented as an extension of the current product management page with minimal risk.
- Validation before implementation: PASS — the plan keeps the workflow observable and testable through states for opening, closing, success, failure, and cancel.
- Feedback states: PASS — the add form includes explicit success/failure and disabled-state behaviors.
- Simplicity and traceability: PASS — the implementation remains within the existing page and service boundaries.

## Project Structure

### Documentation (this feature)

```text
specs/003-add-product-inline-form/
├── plan.md
└── spec.md
```

### Source Code (repository root)

```text
src/
├── app/
│   └── App.tsx
├── products/
│   ├── components/
│   │   └── ProductEditForm.tsx
│   ├── productApiClient.ts
│   ├── productService.ts
│   ├── productTypes.ts
│   ├── productValidation.ts
│   └── ProductManagementPage.tsx
├── test/
│   ├── handlers.ts
│   ├── renderProductPage.tsx
│   └── setup.ts
├── main.tsx
`-- styles.css
```

**Structure Decision**: Use the existing single frontend application layout. The feature extends `src/products/ProductManagementPage.tsx` and reuses the shared product service and validation logic.

## Complexity Tracking

No constitution violations identified.

## Phase 0: Research

The repository already contains the product model, list rendering, and API service boundary. The new add inline form should integrate with the existing product page state and re-fetch the product list on successful creation.

## Phase 1: Design & Contracts

Design artifacts to support this feature include:

- `data-model.md` describing add form state, disable rules, and refresh flow
- `contracts/` capturing add form UX and mutual exclusion semantics
- `quickstart.md` capturing add form validation and success checks

## Post-Design Constitution Check

- User-first specification: PASS — the design keeps add, validation, and mutual exclusion explicit.
- Incremental delivery: PASS — the add feature is scoped to the current page and can be validated independently.
- Validation before implementation: PASS — add/cancel/failure behavior is clearly defined.
- Feedback states: PASS — success, failure, and disabled-state feedback are explicit.
- Simplicity and traceability: PASS — no new architectural patterns are introduced.
