# Synota Take Home

## Things to Do:

Build a server-side app (REST API) that can do the following:

- [ ] Secure Login
- [ ] Permissioned access and control of a resource (perhaps a todo list)
- [ ] Non volatile memory to persist across restarts (SQL database, perhaps)
- [ ] It should have tests that automatically run in CI/CD (perhaps GH Actions)
- [ ] It should deploy to a host upon successful automated testing (perhaps heroku, render, fly.io, etc.)
- [ ] Make sure to document your process with Git on Github/Gitlab.

## Prerequisites

- [node ^18.13.0](/package.json#L7)
  - This is the [Active LTS](https://nodejs.org/en/about/releases/) release. This is the minimum version any current Node.js app should support.
- [yarn ^1.22.4](/package.json#L8)
  - `brew install yarn`
- Postgresql@14
  - `brew install postgresql`

## Install

```sh
yarn install
```

### First time setups

1. Create a Database for local development - `createdb synota`
2. Create a copy of `.env-sample` and name it `.env` in the root directory. Update the env vars especially the `DATABASE_URL`.
3. Run Database initialization script - `yarn db:init`

## Usage

```sh
# run local instance of postgres
yarn dev:db

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
