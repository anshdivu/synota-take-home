# Synota Take Home

## Things to Do:

Build a server-side app (REST API) that can do the following:

- [x] Secure Login
- [x] Permissioned access and control of a resource (perhaps a todo list)
- [x] Non volatile memory to persist across restarts (SQL database, perhaps)
- [x] It should have tests that automatically run in CI/CD (perhaps GH Actions)
- [x] It should deploy to a host upon successful automated testing (perhaps heroku, render, fly.io, etc.)
- [x] Make sure to document your process with Git on Github/Gitlab.

## Prod Deployment

- This application is deployed at - https://synota-take-home.onrender.com
- The API documentation is available at - https://synota-take-home.onrender.com/docs

## Prerequisites

- [node ^18.13.0](/package.json#L7)
  - This is the [Active LTS](https://nodejs.org/en/about/releases/) release. This is the minimum version any current Node.js app should support.
- [yarn ^1.22.4](/package.json#L8)
  - `brew install yarn`
- Postgresql@14
  - `brew install postgresql@14`

## Install

```sh
yarn install
```

## Database Setup (Mac OS)

1. Use [Homebrew](https://docs.brew.sh/Installation) to install Postgress version 14:
   `brew install postgresql@14`
2. Use instructions described by homebrew to either run postgres as a background service or a shell command. If you need to check the instructions again run:
   `brew info postgresql@14`
3. Create a Database for local development:
   `createdb synota`
4. Confirm the id of your shell user using:
   `whoami`
5. Create the Postgres `DATABASE_URL` using this pattern:
   `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
   - For you local postgres server the DATABASE_URL should be something like:
     `postgresql://<user-id>@localhost:5432/synota`

### First time setups

2. Create a copy of `.env-sample` and name it `.env` in the root directory. Update the env vars especially the `DATABASE_URL`.
3. Run Database initialization script - `yarn db:init`

## Usage

```sh
# run local instance of postgres
## follow the instructions described in `brew info postgresql@14`

# for local development
yarn dev

# OR #

# for local development with file watch (auto-restart)
yarn dev:watch

# OR #

# for prod deployment
yarn build # Run this in the build pipeline
yarn start
```

## Run tests

```sh
yarn test

# OR #

# for local development with file watch (auto-restart)
yarn test:watch
```
