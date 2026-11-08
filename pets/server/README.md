# Pets server

Apollo Server 5 + MongoDB. Run `npm run dev` and open http://localhost:4000.

Put the Atlas connection string in `.env` as `MONGO_URI`. That file is not committed.

## Add a shelter

```graphql
mutation {
  addShelter(name: "Happy Tails", city: "Oakland") {
    id
    name
  }
}
```

## Add a pet

```graphql
mutation {
  addPet(name: "Biscuit", species: "cat", age: 3, shelterId: "PASTE_ID") {
    name
    shelter {
      name
    }
  }
}
```

## Shelters with their pets

```graphql
{
  shelters {
    name
    pets {
      name
      species
    }
  }
}
```

**Result:** pets grouped under each shelter

## Validation error

```graphql
mutation {
  addPet(name: "Smaug", species: "dragon") {
    name
  }
}
```

**Result:** Mongoose rejects `dragon` because species is an enum

## Delete a shelter

`deleteShelter` refuses if the shelter still has pets. Pets are their own records; deleting the shelter would leave them pointing at nothing.

# What connects everything

The database stores `shelterId`. Nested resolvers `Pet.shelter` and `Shelter.pets` turn that ID into objects, same idea as the plant journal.
