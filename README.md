# Synota Take Home

## Things to Do:

Build a server-side app (REST API) that can do the following:

- [ ] Secure Login
- [ ] Permissioned access and control of a resource (perhaps a todo list)
- [ ] Non volatile memory to persist across restarts (SQL database, perhaps)
- [ ] It should have tests that automatically run in CI/CD (perhaps GH Actions)
- [ ] It should deploy to a host upon successful automated testing (perhaps heroku, render, fly.io, etc.)

## Prerequisites

- [node ^18.13.0](/package.json#L7)
  - This is the [Active LTS](https://nodejs.org/en/about/releases/) release. This is the minimum version any current Node.js app should support.
- [yarn ^1.22.4](/package.json#L8)
  - Specifying a `yarn` minimum version is very arbitrary but it should still be specified.

## Install

```sh
yarn install
```

### First time setup

- Create a copy of `.env-sample` and name it `.env` in the root directory. Update the env vars as needed before running the app.

## Usage

```sh
# for prod deployment
yarn build # Probably run this in your build pipeline
yarn start

# OR #

# for local development
yarn dev

# OR #

# for local development with file watch (auto-restart)
yarn watch
```

## Run tests

```sh
yarn test
```
