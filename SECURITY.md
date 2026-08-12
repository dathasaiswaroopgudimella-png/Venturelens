# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability within **Venturelens**, please report it immediately to the repository owner.

### Scope & Guidelines
- Authentication & Supabase RLS (Row Level Security) policy enforcement.
- API route rate limiting and input validation (`/api/analyze`, `/api/reports`).
- Secret management (environment variables for AI provider keys).
- Do not commit production `.env` files or API secrets.
