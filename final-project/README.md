# Houseplant journal

Last course's plant API, now in Mongo. Notes on embed vs reference are in [PLAN.md](PLAN.md).

```bash
cd server && npm run dev
cd client && npm run dev
```

Empty db seeds Monty, Fig, Snake, Basil.

## plants

```graphql
{
  plants {
    name
    room {
      name
    }
    lastWatered
  }
}
```

**Result:** Fig had no lastWatered. The others had the seed dates.

## water a plant

```graphql
mutation {
  addCareEvent(plantId: "PASTE_ID", kind: WATER) {
    kind
    plant {
      name
      lastWatered
    }
  }
}
```

**Result:** Fig's lastWatered became the time I ran it. Restarted the server and it was still there.

# What connects everything

`roomId` on the plant. Care events sit on the plant document. `lastWatered` is the newest WATER event, not its own field.
