# Pets client

`npm run dev` while the server is on 4000.

Add used to not show up until I refreshed. The new pet was in the cache, it just wasn't on the `pets` list.

I tried `refetchQueries` first (two network requests). Then swapped add to `cache.modify` so it's one request. Delete uses `cache.evict`. Rename just returns `id` + `name` so Apollo patches the existing pet.

Add and delete are optimistic. A pet with a `temp-` id is faded until the server confirms.
