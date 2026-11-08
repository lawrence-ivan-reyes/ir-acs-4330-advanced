# Pets server

GraphQL API for pets and shelters. Data is in MongoDB.

## Run

```bash
npm i
npm run dev
```

http://localhost:4000

## Notes

- Pets store `shelterId`. Nested resolvers fill in `shelter` / `pets`.
- `species` is an enum: cat, dog, bird, rabbit, other.
- `deleteShelter` fails if the shelter still has pets.
- Mutations that change data require a login. Adding a shelter is admin-only. You can only update/delete your own pets.
