# Mode opératoire SVT Quest — démarrer / arrêter / redémarrer
#
# Usage :
#   make start          # front + API en local
#   make stop           # arrête le local (ports Vite + API)
#   make restart        # stop puis start
#   make status         # état des ports
#
#   make docker-start   # build + up Docker
#   make docker-stop    # down Docker
#   make docker-restart # rebuild + up
#   make docker-status  # ps Docker

.PHONY: start stop restart status \
	docker-start docker-stop docker-restart docker-status \
	help

ROOT := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))
PID_DIR := $(ROOT).pids
DEV_PID := $(PID_DIR)/dev.pid

# Ports (surchargeables) — alignés sur .env
API_PORT ?= 8787
WEB_PORT ?= 5173
HOST_PORT ?= 8088

help:
	@echo "SVT Quest — commandes"
	@echo ""
	@echo "  make start           Démarre API + Vite (local)"
	@echo "  make stop            Arrête le local"
	@echo "  make restart         Redémarre le local"
	@echo "  make status          Affiche l'état des ports"
	@echo ""
	@echo "  make docker-start    Build + démarre Docker"
	@echo "  make docker-stop     Arrête Docker"
	@echo "  make docker-restart  Rebuild + redémarre Docker"
	@echo "  make docker-status   Statut du conteneur"
	@echo ""
	@echo "Ports : web=$(WEB_PORT) api=$(API_PORT) docker=$(HOST_PORT)"

# ---------- Local ----------

start: stop
	@mkdir -p "$(PID_DIR)"
	@echo "→ Démarrage local (API :$(API_PORT) + Vite :$(WEB_PORT))…"
	@PORT=$(API_PORT) npx concurrently -k -n api,web -c cyan,magenta \
		"node --watch server/index.mjs" \
		"npx vite --port $(WEB_PORT)" \
		> "$(PID_DIR)/dev.log" 2>&1 & echo $$! > "$(DEV_PID)"
	@sleep 1
	@echo "  logs : $(PID_DIR)dev.log"
	@echo "  app  : http://localhost:$(WEB_PORT)/"
	@echo "  api  : http://localhost:$(API_PORT)/health"
	@$(MAKE) --no-print-directory status

stop:
	@echo "→ Arrêt local…"
	@if [ -f "$(DEV_PID)" ]; then \
		kill "$$(cat "$(DEV_PID)")" 2>/dev/null || true; \
		rm -f "$(DEV_PID)"; \
	fi
	@-pkill -f "concurrently -k -n api,web" 2>/dev/null || true
	@-pkill -f "node --watch server/index.mjs" 2>/dev/null || true
	@-pkill -f "vite --port $(WEB_PORT)" 2>/dev/null || true
	@-pkill -f "vite" 2>/dev/null || true
	@$(MAKE) --no-print-directory _free-port PORT_TO_FREE=$(WEB_PORT)
	@$(MAKE) --no-print-directory _free-port PORT_TO_FREE=$(API_PORT)
	@echo "  local arrêté."

restart: stop
	@$(MAKE) --no-print-directory start

status:
	@echo "État des ports :"
	@$(MAKE) --no-print-directory _port-status LABEL=web PORT_TO_CHECK=$(WEB_PORT)
	@$(MAKE) --no-print-directory _port-status LABEL=api PORT_TO_CHECK=$(API_PORT)
	@$(MAKE) --no-print-directory _port-status LABEL=docker PORT_TO_CHECK=$(HOST_PORT)

# ---------- Docker ----------

docker-start:
	@echo "→ Docker up (hôte :$(HOST_PORT))…"
	@HOST_PORT=$(HOST_PORT) docker compose up --build -d
	@echo "  app Docker : http://localhost:$(HOST_PORT)/"
	@$(MAKE) --no-print-directory docker-status

docker-stop:
	@echo "→ Docker down…"
	@HOST_PORT=$(HOST_PORT) docker compose down
	@echo "  Docker arrêté."

docker-restart:
	@echo "→ Docker restart…"
	@HOST_PORT=$(HOST_PORT) docker compose down
	@HOST_PORT=$(HOST_PORT) docker compose up --build -d
	@echo "  app Docker : http://localhost:$(HOST_PORT)/"
	@$(MAKE) --no-print-directory docker-status

docker-status:
	@HOST_PORT=$(HOST_PORT) docker compose ps

# ---------- helpers ----------

_free-port:
	@PIDS=$$(lsof -tiTCP:$(PORT_TO_FREE) -sTCP:LISTEN 2>/dev/null || true); \
	if [ -n "$$PIDS" ]; then \
		echo "  libère :$(PORT_TO_FREE) ($$PIDS)"; \
		kill $$PIDS 2>/dev/null || true; \
		sleep 0.3; \
		kill -9 $$PIDS 2>/dev/null || true; \
	fi

_port-status:
	@if lsof -tiTCP:$(PORT_TO_CHECK) -sTCP:LISTEN >/dev/null 2>&1; then \
		echo "  ✓ $(LABEL) :$(PORT_TO_CHECK) en écoute"; \
	else \
		echo "  · $(LABEL) :$(PORT_TO_CHECK) libre"; \
	fi
