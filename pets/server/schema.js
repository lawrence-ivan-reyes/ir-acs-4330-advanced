const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Shelter {
    id: ID!
    name: String!
    city: String!
    pets: [Pet!]!
  }

  type Pet {
    id: ID!
    name: String!
    species: String!
    age: Int
    shelter: Shelter
    createdBy: User
  }

  type Query {
    me: User
    pets: [Pet!]!
    pet(id: ID!): Pet
    shelters: [Shelter!]!
    shelter(id: ID!): Shelter
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addPet(name: String!, species: String!, age: Int, shelterId: ID): Pet!
    updatePet(id: ID!, name: String, species: String, age: Int, shelterId: ID): Pet
    deletePet(id: ID!): Boolean!
    addShelter(name: String!, city: String!): Shelter!
    deleteShelter(id: ID!): Boolean!
  }
`

export default typeDefs
