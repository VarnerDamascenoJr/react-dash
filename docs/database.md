# Database And Persistence

## Confirmed persistence model

### Browser-side persistence only

The repository does not contain a database layer, ORM, migrations or server persistence logic.

The only confirmed persistence mechanism is browser `localStorage`.

### Confirmed persisted key

- `react-dash.auth.user`

### Confirmed persisted payload

- serialized demo authenticated user object

### Evidence

- [src/context/authContext.tsx](/home/varner/aprendizagem/projetos/react-dash/src/context/authContext.tsx:1)

## What is not present

### Confirmed absence

- No SQL database client
- No NoSQL client
- No Prisma, TypeORM, Sequelize, Mongoose or similar ORM setup
- No repository pattern for persistence
- No migrations directory
- No schema files
- No transaction handling code
- No cache layer such as Redis

## Domain-like data currently stored in code

### Mock user list

- Stored in [src/datatablesource.tsx](/home/varner/aprendizagem/projetos/react-dash/src/datatablesource.tsx:1)
- Used by `Datatable`
- Not persisted outside component lifecycle

### Mock transactions

- Stored inline in [src/components/table/Table.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/table/Table.tsx:1)
- Not persisted

### Form metadata

- Stored in [src/formSource.ts](/home/varner/aprendizagem/projetos/react-dash/src/formSource.ts:1)
- Describes frontend fields only

## Constraints And Duplicate Rules

### Confirmed

- No uniqueness rules are enforced in code for users, products or any other domain entity.
- No schema-level or storage-level constraints are visible in the repository.

### Unknown

- Real duplicate prevention strategy is unknown because no backend or persistence layer is present.

## Dates And Timezones

### Confirmed

- The current app displays hardcoded date text in the UI.
- No date persistence logic exists.
- No timezone handling library is present in source code.

### Evidence

- [src/components/navbar/Navbar.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/navbar/Navbar.tsx:1)
- [src/components/table/Table.tsx](/home/varner/aprendizagem/projetos/react-dash/src/components/table/Table.tsx:1)

## Consistency Risks

### Confirmed

- Auth session can become stale or tampered with because it is stored fully in client `localStorage`.
- Delete behavior in the users grid does not persist and will reset on reload.
- Form submission does not save data anywhere.

### Operational interpretation

- From a persistence standpoint, the app is currently a demo UI with ephemeral in-memory state plus a persistent local demo session.
