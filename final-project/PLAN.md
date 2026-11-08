# Plan: Houseplant journal

Same types as last course. This week I put them in Mongo instead of arrays.

## Types

Room, Plant, CareEvent. CareKind is WATER / FERTILIZE / REPOT.

## Relationships

Plant → Room is a **reference** (`roomId`). I query rooms on their own and more than one plant can be in a room.

Room → plants is a nested resolver, `Plant.find({ roomId })`. Indexed.

Plant → care events is **embedded**. A watering doesn't exist without the plant and I never list every event in the whole db. Delete the plant, the log goes with it.

CareEvent → plant is just the parent document.

lastWatered isn't stored. Newest WATER, or null if it's never been watered.

## Week 1

Models + nested resolvers. Empty db gets the original 3 rooms / 4 plants.
