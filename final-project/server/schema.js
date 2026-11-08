const typeDefs = `#graphql
  enum CareKind {
    WATER
    FERTILIZE
    REPOT
  }

  type User {
    id: ID!
    email: String!
    role: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Room {
    id: ID!
    name: String!
    sunlight: String
    plants: [Plant!]!
  }

  type Plant {
    id: ID!
    name: String!
    species: String
    room: Room!
    careEvents: [CareEvent!]!
    lastWatered: String
    createdBy: User
  }

  type CareEvent {
    id: ID!
    kind: CareKind!
    note: String
    at: String!
    plant: Plant!
  }

  type Query {
    me: User
    plants: [Plant!]!
    plant(id: ID!): Plant
    rooms: [Room!]!
    room(id: ID!): Room
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    addRoom(name: String!, sunlight: String): Room!
    addPlant(name: String!, species: String, roomId: ID!): Plant!
    updatePlant(id: ID!, name: String, species: String, roomId: ID): Plant
    deletePlant(id: ID!): Boolean!
    addCareEvent(plantId: ID!, kind: CareKind!, note: String): CareEvent!
  }
`

export default typeDefs
