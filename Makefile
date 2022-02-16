setup: setup_git_hooks setup_env_files

setup_git_hooks:
	cp setup/git/* .git/hooks/
	chmod u+x .git/hooks/*

setup_env_files:
	cp -n .env.example .env
	cp -n api/.env.example api/.env
	cp -n web/.env.example web/.env

# Open bash terminal inside API container
connect_api:
	docker-compose exec ourgroup-api sh

# Open PSQL terminal inside database container
connect_db:
	docker-compose exec ourgroup-db psql -U ourgroup
