# Houseplant journal

Track plants by room and log watering, fertilizer, and repots.

## Stack

Apollo Server 5 · MongoDB · React · Apollo Client 4

## Run

```bash
cd server && npm i && npm run dev
cd client && npm i && npm run dev
```

| | URL |
|---|---|
| GraphQL | http://localhost:4000 |
| App | http://localhost:5173 |

Empty database seeds four plants. First account to register is an admin.

## Data

- **Room** is its own collection; plants point at it with `roomId`
- **Care events** live on the plant document; deleting a plant deletes the log
- `lastWatered` is computed (newest WATER event)

## Client

- Add plant refetches rooms (lists are nested by room)
- Watering is optimistic
- Delete evicts the plant from the cache
- Care and delete are hidden unless you're logged in; delete only shows on plants you own

See [PLAN.md](PLAN.md) for embed vs reference.
