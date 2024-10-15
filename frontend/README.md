# Komodo Frontend

Komodo JS stack uses Yarn + Vite + React + Tailwind + shadcn/ui

## Setup Dev Environment

The frontend depends on the local package `komodo_client` located at `/client/core/ts`.
This must first be built and prepared for yarn link.

The following command should setup everything up (run with /frontend as working directory):

```sh
cd ../client/core/ts && yarn && yarn build && yarn link && \
cd ../../../frontend && yarn link komodo_client && yarn
```

You can make a new file `.env.development` (gitignored) which holds:
```sh
VITE_KOMODO_HOST=https://demo.komo.do
```
You can point it to any Komodo host you like, including the demo.

Now you can start the dev frontend server:
```sh
yarn dev
```