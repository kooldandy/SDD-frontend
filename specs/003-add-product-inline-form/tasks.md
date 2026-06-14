# Tasks: Add Product Inline Form

**Input**: Design documents from `specs/003-add-product-inline-form/`

**Prerequisites**: `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/`, `quickstart.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing frontend project and test tooling support the add-product inline form feature.

- [ ] T001 Verify `package.json` includes React, Vite, TypeScript, Axios, Vitest, and Playwright in `package.json`
- [ ] T002 Verify `tsconfig.json` supports React JSX and strict compiler settings in `tsconfig.json`
- [ ] T003 Verify `vite.config.ts` includes the React plugin in `vite.config.ts`
- [ ] T004 Verify `src/main.tsx` renders `src/app/App.tsx` in `src/main.tsx`
- [ ] T005 Verify current `src/products/ProductManagementPage.tsx` supports row edit state and product list rendering
- [ ] T006 Verify test helpers or MSW setup support product list and create/update integration scenarios in `src/test/` files

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Align domain types, validation, API boundaries, and shared test support needed for add-product and mutual exclusion behavior.

- [ ] T007 [P] Confirm product model types include `id`, `name`, `description`, `price`, and `quantity` in `src/products/productTypes.ts`
- [ ] T008 [P] Confirm product validation rules support non-empty name, price > 0, and quantity >= 0 in `src/products/productValidation.ts`
- [ ] T009 [P] Verify product API client can create, list, and update products in `src/products/productApiClient.ts`
- [ ] T010 [P] Verify product service functions for create, list, and update products in `src/products/productService.ts`
- [ ] T011 [P] Add or confirm mock handlers for product list, create, and update flows in `src/test/handlers.ts`
- [ ] T012 [P] Add or confirm reusable render utilities for product page testing in `src/test/renderProductPage.tsx`

---

## Phase 3: User Story 1 - Open Add Product Form (Priority: P1)

**Goal**: Add a button that opens an inline add-product form on the existing product page.

**Independent Test**: When the user clicks Add Product, the form appears with fields for name, description, price, and quantity.

- [ ] T013 [US1] Add an Add Product button to `src/products/ProductManagementPage.tsx`
- [ ] T014 [US1] Render the add-product form inline on the page when the button is clicked in `src/products/ProductManagementPage.tsx`
- [ ] T015 [US1] Ensure the form includes fields for name, description, price, and quantity in `src/products/components/ProductForm.tsx`
- [ ] T016 [US1] Add cancel behavior that closes the form without submitting in `src/products/ProductManagementPage.tsx`
- [ ] T017 [US1] Add tests verifying the add form opens, displays fields, and cancels correctly in `tests/unit/ProductManagementPage.add-form.test.tsx`

---

## Phase 4: User Story 2 - Submit Add Product Form (Priority: P2)

**Goal**: Validate add input, submit a new product, refresh the list, and close the form on success.

**Independent Test**: Submit valid input and verify the product list updates and the add form closes.

- [ ] T018 [US2] Wire `createProduct` service call from `src/products/productService.ts` into add form submission in `src/products/ProductManagementPage.tsx`
- [ ] T019 [US2] Add field-level validation feedback for invalid name, price, and quantity in `src/products/components/ProductForm.tsx`
- [ ] T020 [US2] Refresh or reload the visible product list after successful creation in `src/products/ProductManagementPage.tsx`
- [ ] T021 [US2] Display success or failure feedback after add submission in `src/products/ProductManagementPage.tsx`
- [ ] T022 [US2] Add tests for successful create, validation failure, and create-service failure paths in `tests/unit/ProductManagementPage.add-submit.test.tsx`

---

## Phase 5: User Story 3 - Mutual Exclusion Between Add and Edit (Priority: P3)

**Goal**: Prevent the Add Product workflow and row edit workflow from being active at the same time.

**Independent Test**: Open the add form and verify all edit buttons are disabled; open row edit and verify the Add Product button is disabled.

- [ ] T023 [US3] Disable the Add Product button when any product row edit mode is active in `src/products/ProductManagementPage.tsx`
- [ ] T024 [US3] Disable edit action buttons while the add-product form is open in `src/products/ProductManagementPage.tsx`
- [ ] T025 [US3] Ensure the add form closes before an edit mode can begin and vice versa in `src/products/ProductManagementPage.tsx`
- [ ] T026 [US3] Add tests for mutual exclusion between add form open state and row edit state in `tests/unit/ProductManagementPage.add-edit-exclusion.test.tsx`

---

## Phase 6: Polish & Validation

**Purpose**: Confirm the added feature behaves cleanly and is documented for review.

- [ ] T027 [P] Add user-visible disabled-state text or hints explaining why add/edit controls are unavailable in `src/products/ProductManagementPage.tsx`
- [ ] T028 [P] Add responsive layout and styling refinements for the inline add form in `src/styles.css`
- [ ] T029 [P] Add quickstart validation notes for add-product and mutual-exclusion behavior in `specs/003-add-product-inline-form/quickstart.md`
- [ ] T030 [P] Perform manual validation of add form open, submit, cancel, and edit-blocked behavior and record results in `specs/003-add-product-inline-form/quickstart.md`
- [ ] T031 [P] Clean up any unused or duplicate add/edit workflow state logic in `src/products/ProductManagementPage.tsx`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1: Setup must be confirmed before any implementation begins.
- Phase 2: Foundational domain and API support must be ready before UI feature work.
- Phase 3: Add form UI can begin after foundational support is confirmed.
- Phase 4: Add submit flow depends on the add form UI and validation support.
- Phase 5: Mutual exclusion behavior depends on both add form and edit mode support.
- Phase 6: Polish depends on the core add/edit feature implementation.

### Parallel Opportunities

- T007–T012 can run in parallel during foundational setup.
- T013–T017 can run in parallel while the add form UI is designed.
- T018–T022 can run in parallel with add form UI stabilization.
- T023–T026 can run in parallel once add and edit states exist.
- T027–T031 can run in parallel during polish and validation.
