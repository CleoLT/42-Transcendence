
# Default mode
MODE ?= dev

#echo "Active mode: $(MODE)"

# Compose command selector
ifeq ($(MODE),prod)
DC = docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.prod.yml
else
DC = docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.dev.yml
endif

all: build up

build:
	$(DC) build

up:
	$(DC) up -d

down:
	$(DC) down || true

restart: 
	$(DC) down 
	$(DC) up -d

clean:
	$(DC) down -v || true
	rm -rf ./srcs/containers/user/user-service/uploads/avatars
	find ./srcs/containers -type d -name node_modules -prune -exec rm -rf {} +
	# anonymous volumes like /app/node_modules are removed here

deep-clean: clean
	$(DC) down -v --rmi all || true
	docker system prune -a -f || true
	docker builder prune -a -f || true
	docker volume prune -f || true

remake:
	$(DC) down --rmi all || true
	$(DC) up -d

rebuild: deep-clean build up

# Mode shortcuts
dev:
	$(MAKE) MODE=dev all

prod:
	$(MAKE) MODE=prod all

dev-up:
	$(MAKE) MODE=dev up

prod-up:
	$(MAKE) MODE=prod up

dev-down:
	$(MAKE) MODE=dev down

prod-down:
	$(MAKE) MODE=prod down

dev-clean:
	$(MAKE) MODE=dev clean

prod-clean:
	$(MAKE) MODE=prod clean

dev-deep-clean:
	$(MAKE) MODE=dev deep-clean

prod-deep-clean:
	$(MAKE) MODE=prod deep-clean

logs:
	$(DC) logs -f || true

mode:
	@echo "Active mode: $(MODE)"

help:
	@echo "Makefile rules:"
	@echo "  make dev            : build + up (DEV mode)"
	@echo "  make prod           : build + up (PROD mode)"
	@echo "  make up             : up using current mode (default: dev)"
	@echo "  make build          : build images"
	@echo "  make down           : stop + remove containers"
	@echo "  make clean          : stop + remove containers & volumes"
	@echo "  make deep-clean     : clean + remove images + prune"
	@echo "  make dev-down       : stop + remove containers for DEV"
	@echo "  make prod-down      : stop + remove containers for PROD"
	@echo "  make dev-deep-clean : clean + remove images + prune for DEV mode"
	@echo "  make prod-deep-clean: clean + remove images + prune for PROD mode"
	@echo "  make restart        : remove + restart containers"
	@echo "  make remake         : remove containers + remove images + restart"
	@echo "  make rebuild        : deep-clean and start containers"
	@echo "  make logs           : follow logs"
	@echo "  make mode           : show active mode"
	@echo ""
	@echo "Override mode manually:"
	@echo "  make MODE=prod up"

.PHONY: all build up down restart clean deep-clean remake rebuild \
	dev prod dev-up prod-up dev-clean prod-clean logs mode help