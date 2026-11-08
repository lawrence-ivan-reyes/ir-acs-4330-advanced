# Pets client

React UI for the Pets API.

## Run

Start the server first, then:

```bash
npm i
npm run dev
```

http://localhost:5173

## Cache

- **Add** writes the new pet into the cache (`cache.modify`). No extra refetch.
- **Delete** removes it (`cache.evict`).
- **Rename** just returns `id` + `name`. Apollo patches the existing object.
- Add and delete are optimistic. Pets with a `temp-` id are faded until the server replies.
