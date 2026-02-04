## Repository snapshot

- Language: Go (modules). Entry: `main.go`.
- Web framework: Gin (HTTP handlers in `routes/`).
- Database: SQLite via `database/sql` and `github.com/mattn/go-sqlite3` (`db/api.db` created at runtime by `db.InitDB`).

## High-level architecture (why/what)

- main.go: initializes DB (`db.InitDB()`), creates a Gin server, and calls `routes.RegisterRoutes(server)`.
- routes/: defines HTTP endpoints and groups protected routes with `middlewares.Authenticate`.
- models/: thin active-record style structs (Event, User) that call `db.DB` directly for CRUD and registration logic.
- utils/: JWT generation/verification and password hashing helpers used across auth flows.

Design notes for an AI editing the repo

- Authentication: `middlewares.Authenticate` expects a raw token in the `Authorization` header (no "Bearer " parsing). It calls `utils.VerifyToken` and sets `userId` on the Gin context: `context.Set("userId", userId)`.
- Tokens: created with `utils.GenerateToken(email, userId)` using a constant `secretKey` in `utils/jwt.go` (search for `secretKey`).
- Passwords: created/verified using bcrypt wrappers in `utils/hash.go` (`HashPassword`, `CheckPasswordHash`).
- Database: `db.InitDB()` creates tables (users, events, registrations) and opens `api.db` in repo root. There is no migration system—table changes are inline SQL in `db/createTables()`.

Key files to reference when editing or adding features

- `main.go` — server/bootstrap.
- `routes/routes.go` — route mapping and which endpoints require auth (e.g., POST `/events` is protected).
- `middlewares/auth.go` — how auth is enforced and how `userId` is propagated to handlers.
- `models/event.go`, `models/user.go` — DB access patterns and method names (`Save`, `Update`, `Delete`, `Register`, `CancelRegistration`, `ValidateCredentials`).
- `db/db.go` — DB connection and table creation; remember it uses package-level `var DB *sql.DB` accessed by models.
- `utils/jwt.go`, `utils/hash.go` — token and password helper functions used throughout.

Concrete examples and patterns

- Route protection: create handler functions and register them under `authenticated := server.Group("/")` and `authenticated.Use(middlewares.Authenticate)` in `routes.RegisterRoutes`.
- Accessing current user in handlers: `userId, _ := c.Get("userId")` then cast to `int64` (note: `Authenticate` stores `int64`).
- Persisting events: `event.Save()` expects `Event.DateTime` as `time.Time`; handlers should bind JSON to `models.Event` and validate using Gin binding tags (e.g., `binding:"required"`).
- JWT usage: `Authorization` header contains the token string. Pass that raw string to `utils.VerifyToken`.

Developer workflows and commands

- Run locally: `go run main.go`. Server listens on `:8080`.
- DB is created automatically when the server starts (`api.db`). To reset, delete `api.db` and restart.
- Quick API testing: there are `.http` test files in `api-test/` (use any HTTP client or the provided files). They demonstrate endpoints such as `/signup`, `/login`, `/events`.

Conventions and gotchas (project-specific)

- No separate migration tool—DB schema lives in `db/db.go`; changing column names/types requires manual migration (or drop `api.db`).
- Models directly use the global `db.DB`. When adding new DB logic, use `db.DB` consistently and close statements/rows properly (current code uses `defer stmt.Close()` and `defer rows.Close()`).
- Token handling is minimal: tokens are considered raw strings. Do not add an expectation of `Bearer ` prefix unless you update `middlewares.Authenticate` and all `.http` tests.

When adding tests or examples

- Provide one small integration test that boots `main` and runs a request against `/signup` and `/login`, or mock `db.DB` for unit tests. The project currently has no test harness.

If you need more context

- Inspect `routes/` handlers and `api-test/*.http` for live examples of request/response shapes.
- Look at `models/*.go` for SQL column ordering (Scan/Exec positional parameters must match table definitions).

If something is ambiguous in a task, ask: "Should the Authorization header use 'Bearer <token>' or the raw token currently expected?" or "Preserve current inline SQL schema or add migration support?"

---
Please review and tell me if you'd like changes (e.g., add code snippets for creating tokens or a recommended test file). 
