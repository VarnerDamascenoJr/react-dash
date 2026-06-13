# Domain

## Scope

### Confirmed facts

- The application presents itself as an operations/admin dashboard.
- The main visible domain concepts in the UI are:
  - users
  - products
  - orders
  - balance/earnings
  - transactions
  - profile details
- These concepts are currently represented through mock data and mock UI states.

### Important limitation

The repository does not contain a backend or a formal business domain model. Because of that, many business meanings remain only partially observable through labels and mocked content.

## Observable Domain Concepts

### Authentication session

**Confirmed**

- A user can log in through a demo login flow.
- A logged-in user has `name`, `role`, `email` and `avatar`.
- Session persistence is client-side via `localStorage`.

**Evidence**

- [src/types.ts](/home/varner/aprendizagem/projetos/react-dash/src/types.ts:1)
- [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1)

### Theme mode

**Confirmed**

- The UI supports two explicit theme actions, `LIGHT` and `DARK`, plus a `TOGGLE`.
- Theme mode affects CSS variables and component styling.

**Evidence**

- [src/context/darkModeReducer.ts](/home/varner/aprendizagem/projetos/react-dash/src/context/darkModeReducer.ts:1)
- [src/style/dark.scss](/home/varner/aprendizagem/projetos/react-dash/src/style/dark.scss:1)

### Users

**Confirmed**

- User rows expose:
  - `id`
  - `username`
  - `img`
  - `email`
  - `status`
  - `age`
- User statuses are limited to:
  - `active`
  - `passive`
  - `pending`

**Evidence**

- `UserRow` type in [src/types.ts](/home/varner/aprendizagem/projetos/react-dash/src/types.ts:1)
- mock rows in [src/datatablesource.tsx](/home/varner/aprendizagem/projetos/react-dash/src/datatablesource.tsx:1)

### Form-driven entity creation

**Confirmed**

- There are two field-definition groups:
  - `userInputs`
  - `productInputs`
- The “new” page renders inputs dynamically from metadata.

**Evidence**

- [src/formSource.ts](/home/varner/aprendizagem/projetos/react-dash/src/formSource.ts:1)
- [src/pages/new/New.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/new/New.tsx:1)

### Dashboard KPIs

**Confirmed**

- Home page widgets support four types:
  - `user`
  - `order`
  - `earnings`
  - `balance`
- Each widget has title, money flag, link label and icon.

**Evidence**

- [src/components/widgets/Widget.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/widgets/Widget.tsx:1)

**Confirmed limitation**

- All widget values are hardcoded (`amount = 100`, `diff = 20`).

### Revenue / spending visualization

**Confirmed**

- The chart uses six months of hardcoded revenue-like data.
- The single profile page presents a spending chart.

**Evidence**

- [src/components/chart/Chart.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/chart/Chart.tsx:1)
- [src/pages/single/Single.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/single/Single.tsx:1)

## Observable Rules

### Rule 1: protected navigation requires an authenticated client session

- Module: auth / routing
- Evidence: [src/components/auth/ProtectedRoute.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/auth/ProtectedRoute.tsx:1)
- Behavior:
  - if `isAuthenticated` is false, navigation is redirected to `/login`
- Status: confirmed fact

### Rule 2: authenticated users should not remain on the login page

- Module: auth / routing
- Evidence: [src/components/auth/PublicOnlyRoute.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/auth/PublicOnlyRoute.tsx:1)
- Behavior:
  - if `isAuthenticated` is true, navigation to `/login` redirects to `/`
- Status: confirmed fact

### Rule 3: demo login requires a specific email/password pair

- Module: auth
- Evidence: [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1), [src/config/auth.ts](/home/varner/aprendizagem/projetos/react-dash/src/config/auth.ts:1)
- Behavior:
  - login succeeds only when the normalized email matches the configured demo email and the password matches the configured demo password
- Exception:
  - failure throws a generic demo-access error
- Status: confirmed fact

### Rule 4: deleting a row in the users grid only affects local screen state

- Module: datatable
- Evidence: [src/components/datatable/Datatable.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/datatable/Datatable.tsx:1)
- Behavior:
  - clicking Delete filters the local `data` array
- Status: confirmed fact

### Rule 5: form fields are driven by metadata instead of hardcoded JSX fields

- Module: new page / form metadata
- Evidence: [src/formSource.ts](/home/varner/aprendizagem/projetos/react-dash/src/formSource.ts:1), [src/pages/new/New.tsx](/home/varner/aprendizagem/projetos/react-dash/src/pages/new/New.tsx:1)
- Behavior:
  - field rendering iterates over the `inputs` prop
- Status: confirmed fact

### Rule 6: theme can be forced to light or dark from the sidebar and toggled from the navbar

- Module: theme
- Evidence: [src/components/sidebar/Sidebar.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/sidebar/Sidebar.tsx:1), [src/components/navbar/Navbar.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/navbar/Navbar.tsx:1)
- Status: confirmed fact

## Inferences That Should Not Be Overstated

- The application may be intended to simulate CRM or commerce admin behavior.
- “Users,” “products,” “orders,” and “transactions” appear to be illustrative rather than tied to a real domain contract.
- The current role string `Operations Lead` suggests an operations dashboard, but no authorization matrix exists in code.

These are inferences, not confirmed business rules.

## Unknowns

- No source confirms how a real user should be created, updated or persisted.
- No source confirms product lifecycle rules.
- No source confirms financial calculations for earnings, balance or revenue.
- No source confirms whether the current labels and cards match any real business KPI definition.
