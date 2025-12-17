all: build up

build:
	docker-compose -f srcs/docker-compose.yml build

# -f especifica el path del compose file

up:
	docker-compose -f srcs/docker-compose.yml up -d

# stops AND removes containers
down:
	docker-compose -f srcs/docker-compose.yml down || true

# down + removes volumes
clean: down
	docker-compose -f srcs/docker-compose.yml down -v || true
#	-sudo rm -rf /home/martalc/data/wordpress/* || true
#	-sudo rm -rf /home/martalc/data/database/* || true
# quita los host files, si no los quitamos volverian a aparecer en los nuevos contenedores porque realmente estos volumes son bind mounts (nosotros escogemos la ruta donde guarda el host los archivos)

# stops, removes & cleans in depth, including images and cached docker processes
deep-clean: clean
	docker rmi -f transcendence-nginx-front:latest transcendence-api-gateway:latest 2>/dev/null || true
	docker system prune -a -f || true
	
rebuild: deep-clean build up

# Show logs for all services
logs:
	docker-compose -f srcs/docker-compose.yml logs -f || true

# -f del final es 'force', para que no te pregunte

help:
	@echo "Makefile rules:"
	@echo "  all           : build and start containers"
	@echo "  build         : build images"
	@echo "  up            : start containers in detached mode"
	@echo "  down          : stop and remove containers"
	@echo "  clean         : stop and remove containers + remove volumes"
	@echo "  deep-clean    : stop and remove containers + remove volumes + remove images + prune"
	@echo "  rebuild       : deep-clean, build and start containers"
	@echo "  logs          : show live logs of all services"

.PHONY: all build up down clean logs help
