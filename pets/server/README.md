# Pets

`npm run dev` → http://localhost:4000

## Add a shelter

```graphql
mutation {
  addShelter(name: "Happy Tails", city: "Oakland") {
    id
    name
  }
}
```

**Result:** Happy Tails. Copy the `id` for the next one.

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

**Result:** Biscuit, shelter Happy Tails

## Shelters with pets

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

**Result:** Happy Tails had Biscuit and Noodle. Paw Place had Pip, Clover, and Mango.

## dragon

```graphql
mutation {
  addPet(name: "Smaug", species: "dragon") {
    name
  }
}
```

**Result:** `species: \`dragon\` is not a valid enum value`

## deleteShelter

I don't delete a shelter if it still has pets. Pets are their own documents so I'd end up with pets pointing at nothing.

# What connects everything

`shelterId` on the pet. Nested resolvers fill in `shelter` and `pets`.
