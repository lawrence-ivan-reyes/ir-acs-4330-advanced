# Plan: Houseplant journal

Same app as ACS 4330: plants by room, plus a care log. This course puts it on MongoDB, then auth, cache, pagination, and deploy.

## Types

- **Room** — id, name, sunlight, plants
- **Plant** — id, name, species, room, careEvents, lastWatered
- **CareEvent** — id, kind (WATER / FERTILIZE / REPOT), note, at, plant

## Relationships

| Relationship | Choice | Why |
|---|---|---|
| Plant → Room | **Reference** `roomId` | A room is listed on its own (`rooms`) and shared by many plants. |
| Room → [Plant] | Nested resolver | `Plant.find({ roomId })`. `roomId` is indexed. |
| Plant → [CareEvent] | **Embed** | A care log only exists on that plant. We never query all events globally. Deleting a plant deletes its log. |
| CareEvent → Plant | Parent document | The event lives inside the plant, so the nested resolver uses the parent. |

`lastWatered` is still computed: newest embedded WATER event, or null.

## Week 1

Mongoose models, nested resolvers, validation. Seed three rooms and four plants if the database is empty.
