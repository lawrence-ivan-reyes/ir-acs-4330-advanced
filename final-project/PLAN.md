# Plan

Houseplant journal: rooms, plants, care log.

## Relationships

| | How | Why |
|---|---|---|
| Plant → Room | reference `roomId` | Rooms are listed on their own and shared |
| Room → plants | nested resolver | `Plant.find({ roomId })`, indexed |
| Plant → care events | embed | A log entry doesn't exist without the plant |
| CareEvent → plant | parent document | Event is stored on the plant |

`lastWatered` is not stored. It's the newest WATER event, or null.

## Pagination

`plantsConnection` uses cursor pagination (Load more on the home shelf). New plants get larger ids so they append instead of shoving items onto a page you already viewed.

## Auth

Login required for every mutation. You can only edit/delete plants you created. Adding a room is admin-only. First registered user is admin.
