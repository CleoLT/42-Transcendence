DEV_PROFILE  = dev
PROD_PROFILE = prod

# Default profile
PROFILE ?= $(DEV_PROFILE)

DC = docker-compose -f srcs/docker-compose.yml --profile $(PROFILE)

all: build up

build:
	$(DC) build

up:
	$(DC) up -d

down:
	$(DC) down || true

restart: down up

clean:
	$(DC) down -v || true
	# anonymous volumes like /app/node_modules are removed here

deep-clean: clean
	$(DC) down -v --rmi all || true
	docker system prune -a -f || true
	docker volume prune -f || true

remake:
	$(DC) down --rmi all || true
	$(DC) up -d

rebuild: deep-clean build up

# profile shortcuts
dev:
	$(MAKE) PROFILE=$(DEV_PROFILE) all

prod:
	$(MAKE) PROFILE=$(PROD_PROFILE) all

dev-up:
	$(MAKE) PROFILE=$(DEV_PROFILE) up

prod-up:
	$(MAKE) PROFILE=$(PROD_PROFILE) up

dev-clean:
	$(MAKE) PROFILE=$(DEV_PROFILE) clean

prod-clean:
	$(MAKE) PROFILE=$(PROD_PROFILE) clean

logs:
	$(DC) logs -f || true

profile:
	@echo "Active profile: $(PROFILE)"

help:
	@echo "Makefile rules:"
	@echo "  make dev            : build + up (DEV profile)"
	@echo "  make prod           : build + up (PROD profile)"
	@echo "  make up             : up using current profile (default: dev)"
	@echo "  make build          : build images"
	@echo "  make down           : stop + remove containers"
	@echo "  make clean          : stop + remove containers & volumes"
	@echo "  make deep-clean     : clean + remove images + prune"
	@echo "  make restart        : remove + restart containers (same images)"
	@echo "  make remake         : remove containers + remove images + restart conatiners"
	@echo "  make rebuild        : deep-clean and start containers"
	@echo "  make logs           : follow logs"
	@echo "  make profile        : show active profile"
	@echo ""
	@echo "Override profile manually:"
	@echo "  make PROFILE=prod up"

.PHONY: all build up down restart clean deep-clean remake rebuild \
        dev prod dev-up prod-up dev-clean prod-clean logs profile help

