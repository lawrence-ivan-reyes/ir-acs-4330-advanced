# Houseplant journal

Same GraphQL API as ACS 4330, now on MongoDB. See [PLAN.md](PLAN.md) for embed vs reference.

```bash
cd server && npm install && npm run dev
```

Put the Atlas URI in `server/.env`. Data persists across restarts. An empty database gets the original four plants.

# What connects everything

Plants store `roomId`. Nested resolvers join rooms and plants. Care events are embedded on the plant, so `lastWatered` is still computed from that list.
