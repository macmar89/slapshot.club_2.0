COMPOSE_LOCAL = docker compose -p slapshot_club -f docker-compose.local.yml --env-file .env.local

BE = $(COMPOSE_LOCAL) exec backend
FE = $(COMPOSE_LOCAL) exec frontend

TEST_DATABASE_URL = postgres://user:password@postgres_test:5432/slapshot_club_test

.DEFAULT_GOAL := help

.PHONY: help
help:
	@echo "Local dev stack (postgres + postgres_test + redis + backend + frontend):"
	@echo "  make local              build + up (foreground, logs attached)"
	@echo "  make run-local          up -d (detached)"
	@echo "  make stop-local         down"
	@echo "  make restart-local      down + up -d"
	@echo "  make restart-local-be   restart only the backend container"
	@echo "  make restart-local-fe   restart only the frontend container"
	@echo "  make rebuild-local      rebuild the dev image + up -d"
	@echo "  make clean-local        down -v (DROPS the database volume)"
	@echo "  make ps                 container status"
	@echo ""
	@echo "Logs / shells:"
	@echo "  make logs-local         follow all logs"
	@echo "  make logs-local-be      follow backend logs"
	@echo "  make logs-local-fe      follow frontend logs"
	@echo "  make local-be-sh        shell into the backend container"
	@echo "  make local-fe-sh        shell into the frontend container"
	@echo ""
	@echo "Checks:"
	@echo "  make local-be-check     backend: tsc build + prettier check"
	@echo "  make local-be-test      backend: vitest against postgres_test"
	@echo "  make local-fe-check     frontend: eslint + next build"
	@echo "  make check              all of the above"
	@echo "  make format             prettier --write in backend + frontend"
	@echo ""
	@echo "Database (drizzle, runs inside the backend container):"
	@echo "  make local-db-migrate   apply pending migrations"
	@echo "  make local-db-push-test sync schema into postgres_test (needed by tests)"
	@echo "  make local-db-generate  generate a migration from the schema"
	@echo "  make local-db-push      push the schema without a migration"
	@echo "  make local-db-studio    drizzle studio (https://local.drizzle.studio)"
	@echo "  make local-db-seed      seed the admin user"
	@echo "  make local-db-seed-users  seed demo users"
	@echo "  make local-db-sh        psql shell into the dev database"
	@echo "  make local-db-test-sh   psql shell into the test database"
	@echo "  make setup              run-local + wait + migrate + seed admin"
	@echo ""
	@echo "Deploys (test + production) run through Coolify - not covered here."

# ---------------------------------------------------------------- stack

.PHONY: local
local:
	$(COMPOSE_LOCAL) up --build

.PHONY: run-local
run-local:
	$(COMPOSE_LOCAL) up -d --build

.PHONY: stop-local
stop-local:
	$(COMPOSE_LOCAL) down

.PHONY: restart-local
restart-local: stop-local run-local

.PHONY: restart-local-be
restart-local-be:
	$(COMPOSE_LOCAL) restart backend

.PHONY: restart-local-fe
restart-local-fe:
	$(COMPOSE_LOCAL) restart frontend

.PHONY: rebuild-local
rebuild-local:
	$(COMPOSE_LOCAL) build --no-cache
	$(COMPOSE_LOCAL) up -d

.PHONY: clean-local
clean-local:
	$(COMPOSE_LOCAL) down -v

.PHONY: ps
ps:
	$(COMPOSE_LOCAL) ps

# ---------------------------------------------------------------- logs / shells

.PHONY: logs-local
logs-local:
	$(COMPOSE_LOCAL) logs -f

.PHONY: logs-local-be
logs-local-be:
	$(COMPOSE_LOCAL) logs -f backend

.PHONY: logs-local-fe
logs-local-fe:
	$(COMPOSE_LOCAL) logs -f frontend

.PHONY: local-be-sh
local-be-sh:
	$(BE) bash

.PHONY: local-fe-sh
local-fe-sh:
	$(FE) bash

# ---------------------------------------------------------------- checks

.PHONY: local-be-check
local-be-check:
	$(BE) npm run build
	$(BE) npx prettier --check "src/**/*.{ts,tsx,js,jsx,json,md}"

.PHONY: local-be-test
local-be-test:
	$(COMPOSE_LOCAL) exec \
		-e NODE_ENV=test \
		-e DATABASE_URL=$(TEST_DATABASE_URL) \
		backend npm test -- --run

.PHONY: local-fe-check
local-fe-check:
	$(FE) npm run lint
	$(FE) npm run build

.PHONY: check
check: local-be-check local-be-test local-fe-check

.PHONY: format
format:
	$(BE) npm run format
	$(FE) npm run format

# ---------------------------------------------------------------- database

.PHONY: local-db-migrate
local-db-migrate:
	$(BE) npm run db:migrate

.PHONY: local-db-generate
local-db-generate:
	$(BE) npm run db:generate

.PHONY: local-db-push
local-db-push:
	$(BE) npm run db:push

.PHONY: local-db-push-test
local-db-push-test:
	$(COMPOSE_LOCAL) exec \
		-e NODE_ENV=test \
		-e DATABASE_URL=$(TEST_DATABASE_URL) \
		backend npm run db:push:test -- --force

.PHONY: local-db-studio
local-db-studio:
	$(BE) npm run db:studio -- --host 0.0.0.0 --port 4983

.PHONY: local-db-seed
local-db-seed:
	$(BE) npm run seed:admin

.PHONY: local-db-seed-users
local-db-seed-users:
	$(BE) npm run seed:users

.PHONY: local-db-sh
local-db-sh:
	$(COMPOSE_LOCAL) exec postgres psql -U $${POSTGRES_USER:-user} -d $${POSTGRES_DB:-slapshot_club}

.PHONY: local-db-test-sh
local-db-test-sh:
	$(COMPOSE_LOCAL) exec postgres_test psql -U $${POSTGRES_USER:-user} -d $${POSTGRES_TEST_DB:-slapshot_club_test}

.PHONY: setup
setup: run-local
	@echo "waiting for the backend container..."
	@until $(COMPOSE_LOCAL) exec -T backend true 2>/dev/null; do sleep 2; done
	$(MAKE) local-db-migrate
	$(MAKE) local-db-seed
