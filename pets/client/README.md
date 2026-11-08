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

- **Add** writes the new pet into the cache (`cache.modify`) with no extra refetch
- **Delete** removes it (`cache.evict`)
- **Rename** returns `id` + `name` so Apollo patches the existing object
- Add and delete are optimistic; `temp-` ids are faded until the server replies
