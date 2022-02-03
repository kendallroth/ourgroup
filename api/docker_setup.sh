# Ensure that Docker API packages are up-to-date when starting container,
#   as well as ensuring properly shared packages across Docker/host mount.

echo "Running Docker setup script"

cd /home/node/ourgroup-api

npm install
npm run start:dev
