# ACS 4330 Advanced

Pets is the lesson app. Houseplant journal is the project.

## Stack

Apollo Server 5 · MongoDB · Mongoose · React · Apollo Client 4

## Run

One GraphQL server at a time (both use port 4000).

```bash
# Pets
cd pets/server && npm run dev
cd pets/client && npm run dev

# Plant journal
cd final-project/server && npm run dev
cd final-project/client && npm run dev
```

| | URL |
|---|---|
| GraphQL | http://localhost:4000 |
| Client | http://localhost:5173 |

Mongo is local (`mongodb://127.0.0.1:27017`). Connection strings live in each server's `.env`.

## Progress

- [x] Week 1 — MongoDB
- [x] Week 2 — Apollo cache
- [x] Week 3 — Auth
- [ ] Week 4 — Pagination
- [ ] Week 5 — Subscriptions
- [ ] Week 6 — DataLoader
- [ ] Week 7 — Deploy
