# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This is a fork of [Basecamp's Fizzy](https://github.com/basecamp/fizzy), a kanban-style project management tool. This fork is being used to explore repurposing Fizzy for other use cases (e.g., personal reading lists, content curation) beyond traditional issue tracking.

**Local Setup:**
- Account: `cleanslate` (ID: `338000007`)
- Users: `jacob@example.com` (owner), `claude@example.com` (member)
- When creating cards programmatically, use the Claude user as creator and assign to Jacob
- Cards created via Rails console are in **draft state** - they must be "published" via the UI or have their draft status cleared to appear on boards

## Development Commands

### Setup and Server
```bash
bin/setup              # Initial setup (installs gems, creates DB, loads schema)
bin/setup --reset      # Reset database and reseed (destroys data!)
bin/dev                # Start development server (runs on port 3006)
mise exec -- bin/dev   # Use this if mise Ruby isn't in your shell PATH
```

Development URL: http://fizzy.localhost:3006
Login: Enter email, verification code appears on-screen in dev mode

### Testing
```bash
bin/rails test                         # Run unit tests
bin/rails test test/path/file_test.rb  # Run single test file
bin/rails test:system                  # Run system tests (Capybara + Selenium)
bin/ci                                 # Full CI suite (rubocop, security, tests)
PARALLEL_WORKERS=1 bin/rails test      # Fix parallel test issues
```

### Database
```bash
bin/rails db:fixtures:load   # Load fixture data
bin/rails db:migrate         # Run migrations
bin/rails db:reset           # Drop, create, load schema
```

### Creating Cards Programmatically
```ruby
# Example: Create a card as Claude, assign to Jacob
account = Account.find_by(name: "cleanslate")
board = account.boards.first
column = board.columns.first
claude = account.users.find_by(name: "Claude")
jacob = account.users.find_by(name: "Jacob")

card = account.cards.create(
  title: "Card title",
  description: "Description with **markdown**",
  board: board,
  column: column,
  creator: claude
)
card.assignments.create(assignee: jacob, assigner: claude)
```

## Architecture Overview

### Multi-Tenancy (URL Path-Based)
- Each Account has a unique `external_account_id` (7+ digits)
- URLs prefixed: `/{account_id}/boards/...`
- Middleware `AccountSlug::Extractor` sets `Current.account` from URL
- All models scoped by `account_id`

### Core Domain Models
- **Account** → Tenant/organization with users, boards, cards
- **Identity** → Global user (email), can have Users in multiple Accounts
- **User** → Account membership with role (owner/admin/member/system)
- **Board** → Has columns, can be "all access" or selective via `Access` records
- **Card** → Work item with sequential number, rich text, attachments
- **Column** → Workflow stage within a board
- **Assignment** → Links card to user (assignee + assigner)
- **Event** → Audit log driving activity timeline and notifications

### Authentication
Passwordless magic link auth:
- `Identity` receives magic link email
- In dev mode, verification code displays on-screen
- Sessions via signed cookies

### Background Jobs (Solid Queue)
Database-backed queue (no Redis). Jobs auto-capture `Current.account` context.

### Entropy System
Cards auto-postpone to "not now" after inactivity period (configurable per Account/Board).

## Coding Style

See `STYLE.md` for detailed conventions. Key points:
- Prefer expanded conditionals over guard clauses
- Order methods by invocation order (callers before callees)
- Indent private methods under `private` keyword (no blank line after)
- Model actions as CRUD on resources (create `resource :closure` not `post :close`)
- Thin controllers, rich domain models (vanilla Rails approach)
- Jobs delegate to models: `_later` suffix enqueues, `_now` suffix executes

## What Works Locally vs Production

| Feature | Local | Production |
|---------|-------|------------|
| Board/card CRUD | Yes | Yes |
| Magic link auth | Code on-screen | Email sent |
| Push notifications | Needs VAPID keys | Yes |
| File uploads | Local disk | S3 optional |
| Background jobs | Solid Queue (SQLite) | Solid Queue |
